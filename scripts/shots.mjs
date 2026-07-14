import puppeteer from "puppeteer-core";
const CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT="/private/tmp/claude-502/-Users-garmi-Desktop-fable/1531cb4c-8d41-4a1f-b551-050c4595abc9/scratchpad";
const b=await puppeteer.launch({executablePath:CHROME,headless:"new",args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader"]});
const p=await b.newPage();await p.setViewport({width:1440,height:900});
await p.goto("http://localhost:4361/",{waitUntil:"networkidle0"});
await new Promise(r=>setTimeout(r,2500));
await p.screenshot({path:OUT+"/1-hero.png"});
await p.mouse.move(720,450);
// scroll to specific progress points and shoot
const stops=[[0.30,"2-net"],[0.52,"3-card1"],[0.68,"4-card3"],[0.93,"5-about"]];
let last=0;
for(const [target,name] of stops){
  while(true){
    const cur=await p.evaluate(()=>window.__cineP??0);
    if(cur>=target-0.01)break;
    await p.mouse.wheel({deltaY:220});
    await new Promise(r=>setTimeout(r,30));
  }
  await new Promise(r=>setTimeout(r,900));
  await p.screenshot({path:OUT+"/"+name+".png"});
}
// timeline + contact (past cinematic)
await p.evaluate(()=>document.getElementById("experience").scrollIntoView());
await new Promise(r=>setTimeout(r,1200));
await p.screenshot({path:OUT+"/6-experience.png"});
// deep dive
await p.goto("http://localhost:4361/projects/glucose/",{waitUntil:"networkidle0"});
await new Promise(r=>setTimeout(r,800));
await p.screenshot({path:OUT+"/7-deepdive.png"});
await b.close();
console.log("shots saved");
