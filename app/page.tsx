'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowLeft, Camera, ChevronRight, CircleDot, Flame, Gamepad2, Gauge, Lock, Medal, Pause, Play, Radio, RotateCcw, Shield, Sparkles, Star, Target, Trophy, Volume2, Zap } from 'lucide-react';
import PoseCamera, { MotionMove } from '../components/PoseCamera';
import { MotionSnapshot } from '../lib/motion';

type Screen='home'|'boxing'|'calibration'|'motionlab'|'fight';
type Sport={id:string;name:string;kicker:string;icon:string;status:'ready'|'soon';tone:string;meta:string};
type FightPrompt={label:string;accept:MotionMove[];kind:'attack'|'defense';window:number;damage:number};

type FightStats={score:number;combo:number;bestCombo:number;hits:number;perfect:number;good:number;misses:number;damageTaken:number};

const sports:Sport[]=[
  {id:'boxing',name:'Boxing Arena',kicker:'Golpea · bloquea · esquiva',icon:'🥊',status:'ready',tone:'orange',meta:'BODY TRACKING'},
  {id:'ninja',name:'Ninja Reflex',kicker:'Reacción · velocidad · cardio',icon:'🥷',status:'soon',tone:'purple',meta:'REFLEX'},
  {id:'runner',name:'City Runner',kicker:'Corre · salta · agáchate',icon:'🏃',status:'soon',tone:'blue',meta:'FULL BODY'},
  {id:'tennis',name:'Shadow Tennis',kicker:'Swing · ritmo · coordinación',icon:'🎾',status:'soon',tone:'green',meta:'MOTION'},
  {id:'target',name:'Target Rush',kicker:'Golpea objetivos en 360°',icon:'🎯',status:'soon',tone:'yellow',meta:'REACTION'},
  {id:'boss',name:'Boss Battle',kicker:'Combos · resistencia · poder',icon:'👾',status:'soon',tone:'pink',meta:'CHALLENGE'},
];

const modes=[
  {title:'Quick Fight',subtitle:'3 rounds · 6 min · rival adaptativo',icon:'⚡',unlocked:true,action:'fight'},
  {title:'Motion Lab',subtitle:'Prueba cámara y movimientos',icon:'◎',unlocked:true,action:'motion'},
  {title:'Combo Lab',subtitle:'Jab · cross · guardia',icon:'🎯',unlocked:false,action:'locked'},
  {title:'Survival',subtitle:'Oleadas infinitas',icon:'🔥',unlocked:false,action:'locked'},
];

const prompts:FightPrompt[]=[
  {label:'JAB IZQUIERDO',accept:['LEFT JAB'],kind:'attack',window:1700,damage:8},
  {label:'JAB DERECHO',accept:['RIGHT JAB'],kind:'attack',window:1700,damage:8},
  {label:'¡ESQUIVA IZQUIERDA!',accept:['DODGE LEFT'],kind:'defense',window:1850,damage:12},
  {label:'¡ESQUIVA DERECHA!',accept:['DODGE RIGHT'],kind:'defense',window:1850,damage:12},
  {label:'¡GUARDIA!',accept:['GUARD'],kind:'defense',window:2100,damage:10},
  {label:'¡AGÁCHATE!',accept:['CROUCH'],kind:'defense',window:2000,damage:12},
];

export default function Home(){
  const [screen,setScreen]=useState<Screen>('home');
  const [calibrationTarget,setCalibrationTarget]=useState<'motionlab'|'fight'>('motionlab');
  const [fightSession,setFightSession]=useState(0);
  const quote=useMemo(()=>['READY. SET. MOVE.','YOUR BODY. YOUR CONTROLLER.','PLAY HARD. MOVE MORE.'][new Date().getDate()%3],[]);
  if(screen==='boxing')return <BoxingHub onBack={()=>setScreen('home')} onGo={(target)=>{if(target==='motionlab')setScreen('motionlab');else{setCalibrationTarget('fight');setScreen('calibration')}}}/>;
  if(screen==='calibration')return <Calibration onBack={()=>setScreen('boxing')} onReady={()=>setScreen(calibrationTarget)}/>;
  if(screen==='motionlab')return <MotionLab onBack={()=>setScreen('boxing')}/>;
  if(screen==='fight')return <QuickFight key={fightSession} onBack={()=>setScreen('boxing')} onRestart={()=>setFightSession(v=>v+1)}/>;

  return <main className="arenaApp block3Home">
    <div className="skyGlow a"/><div className="skyGlow b"/><div className="courtLines"/>
    <header className="consoleBar">
      <div className="consoleBrand"><div className="brandOrb"><Activity/></div><div><strong>MOTION ARENA</strong><span>ACTIVE GAME SYSTEM</span></div></div>
      <div className="consoleStatus"><span><Radio size={14}/> MOTION ONLINE</span><span><Flame size={14}/> 7 DAY STREAK</span><button>AR</button></div>
    </header>

    <section className="stadiumHero cinematicHero">
      <div className="stadiumCopy">
        <div className="heroBadge"><Sparkles size={15}/> PLAYER ONE · LEVEL 18</div>
        <h1>{quote}</h1>
        <p>Tu sala se convierte en cancha. Cámara, cuerpo y reflejos controlan cada partida.</p>
        <div className="heroActions"><button className="playBtn" onClick={()=>setScreen('boxing')}><Play fill="currentColor"/> START SESSION</button><div className="xpMeter"><span>NEXT LEVEL</span><b>2,480 / 3,000 XP</b><i><em/></i></div></div>
      </div>
      <div className="heroArena heroArenaB3" aria-label="Motion Arena stadium preview">
        <div className="scoreRibbon"><span>PLAYER 1</span><b>ARENA // 01</b><span>ONLINE</span></div>
        <div className="avatarSilhouette fighter"><div className="head"/><div className="torso"/><i className="limb la"/><i className="limb ra"/><i className="limb ll"/><i className="limb rl"/><i className="glowGlove left"/><i className="glowGlove right"/></div>
        <div className="targetRing r1"/><div className="targetRing r2"/><div className="targetRing r3"/>
        <span className="floatingMetric m1">REACTION +12</span><span className="floatingMetric m2">POWER +08</span><span className="floatingMetric m3">STREAK ×7</span>
        <div className="floorGrid"/>
      </div>
    </section>

    <section className="chooseArena">
      <div className="sectionKick"><div><span>SPORT SELECT</span><h2>Elige tu arena</h2></div><p>Una consola deportiva en navegador. Cada arena tendrá su propia mecánica física.</p></div>
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

function BoxingHub({onBack,onGo}:{onBack:()=>void;onGo:(target:'fight'|'motionlab')=>void}){
  return <main className="boxingApp block3Box"><div className="boxingNoise"/><header className="boxingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div className="boxingBrand"><b>01</b><span>MOTION ARENA / BOXING</span></div><div className="boxingMeters"><span><Gauge size={15}/> READY</span><span><Zap size={15}/> 2,480 XP</span></div></header>
    <section className="fightHero fightHeroB3"><div className="fightCopy"><div className="fightTag">BLOCK 03 · PLAYABLE COMBAT</div><h1>BOXING<br/><em>ARENA</em></h1><p>Ya no es una demo de tracking. Quick Fight convierte tus golpes, guardias y esquivas en una pelea por rounds.</p><div className="combatLegend"><span><i>01</i> STRIKE</span><span><i>02</i> GUARD</span><span><i>03</i> DODGE</span><span><i>04</i> COMBO</span></div></div>
      <div className="ringScene upgradedRing"><div className="ringSpotlight"/><div className="ringRopes rTop"/><div className="ringRopes rMid"/><div className="ringRopes rBottom"/><div className="opponent upgraded"><div className="oppHead"/><div className="oppBody"/><i className="glove gL">L</i><i className="glove gR">R</i></div><div className="impact one">FIGHT!</div><div className="impact two">×12</div><div className="roundBadge">ROUND <b>01</b></div><div className="ringFloorGlow"/></div>
    </section>
    <section className="modeRail"><div className="modeTitle"><div><span>FIGHT MODES</span><h2>Entra al ring</h2></div><div className="engineBadge"><i/> MOTION ENGINE v0.3</div></div><div className="fightModes">{modes.map((m,i)=><button key={m.title} className={`fightMode ${!m.unlocked?'locked':''} ${i===0?'featuredMode':''}`} onClick={()=>m.unlocked&&onGo(m.action==='motion'?'motionlab':'fight')}><span className="modeNo">0{i+1}</span><div className="modeGlyph">{m.icon}</div><h3>{m.title}</h3><p>{m.subtitle}</p><b>{m.unlocked?'ENTER':'LOCKED'} <ChevronRight size={16}/></b></button>)}</div></section>
    <section className="techStrip"><Shield/><div><span>BLOCK 03 · GAME LOOP</span><b>Rounds, salud, rival, prompts, precisión, combo y resultado final.</b><p>El rival te pide atacar o reaccionar. Tu cámara valida la respuesta y puntúa el timing.</p></div><Trophy/></section>
  </main>
}

function Calibration({onBack,onReady}:{onBack:()=>void;onReady:()=>void}){
  const [ready,setReady]=useState(false);
  return <main className="trackingPage"><header className="trackingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div><span>QUICK SETUP</span><b>CALIBRATION BAY</b></div><div className={`readyPill ${ready?'ok':''}`}>{ready?'BODY LOCKED':'WAITING FOR PLAYER'}</div></header>
    <section className="calibrationLayout"><div className="calIntro"><span className="micro">STEP 01 · CAMERA LOCK</span><h1>Entra al área<br/>de juego.</h1><p>Colócate de cuerpo completo. Cuando los indicadores estén en verde, ya puedes entrar al ring.</p><div className="spaceTip"><Gamepad2/><div><b>Zona recomendada</b><span>2–3 metros frente a la cámara y espacio libre a los lados.</span></div></div>{ready&&<button className="launchBtn" onClick={onReady}>ENTER THE RING <ChevronRight/></button>}</div><PoseCamera onReady={setReady}/></section>
  </main>;
}

function MotionLab({onBack}:{onBack:()=>void}){
  return <main className="trackingPage lab"><header className="trackingTop"><button className="iconBtn" onClick={onBack}><ArrowLeft/></button><div><span>BOXING ARENA</span><b>MOTION LAB</b></div><div className="readyPill ok">LIVE TEST</div></header>
    <section className="labIntro"><div><span>BLOCK 03 · LIVE INPUT</span><h1>Prueba tus controles.</h1><p>Ponte en guardia, lanza jabs, esquiva y agáchate. El panel responde en tiempo real.</p></div><div className="comboPrompt"><small>TRY THIS</small><b>GUARD → JAB → DODGE</b><span>Repite varias veces para calibrar tu estilo.</span></div></section><PoseCamera/>
    <section className="labNotes"><article><Star/><div><b>Jab</b><span>Extiende el brazo con velocidad y vuelve a guardia.</span></div></article><article><Shield/><div><b>Guardia</b><span>Mantén ambas manos cerca del rostro/hombros.</span></div></article><article><Activity/><div><b>Esquiva</b><span>Desplaza el torso a izquierda o derecha sin salir del marco.</span></div></article></section>
  </main>;
}

function QuickFight({onBack,onRestart}:{onBack:()=>void;onRestart:()=>void}){
  const ROUND_SECONDS=120;
  const [phase,setPhase]=useState<'countdown'|'fight'|'roundbreak'|'finished'>('countdown');
  const [countdown,setCountdown]=useState(3);
  const [round,setRound]=useState(1);
  const [timeLeft,setTimeLeft]=useState(ROUND_SECONDS);
  const [playerHp,setPlayerHp]=useState(100);
  const [enemyHp,setEnemyHp]=useState(100);
  const [prompt,setPrompt]=useState<FightPrompt|null>(null);
  const [promptStarted,setPromptStarted]=useState(0);
  const [promptId,setPromptId]=useState(0);
  const [judge,setJudge]=useState<{text:string;points:number}|null>(null);
  const [tracking,setTracking]=useState<MotionSnapshot|null>(null);
  const [stats,setStats]=useState<FightStats>({score:0,combo:0,bestCombo:0,hits:0,perfect:0,good:0,misses:0,damageTaken:0});
  const [paused,setPaused]=useState(false);
  const handledPrompt=useRef(0);
  const timeLeftRef=useRef(ROUND_SECONDS);
  const promptTimeout=useRef<ReturnType<typeof setTimeout>|null>(null);

  const beep=(freq=440,duration=.05)=>{
    try{const AC=window.AudioContext||(window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!AC)return;const c=new AC();const o=c.createOscillator();const g=c.createGain();o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.stop(c.currentTime+duration);}catch{}
  };

  useEffect(()=>{
    if(phase!=='countdown')return;
    if(countdown<=0){setPhase('fight');beep(720,.08);return;}
    const t=setTimeout(()=>{beep(420+countdown*80,.05);setCountdown(v=>v-1)},700);
    return()=>clearTimeout(t);
  },[phase,countdown]);

  useEffect(()=>{timeLeftRef.current=timeLeft},[timeLeft]);

  useEffect(()=>{
    if(phase!=='fight'||paused)return;
    const t=setInterval(()=>setTimeLeft(v=>{
      if(v<=1){clearInterval(t);return 0}return v-1;
    }),1000);
    return()=>clearInterval(t);
  },[phase,paused,round]);

  useEffect(()=>{
    if(phase!=='fight'||paused)return;
    if(timeLeft>0)return;
    if(round>=3){setPhase('finished');setPrompt(null);return;}
    setPhase('roundbreak');setPrompt(null);
    const t=setTimeout(()=>{setRound(r=>r+1);setTimeLeft(ROUND_SECONDS);setEnemyHp(100);setPlayerHp(p=>Math.min(100,p+18));setCountdown(3);setPhase('countdown')},3500);
    return()=>clearTimeout(t);
  },[timeLeft,phase,paused,round]);

  useEffect(()=>{
    if(phase!=='fight'||paused||prompt)return;
    const delay=900+Math.random()*850;
    const t=setTimeout(()=>{
      const difficulty=Math.min(5,round+Math.floor((ROUND_SECONDS-timeLeftRef.current)/35));
      const pool=prompts.filter((_,i)=>difficulty<2?i<4:true);
      const p=pool[Math.floor(Math.random()*pool.length)];
      const id=promptId+1;
      setPromptId(id);setPrompt({...p,window:Math.max(1050,p.window-(difficulty-1)*110)});setPromptStarted(performance.now());handledPrompt.current=0;
      promptTimeout.current=setTimeout(()=>failPrompt(id,p),Math.max(1050,p.window-(difficulty-1)*110));
    },delay);
    return()=>clearTimeout(t);
  },[phase,paused,prompt,round,promptId]);

  const clearPromptTimer=()=>{if(promptTimeout.current)clearTimeout(promptTimeout.current);promptTimeout.current=null;};

  useEffect(()=>{if(phase!=='fight'||paused){clearPromptTimer();if(paused)setPrompt(null)}},[phase,paused]);

  const failPrompt=(id:number,p:FightPrompt)=>{
    if(handledPrompt.current===id)return;
    handledPrompt.current=id;
    setJudge({text:'MISS',points:0});setTimeout(()=>setJudge(null),650);
    setStats(s=>({...s,combo:0,misses:s.misses+1,damageTaken:s.damageTaken+(p.kind==='defense'?p.damage:0)}));
    if(p.kind==='defense')setPlayerHp(h=>Math.max(0,h-p.damage));
    setPrompt(null);beep(170,.08);
  };

  const onMove=(move:MotionMove)=>{
    if(phase!=='fight'||paused||!prompt)return;
    if(handledPrompt.current===promptId)return;
    if(!prompt.accept.includes(move))return;
    handledPrompt.current=promptId;clearPromptTimer();
    const elapsed=performance.now()-promptStarted;
    const ratio=elapsed/prompt.window;
    const perfect=ratio<=.52;
    const points=perfect?100:70;
    setJudge({text:perfect?'PERFECT':'GOOD',points});setTimeout(()=>setJudge(null),650);
    beep(perfect?820:610,.06);
    setStats(s=>{const combo=s.combo+1;return{...s,score:s.score+points+Math.min(100,combo*5),combo,bestCombo:Math.max(s.bestCombo,combo),hits:s.hits+(prompt.kind==='attack'?1:0),perfect:s.perfect+(perfect?1:0),good:s.good+(perfect?0:1)}});
    if(prompt.kind==='attack')setEnemyHp(h=>Math.max(0,h-(perfect?14:10)));
    setPrompt(null);
  };

  useEffect(()=>{
    if(enemyHp>0||phase!=='fight')return;
    setStats(s=>({...s,score:s.score+500}));
    setEnemyHp(100);setJudge({text:'KNOCKDOWN +500',points:500});setTimeout(()=>setJudge(null),900);
  },[enemyHp,phase]);

  useEffect(()=>{
    if(playerHp>0||phase==='finished')return;
    setPhase('finished');setPrompt(null);clearPromptTimer();
  },[playerHp,phase]);

  const mm=String(Math.floor(timeLeft/60)).padStart(2,'0');
  const ss=String(timeLeft%60).padStart(2,'0');
  const accuracy=stats.hits+stats.misses?Math.round(((stats.perfect+stats.good)/(stats.perfect+stats.good+stats.misses))*100):100;

  if(phase==='finished')return <main className="fightResults"><div className="resultNoise"/><button className="resultBack" onClick={onBack}><ArrowLeft/> BOXING ARENA</button><section className="resultCard"><div className="resultCrest">🏆</div><span className="resultKicker">MATCH COMPLETE</span><h1>{playerHp>0?'RING CLEARED':'MATCH OVER'}</h1><p>Tu cuerpo hizo todo el trabajo. Aquí queda el resumen del combate.</p><div className="resultScore">{stats.score.toLocaleString()}<small>PTS</small></div><div className="resultGrid"><ResultMetric label="BEST COMBO" value={`×${stats.bestCombo}`}/><ResultMetric label="ACCURACY" value={`${accuracy}%`}/><ResultMetric label="PERFECT" value={String(stats.perfect)}/><ResultMetric label="HITS" value={String(stats.hits)}/><ResultMetric label="DAMAGE" value={String(stats.damageTaken)}/><ResultMetric label="XP EARNED" value={`+${Math.max(250,Math.floor(stats.score/8))}`}/></div><div className="resultActions"><button onClick={onRestart}><RotateCcw/> FIGHT AGAIN</button><button className="ghost" onClick={onBack}>BACK TO ARENA</button></div></section></main>;

  return <main className="liveFight">
    <div className="fightAtmosphere"/><div className="fightScan"/>
    <header className="liveFightTop"><button className="fightBack" onClick={onBack}><ArrowLeft/></button><div className="liveRound"><span>ROUND</span><b>0{round}</b><em>{mm}:{ss}</em></div><div className="liveFightControls"><span><Volume2 size={15}/> LIVE</span><button onClick={()=>setPaused(v=>!v)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button></div></header>

    <section className="fightHealth"><div className="fighterHealth player"><div><b>PLAYER ONE</b><span>{playerHp} HP</span></div><i><em style={{width:`${playerHp}%`}}/></i></div><div className="fightVs">VS</div><div className="fighterHealth enemy"><div><span>{enemyHp} HP</span><b>NEON JACKAL</b></div><i><em style={{width:`${enemyHp}%`}}/></i></div></section>

    <section className="fightStage">
      <div className="playerCamera"><PoseCamera gameMode autoStart onMove={onMove} onSnapshot={setTracking}/><div className={`trackingDot ${tracking?.visible?'ok':''}`}><i/>{tracking?.visible?'BODY LOCK':'SEARCHING'}</div></div>
      <div className="centerFightHud">
        <div className={`commandCard ${prompt?.kind||''} ${prompt?'show':''}`}><small>{prompt?.kind==='defense'?'DEFEND':'STRIKE'}</small><strong>{prompt?.label||'READY'}</strong>{prompt&&<i><em style={{animationDuration:`${prompt.window}ms`}}/></i>}</div>
        {judge&&<div className={`judge ${judge.text.includes('MISS')?'miss':''}`}><b>{judge.text}</b>{judge.points>0&&<span>+{judge.points}</span>}</div>}
        {phase==='countdown'&&<div className="bigCountdown"><span>ROUND {round}</span><b>{countdown||'FIGHT'}</b></div>}
        {phase==='roundbreak'&&<div className="bigCountdown"><span>ROUND COMPLETE</span><b>REST</b></div>}
        {paused&&<div className="pauseOverlay"><Pause/><b>PAUSED</b><span>Presiona play para continuar</span></div>}
      </div>
      <div className="enemyFighter"><div className="enemyHalo"/><div className="enemyHead"><i/><i/></div><div className="enemyTorso"><span>NEON<br/>JACKAL</span></div><div className="enemyArm left"><b/></div><div className="enemyArm right"><b/></div><div className="enemyLeg left"/><div className="enemyLeg right"/><div className="enemyShadow"/></div>
      <div className="ringRopeLine one"/><div className="ringRopeLine two"/><div className="ringRopeLine three"/><div className="fightFloor"/>
    </section>

    <section className="fightBottomHud"><div className="fightStat"><span>SCORE</span><b>{stats.score.toString().padStart(6,'0')}</b></div><div className="comboCore"><span>COMBO</span><b>×{stats.combo}</b><i>{stats.bestCombo>0?`BEST ×${stats.bestCombo}`:'BUILD IT'}</i></div><div className="fightStat right"><span>TRACKING</span><b>{Math.round((tracking?.confidence||0)*100)}%</b></div></section>
  </main>;
}

function ResultMetric({label,value}:{label:string;value:string}){return <div><span>{label}</span><b>{value}</b></div>}
