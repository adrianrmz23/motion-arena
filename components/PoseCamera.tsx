'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { Camera, Check, Loader2, ScanLine, ShieldCheck, VideoOff, Zap } from 'lucide-react';
import { analyzePose, MotionSnapshot, Point } from '../lib/motion';

const CONNECTIONS: [number,number][] = [
  [11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],
  [23,25],[25,27],[24,26],[26,28],[27,31],[28,32]
];

const empty:MotionSnapshot={visible:false,centered:false,distanceOk:false,guard:false,leftJab:false,rightJab:false,dodge:null,crouch:false,confidence:0,bodyHeight:0};

type Props={ onReady?:(ready:boolean)=>void; compact?:boolean };

export default function PoseCamera({onReady,compact=false}:Props){
  const videoRef=useRef<HTMLVideoElement|null>(null);
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const landmarkerRef=useRef<PoseLandmarker|null>(null);
  const streamRef=useRef<MediaStream|null>(null);
  const rafRef=useRef<number|null>(null);
  const prevRef=useRef<Point[]|null>(null);
  const lastVideoTime=useRef(-1);
  const cooldown=useRef<Record<string,number>>({});
  const [status,setStatus]=useState<'idle'|'loading'|'running'|'error'>('idle');
  const [error,setError]=useState('');
  const [snapshot,setSnapshot]=useState<MotionSnapshot>(empty);
  const [lastMove,setLastMove]=useState('—');
  const [hits,setHits]=useState(0);

  const ready=snapshot.visible&&snapshot.centered&&snapshot.distanceOk;
  useEffect(()=>onReady?.(ready),[ready,onReady]);

  const fire=(name:string)=>{
    const now=performance.now();
    if((cooldown.current[name]??0)+480>now) return;
    cooldown.current[name]=now;
    setLastMove(name);
    if(name.includes('JAB')) setHits(v=>v+1);
  };

  const draw=(points:Point[])=>{
    const canvas=canvasRef.current, video=videoRef.current;
    if(!canvas||!video) return;
    const rect=video.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,rect.width*dpr); canvas.height=Math.max(1,rect.height*dpr);
    const ctx=canvas.getContext('2d'); if(!ctx) return;
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,rect.width,rect.height);
    const px=(p:Point)=>({x:p.x*rect.width,y:p.y*rect.height});
    ctx.lineWidth=3; ctx.lineCap='round'; ctx.strokeStyle='rgba(93, 240, 255, .78)';
    CONNECTIONS.forEach(([a,b])=>{ if((points[a]?.visibility??0)<.35||(points[b]?.visibility??0)<.35)return; const p=px(points[a]),q=px(points[b]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke(); });
    [0,11,12,13,14,15,16,23,24,25,26,27,28].forEach(i=>{const p=points[i];if(!p||(p.visibility??0)<.35)return;const q=px(p);ctx.beginPath();ctx.arc(q.x,q.y,i===15||i===16?7:5,0,Math.PI*2);ctx.fillStyle=i===15||i===16?'#ff5b43':'#eaff55';ctx.fill();});
  };

  const loop=useCallback(()=>{
    const video=videoRef.current, lm=landmarkerRef.current;
    if(!video||!lm||video.readyState<2){rafRef.current=requestAnimationFrame(loop);return;}
    if(video.currentTime!==lastVideoTime.current){
      lastVideoTime.current=video.currentTime;
      const result=lm.detectForVideo(video,performance.now());
      const points=(result.landmarks?.[0]||[]) as Point[];
      if(points.length){
        draw(points);
        const s=analyzePose(points,prevRef.current);
        setSnapshot(s);
        if(s.leftJab) fire('LEFT JAB');
        if(s.rightJab) fire('RIGHT JAB');
        if(s.dodge) fire(`DODGE ${s.dodge.toUpperCase()}`);
        if(s.crouch) fire('CROUCH');
        prevRef.current=points.map(p=>({...p}));
      } else setSnapshot(empty);
    }
    rafRef.current=requestAnimationFrame(loop);
  },[]);

  const start=async()=>{
    try{
      setStatus('loading'); setError('');
      if(!navigator.mediaDevices?.getUserMedia) throw new Error('Este navegador no permite acceder a la cámara.');
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});
      streamRef.current=stream;
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();}
      const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm');
      try{
        landmarkerRef.current=await PoseLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',delegate:'GPU'},runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});
      }catch{
        landmarkerRef.current=await PoseLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'},runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.5,minPosePresenceConfidence:.5,minTrackingConfidence:.5});
      }
      setStatus('running');
      rafRef.current=requestAnimationFrame(loop);
    }catch(e){
      setError(e instanceof Error?e.message:'No pudimos iniciar la cámara.'); setStatus('error');
      streamRef.current?.getTracks().forEach(t=>t.stop());
    }
  };

  useEffect(()=>()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);streamRef.current?.getTracks().forEach(t=>t.stop());landmarkerRef.current?.close();},[]);

  return <div className={`poseStation ${compact?'poseCompact':''}`}>
    <div className="cameraStage">
      <video ref={videoRef} className="cameraVideo" playsInline muted />
      <canvas ref={canvasRef} className="poseCanvas" />
      <div className="cameraHudTop"><span><ScanLine size={15}/> BODY TRACKING</span><b className={status==='running'?'online':''}>{status==='running'?'LIVE':'OFFLINE'}</b></div>
      <div className="frameCorners"><i/><i/><i/><i/></div>
      {status!=='running'&&<div className="cameraGate">
        <div className="gateIcon">{status==='loading'?<Loader2 className="spin"/>:status==='error'?<VideoOff/>:<Camera/>}</div>
        <h3>{status==='loading'?'Encendiendo Motion Engine':status==='error'?'No pudimos abrir la cámara':'Tu cuerpo es el control'}</h3>
        <p>{status==='error'?error:'La cámara se procesa localmente en tu navegador para detectar tu pose.'}</p>
        <button onClick={start} disabled={status==='loading'}>{status==='loading'?'CARGANDO…':status==='error'?'REINTENTAR':'ACTIVAR CÁMARA'} <Zap size={16}/></button>
      </div>}
      {status==='running'&&<div className="moveToast"><small>ÚLTIMO MOVIMIENTO</small><strong>{lastMove}</strong></div>}
    </div>
    <div className="trackingPanel">
      <div className="trackingHeader"><div><span>MOTION ENGINE v0.2</span><h3>Calibración en vivo</h3></div><div className={`signal ${ready?'good':''}`}>{Math.round(snapshot.confidence*100)}%</div></div>
      <div className="trackingChecks">
        <CheckRow ok={snapshot.visible} label="Cuerpo completo" detail="hombros · cadera · rodillas · tobillos"/>
        <CheckRow ok={snapshot.centered} label="Posición centrada" detail="mantente dentro del marco"/>
        <CheckRow ok={snapshot.distanceOk} label="Distancia de juego" detail="aprox. 2–3 m de la cámara"/>
      </div>
      <div className="moveGrid">
        <Move label="Guardia" active={snapshot.guard} icon="🛡️"/>
        <Move label="Jab izq." active={snapshot.leftJab} icon="↖"/>
        <Move label="Jab der." active={snapshot.rightJab} icon="↗"/>
        <Move label="Esquiva" active={!!snapshot.dodge} icon="↔"/>
      </div>
      <div className="hitCounter"><div><span>GOLPES DETECTADOS</span><strong>{hits.toString().padStart(2,'0')}</strong></div><ShieldCheck size={27}/></div>
    </div>
  </div>;
}

function CheckRow({ok,label,detail}:{ok:boolean,label:string,detail:string}){return <div className={`trackCheck ${ok?'ok':''}`}><i>{ok?<Check size={14}/>:''}</i><div><b>{label}</b><span>{detail}</span></div></div>}
function Move({label,active,icon}:{label:string,active:boolean,icon:string}){return <div className={`moveChip ${active?'active':''}`}><span>{icon}</span><b>{label}</b></div>}
