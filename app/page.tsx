'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowLeft, Camera, ChevronRight, CircleDot, Flame, Gamepad2, Gauge, Lock, Medal, Play, Radio, Shield, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import PoseCamera from '../components/PoseCamera';

type Screen='home'|'boxing'|'calibration'|'motionlab';
type Sport={id:string;name:string;kicker:string;icon:string;status:'ready'|'soon';tone:string;meta:string};

const sports:Sport[]=[
  {id:'boxing',name:'Boxing Arena',kicker:'Golpea · bloquea · esquiva',icon:'🥊',status:'ready',tone:'orange',meta:'BODY TRACKING'},
  {id:'ninja',name:'Ninja Reflex',kicker:'Reacción · velocidad · cardio',icon:'🥷',status:'soon',tone:'purple',meta:'REFLEX'},
  {id:'runner',name:'City Runner',kicker:'Corre · salta · agáchate',icon:'🏃',status:'soon',tone:'blue',meta:'FULL BODY'},
  {id:'tennis',name:'Shadow Tennis',kicker:'Swing · ritmo · coordinación',icon:'🎾',status:'soon',tone:'green',meta:'MOTION'},
  {id:'target',name:'Target Rush',kicker:'Golpea objetivos en 360°',icon:'🎯',status:'soon',tone:'yellow',meta:'REACTION'},
  {id:'boss',name:'Boss Battle',kicker:'Combos · resistencia · poder',icon:'👾',status:'soon',tone:'pink',meta:'CHALLENGE'},
];

const modes=[
  {title:'Motion Lab',subtitle:'Prueba la cámara y tus movimientos',icon:'◎',unlocked:true,action:'motion'},
  {title:'Quick Fight',subtitle:'3 rounds · 6 min',icon:'⚡',unlocked:true,action:'calibrate'},
  {title:'Combo Lab',subtitle:'Jab · cross · guardia',icon:'🎯',unlocked:true,action:'calibrate'},
  {title:'Survival',subtitle:'Oleadas infinitas',icon:'🔥',unlocked:false,action:'locked'},
];

export default function Home(){
  const [screen,setScreen]=useState<Screen>('home');
  const quote=useMemo(()=>['READY. SET. MOVE.','YOUR BODY. YOUR CONTROLLER.','PLAY HARD. MOVE MORE.'][new Date().getDate()%3],[]);
  if(screen==='boxing')return <BoxingHub onBack={()=>setScreen('home')} onGo={(s)=>setScreen(s)}/>;
  if(screen==='calibration')return <Calibration onBack={()=>setScreen('boxing')} onReady={()=>setScreen('motionlab')}/>;
  if(screen==='motionlab')return <MotionLab onBack={()=>setScreen('boxing')}/>;

  return <main className="arenaApp">
    <div className="skyGlow a"/><div className="skyGlow b"/><div className="courtLines"/>
    <header className="consoleBar">
      <div className="consoleBrand"><div className="brandOrb"><Activity/></div><div><strong>MOTION ARENA</strong><span>ACTIVE GAME SYSTEM</span></div></div>
      <div className="consoleStatus"><span><Radio size={14}/> MOTION ONLINE</span><span><Flame size={14}/> 7 DAY STREAK</span><button>AR</button></div>
    </header>

    <section className="stadiumHero">
      <div className="stadiumCopy">
        <div className="heroBadge"><Sparkles size={15}/> PLAYER ONE · LEVEL 18</div>
        <h1>{quote}</h1>
        <p>Convierte tu sala en una arena. La cámara lee tu cuerpo y cada movimiento mueve el juego.</p>
        <div className="heroActions"><button className="playBtn" onClick={()=>setScreen('boxing')}><Play fill="currentColor"/> START SESSION</button><div className="xpMeter"><span>NEXT LEVEL</span><b>2,480 / 3,000 XP</b><i><em/></i></div></div>
      </div>
      <div className="heroArena" aria-label="Motion Arena stadium preview">
        <div className="scoreRibbon"><span>SESSION 01</span><b>00:00</b><span>READY</span></div>
        <div className="avatarSilhouette"><div className="head"/><div className="torso"/><i className="limb la"/><i className="limb ra"/><i className="limb ll"/><i className="limb rl"/></div>
        <div className="targetRing r1"/><div className="targetRing r2"/><div className="targetRing r3"/>
        <span className="floatingMetric m1">+ SPEED</span><span className="floatingMetric m2">+ POWER</span><span className="floatingMetric m3">+ XP</span>
        <div className="floorGrid"/>
      </div>
    </section>

    <section className="chooseArena">
      <div className="sectionKick"><div><span>SPORT SELECT</span><h2>Elige tu arena</h2></div><p>Muévete para ganar. Cada deporte usa un patrón distinto de movimiento.</p></div>
      <div className="sportDeck">{sports.map((s,i)=><button key={s.id} className={`gameTile ${s.tone} ${s.status==='soon'?'isLocked':''}`} onClick={()=>s.id==='boxing'&&setScreen('boxing')}>
        <div className="tileTop"><span>0{i+1}</span><b>{s.status==='ready'?<><CircleDot size={12}/> PLAYABLE</>:<><Lock size={12}/> LOCKED</>}</b></div>
        <div className="tileArt"><span>{s.icon}</span><i/></div>
        <div className="tileCopy"><small>{s.meta}</small><h3>{s.name}</h3><p>{s.kicker}</p></div>
        <div className="tileAction"><span>{s.status==='ready'?'ENTER ARENA':'COMING SOON'}</span><ChevronRight/></div>
      </button>)}</div>
    </section>

    <section className="missionRow">
      <article className="dailyMission"><div className="missionIcon"><Target/></div><div><span>DAILY MISSION</span><h3>IRON FISTS</h3><p>Conecta 300 golpes en Boxing Arena.</p></div><div className="missionProgress"><b>126 <small>/ 300</small></b><i><em/></i><span>+500 XP</span></div></article>
      <article className="playerPulse"><div><span>PLAYER PULSE</span><h3>7 DAYS 🔥</h3><p>Tu mejor racha de movimiento este mes.</p></div><div className="pulseBars">{[56,78,63,91,70,84,96].map((h,i)=><i key={i} style={{height:`${h}%`}} className={i===6?'hot':''}/>)}</div></article>
    </section>
  </main>;
}

function BoxingHub({onBack,onGo}:{onBack:()=>void;onGo:(s:'calibration'|'motionlab')=>void}){
  return <main className="boxingApp"><div className="boxingNoise"/><header className="boxingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div className="boxingBrand"><b>01</b><span>MOTION ARENA / BOXING</span></div><div className="boxingMeters"><span><Gauge size={15}/> 0 BPM</span><span><Zap size={15}/> 2,480 XP</span></div></header>
    <section className="fightHero"><div className="fightCopy"><div className="fightTag">LIVE MOTION SPORT</div><h1>BOXING<br/><em>ARENA</em></h1><p>Golpea al aire, mantén la guardia y esquiva. El Motion Engine convierte tu pose en controles del juego.</p><div className="combatLegend"><span><i>01</i> JAB</span><span><i>02</i> GUARD</span><span><i>03</i> DODGE</span><span><i>04</i> CROUCH</span></div></div>
      <div className="ringScene"><div className="ringRopes rTop"/><div className="ringRopes rMid"/><div className="ringRopes rBottom"/><div className="opponent"><div className="oppHead"/><div className="oppBody"/><i className="glove gL">L</i><i className="glove gR">R</i></div><div className="impact one">PERFECT</div><div className="impact two">+100</div><div className="roundBadge">ROUND <b>01</b></div></div>
    </section>
    <section className="modeRail"><div className="modeTitle"><div><span>FIGHT MODES</span><h2>¿Cómo quieres moverte?</h2></div><div className="engineBadge"><i/> MOTION ENGINE v0.2</div></div><div className="fightModes">{modes.map((m,i)=><button key={m.title} className={`fightMode ${!m.unlocked?'locked':''}`} onClick={()=>m.unlocked&&onGo(m.action==='motion'?'motionlab':'calibration')}><span className="modeNo">0{i+1}</span><div className="modeGlyph">{m.icon}</div><h3>{m.title}</h3><p>{m.subtitle}</p><b>{m.unlocked?'ENTER':'LEVEL 22'} <ChevronRight size={16}/></b></button>)}</div></section>
    <section className="techStrip"><Shield/><div><span>BLOCK 02 · COMPUTER VISION</span><b>Cámara real + 33 puntos corporales + Motion Engine inicial.</b><p>La detección ocurre en tu navegador. Este bloque reconoce presencia, centrado, guardia, jab, esquiva y crouch.</p></div><Camera/></section>
  </main>
}

function Calibration({onBack,onReady}:{onBack:()=>void;onReady:()=>void}){
  const [ready,setReady]=useState(false);
  return <main className="trackingPage"><header className="trackingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div><span>QUICK SETUP</span><b>CALIBRATION BAY</b></div><div className={`readyPill ${ready?'ok':''}`}>{ready?'BODY LOCKED':'WAITING FOR PLAYER'}</div></header>
    <section className="calibrationLayout"><div className="calIntro"><span className="micro">STEP 01 · CAMERA LOCK</span><h1>Entra al área<br/>de juego.</h1><p>Colócate de cuerpo completo frente a la cámara. Cuando los tres indicadores estén en verde, el Motion Engine queda listo.</p><div className="spaceTip"><Gamepad2/><div><b>Zona recomendada</b><span>2–3 metros frente a la cámara y espacio libre a los lados.</span></div></div>{ready&&<button className="launchBtn" onClick={onReady}>ENTER MOTION LAB <ChevronRight/></button>}</div><PoseCamera onReady={(ok)=>{if(ok)setReady(true)}}/></section>
  </main>;
}

function MotionLab({onBack}:{onBack:()=>void}){
  return <main className="trackingPage lab"><header className="trackingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div><span>BOXING ARENA</span><b>MOTION LAB</b></div><div className="readyPill ok">LIVE TEST</div></header>
    <section className="labIntro"><div><span>BLOCK 02 · LIVE INPUT</span><h1>Prueba tus controles.</h1><p>Ponte en guardia, lanza jabs, esquiva y agáchate. El panel responderá cuando detecte el movimiento.</p></div><div className="comboPrompt"><small>TRY THIS</small><b>GUARD → JAB → DODGE</b><span>Repite varias veces para calibrar tu estilo.</span></div></section><PoseCamera/>
    <section className="labNotes"><article><Star/><div><b>Jab</b><span>Extiende el brazo con velocidad y vuelve a guardia.</span></div></article><article><Shield/><div><b>Guardia</b><span>Mantén ambas manos cerca del rostro/hombros.</span></div></article><article><Activity/><div><b>Esquiva</b><span>Desplaza el torso a izquierda o derecha sin salir del marco.</span></div></article></section>
  </main>;
}
