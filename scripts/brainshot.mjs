import puppeteer from "puppeteer-core";
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT="/private/tmp/claude-502/-Users-garmi-Desktop-fable/1531cb4c-8d41-4a1f-b551-050c4595abc9/scratchpad";
const b=await puppeteer.launch({executablePath:CHROME,headless:"new",args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader"]});
const p=await b.newPage();await p.setViewport({width:1440,height:900});
const errs=[];p.on("console",m=>m.type()==="error"&&errs.push(m.text()));p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:4384/",{waitUntil:"networkidle0"});
await new Promise(r=>setTimeout(r,2000));
await p.mouse.move(720,450);
while(true){const cur=await p.evaluate(()=>window.__cineP??0); if(cur>=0.92)break; await p.mouse.wheel({deltaY:100}); await new Promise(r=>setTimeout(r,16));}
await new Promise(r=>setTimeout(r,2500));
await p.screenshot({path:OUT+"/brain-v2.png"});
console.log("errors:",errs.length?errs.slice(0,4):"none");
await b.close();
