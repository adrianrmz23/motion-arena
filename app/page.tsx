'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowLeft, Camera, ChevronRight, Crown, Flame, Gamepad2, Lock, Medal, Play, Shield, Sparkles, Star, Trophy, Zap } from 'lucide-react';

type Sport = { id:string; name:string; kicker:string; icon:string; status:'ready'|'soon'; tone:string };

const sports: Sport[] = [
  { id:'boxing', name:'Boxing Arena', kicker:'Golpea · esquiva · bloquea', icon:'🥊', status:'ready', tone:'coral' },
  { id:'ninja', name:'Ninja Reflex', kicker:'Reacción y cardio', icon:'🥷', status:'soon', tone:'violet' },
  { id:'runner', name:'City Runner', kicker:'Corre · salta · agáchate', icon:'🏃', status:'soon', tone:'cyan' },
  { id:'tennis', name:'Shadow Tennis', kicker:'Ritmo y coordinación', icon:'🎾', status:'soon', tone:'lime' },
  { id:'target', name:'Target Rush', kicker:'Velocidad y precisión', icon:'🎯', status:'soon', tone:'amber' },
  { id:'boss', name:'Boss Battle', kicker:'Todo tu cuerpo', icon:'👾', status:'soon', tone:'pink' },
];

const boxingModes = [
  { title:'Quick Fight', subtitle:'3 rounds · 6 min', icon:'⚡', unlocked:true },
  { title:'Combo Lab', subtitle:'Aprende jab + cross', icon:'🎯', unlocked:true },
  { title:'Survival', subtitle:'Oleadas infinitas', icon:'🔥', unlocked:false },
  { title:'Championship', subtitle:'Sube en el ranking', icon:'🏆', unlocked:false },
];

export default function Home() {
  const [screen, setScreen] = useState<'home'|'boxing'|'calibration'>('home');
  const [energy, setEnergy] = useState(1840);
  const quote = useMemo(() => ['Muévete. Juega. Repite.','Tu cuerpo es el control.','Hoy no entrenas: hoy compites.'][new Date().getDate()%3], []);

  if (screen === 'boxing') return <BoxingHub onBack={()=>setScreen('home')} onStart={()=>setScreen('calibration')} />;
  if (screen === 'calibration') return <Calibration onBack={()=>setScreen('boxing')} />;

  return (
    <main className="shell">
      <div className="noise" />
      <header className="topbar">
        <div className="brand"><div className="brandMark"><Activity size={22}/></div><div><strong>MOTION</strong><span>ARENA</span></div></div>
        <div className="topActions">
          <div className="pill"><Flame size={16}/><b>7</b><span>días</span></div>
          <div className="pill xp"><Zap size={16}/><b>2,480</b><span>XP</span></div>
          <button className="avatar" aria-label="Perfil">AR</button>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow"><Sparkles size={16}/> DAILY MOVE</div>
          <h1>{quote}</h1>
          <p>Convierte cada golpe, paso y sentadilla en puntos. Elige una arena y empieza a jugar.</p>
          <button className="primary" onClick={()=>setScreen('boxing')}><Play size={18} fill="currentColor"/> JUGAR AHORA <ChevronRight size={18}/></button>
        </div>
        <div className="playerCard">
          <div className="playerGlow" />
          <div className="playerTop"><span>PLAYER 01</span><Crown size={18}/></div>
          <div className="fighter">🥊</div>
          <div className="levelLine"><span>NIVEL 18</span><b>RISING CONTENDER</b></div>
          <div className="progress"><i style={{width:'72%'}} /></div>
          <div className="playerStats"><span><Trophy size={15}/> 14 trofeos</span><span><Zap size={15}/> {energy.toLocaleString()} energía</span></div>
        </div>
      </section>

      <section className="arenaSection">
        <div className="sectionTitle"><div><span>ELIGE TU ARENA</span><h2>¿Qué quieres jugar hoy?</h2></div><button className="ghost" onClick={()=>setEnergy(v=>v+25)}>+25 ⚡ demo</button></div>
        <div className="sportGrid">
          {sports.map((sport, i)=><button key={sport.id} className={`sportCard ${sport.tone} ${sport.status==='soon'?'locked':''}`} onClick={()=>sport.id==='boxing'&&setScreen('boxing')}>
            <div className="sportTop"><span className="sportNumber">0{i+1}</span>{sport.status==='ready'?<span className="live"><i/> READY</span>:<Lock size={16}/>}</div>
            <div className="sportIcon">{sport.icon}</div>
            <div><h3>{sport.name}</h3><p>{sport.kicker}</p></div>
            <div className="sportFoot"><span>{sport.status==='ready'?'ENTRAR':'PRÓXIMAMENTE'}</span><ChevronRight size={18}/></div>
          </button>)}
        </div>
      </section>

      <section className="lowerGrid">
        <article className="challenge">
          <div className="challengeIcon"><Medal size={28}/></div><div><span>RETO DEL DÍA</span><h3>Iron Fists</h3><p>Conecta <b>300 golpes</b> en cualquier modo de Boxing Arena.</p></div>
          <div className="challengeRight"><strong>126 / 300</strong><div className="miniProgress"><i style={{width:'42%'}}/></div><em>+500 XP</em></div>
        </article>
        <article className="streak"><div><span>RACHA ACTUAL</span><h3>7 días 🔥</h3><p>Un juego más hoy mantiene viva tu racha.</p></div><div className="days">{['L','M','X','J','V','S','D'].map((d,i)=><i key={d} className={i<6?'done':i===6?'today':''}>{i<6?'✓':d}</i>)}</div></article>
      </section>
    </main>
  );
}

function BoxingHub({onBack,onStart}:{onBack:()=>void,onStart:()=>void}) {
  return <main className="boxingShell">
    <div className="boxingBackdrop" />
    <header className="gameHeader"><button className="roundBtn" onClick={onBack}><ArrowLeft/></button><div className="miniBrand">MOTION ARENA <span>/ BOXING</span></div><div className="gameStats"><span><Flame size={15}/>7</span><span><Zap size={15}/>2,480</span></div></header>
    <section className="boxingHero">
      <div className="boxingCopy"><div className="eyebrow red">🥊 ARENA 01</div><h1>BOXING<br/><em>ARENA</em></h1><p>Golpea al ritmo, construye combos y esquiva ataques. Tu cámara será el control.</p><div className="tags"><span>JAB</span><span>CROSS</span><span>BLOCK</span><span>DODGE</span></div></div>
      <div className="ringVisual"><div className="ringLines"/><div className="dummy"><div className="dummyHead"/><div className="dummyBody">TARGET</div></div><span className="hit h1">+100</span><span className="hit h2">PERFECT</span></div>
    </section>
    <section className="modeSection"><div className="modeHead"><div><span>SELECCIONA MODO</span><h2>Sube al ring.</h2></div><div className="sensor"><i/> MOTION ENGINE · PREVIEW</div></div>
      <div className="modeGrid">{boxingModes.map((m,i)=><button className={`modeCard ${!m.unlocked?'modeLocked':''}`} key={m.title} onClick={()=>m.unlocked&&onStart()}><span className="modeIndex">0{i+1}</span><div className="modeEmoji">{m.icon}</div><h3>{m.title}</h3><p>{m.subtitle}</p>{m.unlocked?<b>JUGAR <ChevronRight size={16}/></b>:<b><Lock size={14}/> NIVEL 22</b>}</button>)}</div>
    </section>
    <section className="datasetNote"><Shield size={22}/><div><span>BOXING INTELLIGENCE</span><strong>Preparado para integrar reconocimiento avanzado de golpes.</strong><p>El Bloque 1 deja el módulo desacoplado para conectar pose tracking y clasificadores en los siguientes bloques.</p></div></section>
  </main>
}

function Calibration({onBack}:{onBack:()=>void}) {
  const [step,setStep]=useState(0);
  return <main className="calShell"><button className="roundBtn calBack" onClick={onBack}><ArrowLeft/></button><div className="calCard"><div className="cameraFrame"><div className="scanline"/><Camera size={54}/><span>CAMERA PREVIEW</span><small>El acceso real a cámara se conecta en el Bloque 2.</small><div className="corner tl"/><div className="corner tr"/><div className="corner bl"/><div className="corner br"/></div><div className="calCopy"><div className="eyebrow cyanText"><Gamepad2 size={16}/> QUICK FIGHT</div><h1>Configura tu zona de juego.</h1><p>Colócate de cuerpo completo frente a la cámara. Necesitamos espacio suficiente para brazos y desplazamientos laterales.</p><div className="checks"><span className={step>=1?'checked':''}><i>1</i> Cámara centrada</span><span className={step>=2?'checked':''}><i>2</i> Cuerpo completo visible</span><span className={step>=3?'checked':''}><i>3</i> Zona despejada</span></div><button className="primary wide" onClick={()=>setStep(s=>Math.min(3,s+1))}>{step<3?'SIMULAR CALIBRACIÓN':'READY — BLOQUE 2'} <ChevronRight size={18}/></button></div></div></main>
}
