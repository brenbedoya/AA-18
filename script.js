const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let b,turn,placed,sel,over,score={X:0,O:0},starter='X';
const $=id=>document.getElementById(id);
const boardEl=$('board'),status=$('status');
const cells=[...Array(9)].map((_,i)=>{const e=document.createElement('button');e.className='c';e.setAttribute('aria-label','Casilla '+(i+1));e.onclick=()=>click(i);boardEl.appendChild(e);return e});
function adj(i,j){const r1=i/3|0,c1=i%3,r2=j/3|0,c2=j%3;return i!==j&&Math.abs(r1-r2)<=1&&Math.abs(c1-c2)<=1}
function moves(i){return b.map((v,j)=>v===null&&adj(i,j)?j:-1).filter(j=>j>=0)}
function reset(){b=Array(9).fill(null);turn=starter;starter=starter==='X'?'O':'X';placed={X:0,O:0};sel=null;over=false;render()}
function winLine(p){return LINES.find(l=>l.every(i=>b[i]===p))}
function click(i){
 if(over)return;
 const phase2=placed.X===3&&placed.O===3;
 if(!phase2){
  if(b[i])return;
  b[i]=turn;placed[turn]++;
 }else{
  if(b[i]===turn){sel=sel===i?null:i;return render()}
  if(sel===null||b[i]!==null||!adj(sel,i))return;
  b[i]=turn;b[sel]=null;sel=null;
 }
 const w=winLine(turn);
 if(w){over=true;score[turn]++;render(w);return}
 turn=turn==='X'?'O':'X';
 render();
}
function render(w){
 const phase2=placed.X===3&&placed.O===3;
 const mv=sel!==null?moves(sel):[];
 cells.forEach((c,i)=>{
  c.textContent=b[i]||'';
  c.className='c'+(b[i]?' '+b[i]:'')+(i===sel?' sel':'')+(mv.includes(i)?' mv':'')+(w&&w.includes(i)?' win':'');
 });
 $('nX').textContent=score.X;$('nO').textContent=score.O;
 $('sX').classList.toggle('on',!over&&turn==='X');
 $('sO').classList.toggle('on',!over&&turn==='O');
 if(over)status.innerHTML='🎉 ¡Ganó el jugador <b class="p'+turn.toLowerCase()+'">'+turn+'</b>!';
 else if(!phase2)status.innerHTML='Turno de <b class="p'+turn.toLowerCase()+'">'+turn+'</b>: colocá una ficha ('+placed[turn]+'/3 puestas)';
 else status.innerHTML='Turno de <b class="p'+turn.toLowerCase()+'">'+turn+'</b>: '+(sel===null?'elegí una ficha para mover':'elegí una casilla contigua vacía');
}
$('again').onclick=reset;
reset();
