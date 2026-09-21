export type Point = { x:number; y:number; z:number; visibility?:number };

export type MotionSnapshot = {
  visible: boolean;
  centered: boolean;
  distanceOk: boolean;
  guard: boolean;
  leftJab: boolean;
  rightJab: boolean;
  dodge: 'left'|'right'|null;
  crouch: boolean;
  confidence: number;
  bodyHeight: number;
};

const dist = (a:Point,b:Point) => Math.hypot(a.x-b.x,a.y-b.y);
const angle = (a:Point,b:Point,c:Point) => {
  const ab={x:a.x-b.x,y:a.y-b.y};
  const cb={x:c.x-b.x,y:c.y-b.y};
  const dot=ab.x*cb.x+ab.y*cb.y;
  const mag=Math.hypot(ab.x,ab.y)*Math.hypot(cb.x,cb.y);
  if(!mag) return 0;
  return Math.acos(Math.max(-1,Math.min(1,dot/mag)))*180/Math.PI;
};
const mid=(a:Point,b:Point):Point=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2,z:(a.z+b.z)/2,visibility:Math.min(a.visibility??1,b.visibility??1)});

export function analyzePose(lm:Point[], prev:Point[]|null): MotionSnapshot {
  if(!lm || lm.length<33){
    return {visible:false,centered:false,distanceOk:false,guard:false,leftJab:false,rightJab:false,dodge:null,crouch:false,confidence:0,bodyHeight:0};
  }
  const idx={nose:0,ls:11,rs:12,le:13,re:14,lw:15,rw:16,lh:23,rh:24,lk:25,rk:26,la:27,ra:28};
  const required=[idx.nose,idx.ls,idx.rs,idx.lh,idx.rh,idx.lk,idx.rk,idx.la,idx.ra];
  const confidence=required.reduce((s,i)=>s+(lm[i].visibility??0),0)/required.length;
  const visible=required.every(i=>(lm[i].visibility??0)>.48);
  const shoulderMid=mid(lm[idx.ls],lm[idx.rs]);
  const hipMid=mid(lm[idx.lh],lm[idx.rh]);
  const ankleMid=mid(lm[idx.la],lm[idx.ra]);
  const centerX=(shoulderMid.x+hipMid.x)/2;
  const centered=Math.abs(centerX-.5)<.18;
  const bodyHeight=Math.abs(lm[idx.nose].y-ankleMid.y);
  const distanceOk=bodyHeight>.48 && bodyHeight<.93;

  const leftGuard=dist(lm[idx.lw],lm[idx.ls])<.25 || dist(lm[idx.lw],lm[idx.nose])<.28;
  const rightGuard=dist(lm[idx.rw],lm[idx.rs])<.25 || dist(lm[idx.rw],lm[idx.nose])<.28;
  const guard=leftGuard && rightGuard;

  const leftElbow=angle(lm[idx.ls],lm[idx.le],lm[idx.lw]);
  const rightElbow=angle(lm[idx.rs],lm[idx.re],lm[idx.rw]);
  const prevLeftElbow=prev ? angle(prev[idx.ls],prev[idx.le],prev[idx.lw]) : leftElbow;
  const prevRightElbow=prev ? angle(prev[idx.rs],prev[idx.re],prev[idx.rw]) : rightElbow;
  const leftDepth=lm[idx.lw].z-lm[idx.ls].z;
  const rightDepth=lm[idx.rw].z-lm[idx.rs].z;
  const leftSpeed=prev?Math.hypot(lm[idx.lw].x-prev[idx.lw].x,lm[idx.lw].y-prev[idx.lw].y):0;
  const rightSpeed=prev?Math.hypot(lm[idx.rw].x-prev[idx.rw].x,lm[idx.rw].y-prev[idx.rw].y):0;
  const leftJab=leftElbow>150 && prevLeftElbow<142 && (leftDepth<-.08 || leftSpeed>.035);
  const rightJab=rightElbow>150 && prevRightElbow<142 && (rightDepth<-.08 || rightSpeed>.035);

  const torsoShift=lm[idx.nose].x-hipMid.x;
  const dodge=torsoShift<-.085?'left':torsoShift>.085?'right':null;
  const leftKnee=angle(lm[idx.lh],lm[idx.lk],lm[idx.la]);
  const rightKnee=angle(lm[idx.rh],lm[idx.rk],lm[idx.ra]);
  const crouch=leftKnee<145 && rightKnee<145;

  return {visible,centered,distanceOk,guard,leftJab,rightJab,dodge,crouch,confidence,bodyHeight};
}
