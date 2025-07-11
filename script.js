let curr = '0', prev = null, op = null, reset = false;
const d = id => document.getElementById(id);
const disp = d('display'), hist = d('history');

const buttons = [
  {t:'C', cls:'clear', fn:()=>resetAll()},
  {t:'CE', cls:'clear', fn:()=>{curr='0'; update();}},
  {t:'/', cls:'operator', fn:()=>setOp('/')},
  {t:'*', cls:'operator', fn:()=>setOp('*')},
  ...'789456123'.split('').map(n => ({t:n, cls:'', fn:()=>add(n)})),
  {t:'-', cls:'operator', fn:()=>setOp('-')},
  {t:'0', cls:'zero', fn:()=>add('0')},
  {t:'.', cls:'', fn:()=>add('.')},
  {t:'+', cls:'operator', fn:()=>setOp('+')},
  {t:'=', cls:'equals', fn:()=>calculate()}
];

buttons.forEach(b => {
  const btn = document.createElement('button');
  btn.className = `btn ${b.cls}`; btn.textContent = b.t;
  btn.onclick = b.fn;
  if (b.cls === 'zero') btn.style.gridColumn = 'span 2';
  d('buttons').appendChild(btn);
});

const update = () => {
  disp.textContent = curr;
  disp.classList.remove('error');
};

const setOp = o => {
  if (op && !reset) calculate();
  prev = curr; op = o; reset = true;
  hist.textContent = `${prev} ${o==='*'?'×':o}`;
};

const add = v => {
  if (reset) { curr = '0'; reset = false; }
  if (v === '.' && curr.includes('.')) return;
  curr = curr === '0' && v !== '.' ? v : curr + v;
  update();
};

const calculate = () => {
  if (!op || !prev) return;
  const a = parseFloat(prev), b = parseFloat(curr);
  if (op === '/' && b === 0) return showError("Can't divide by 0");
  const res = { '+':a+b, '-':a-b, '*':a*b, '/':a/b }[op];
  hist.textContent = `${prev} ${op==='*'?'×':op} ${curr} =`;
  curr = res.toString(); prev = op = null; reset = true; update();
};

const resetAll = () => {
  curr='0'; prev=op=null; reset=false; hist.textContent=''; update();
};

const showError = msg => {
  curr = msg; disp.classList.add('error'); update();
  prev=op=null; reset=true;
};

document.addEventListener('keydown', e => {
  const k = e.key;
  if ('0123456789'.includes(k)) add(k);
  else if (k === '.') add('.');
  else if ('+-*/'.includes(k)) setOp(k);
  else if (k === '=' || k === 'Enter') calculate();
  else if (k === 'Escape') resetAll();
  else if (k === 'Backspace') { curr='0'; update(); }
});

update();
