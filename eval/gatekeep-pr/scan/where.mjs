import fs from "fs"; import path from "path";
const files=process.argv.slice(2); const out=[];
for(const f of files){
  const lines=fs.readFileSync(f,"utf8").trim().split("\n").map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
  const msgs=lines.filter(l=>l.type==="message").map(l=>({t:Date.parse(l.timestamp),m:l.message,id:l.id}));
  const txt=c=>typeof c==="string"?c:(c||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n");
  for(let i=0;i<msgs.length;i++){const {t,m}=msgs[i]; if(m.role!=="user"||!txt(m.content).includes('<skill name="gatekeep-pr"'))continue;
    const by={}; let llm=0; let pending={}; let lastT=t; const subs=[]; let readRefs=0; let ciPoll=0; let testRun=0;
    for(let j=i+1;j<msgs.length&&msgs[j].m.role!=="user";j++){const x=msgs[j];lastT=x.t;
      if(x.m.role==="assistant"){llm+=x.m.durationMs||0; for(const c of x.m.content||[]) if(c.type==="toolCall"){pending[c.id]={name:c.name,t:x.t,args:c.arguments};}}
      if(x.m.role==="toolResult"){const p=pending[x.m.toolCallId]; if(p){const d=x.t-p.t; by[p.name]=(by[p.name]||0)+d; if(p.name==="subagent"){subs.push({agent:p.args?.agent||(p.args?.tasks||[]).map(t=>t.agent).join("+")||(p.args?.chain||[]).map(t=>t.agent).join(">"),mins:(d/60000).toFixed(1)})} if(p.name==="read"&&/gatekeep-pr\/(reference|verification|review)/.test(p.args?.path||""))readRefs++; if(p.name==="bash"&&/gh (pr checks|run watch|run list|pr view .*statusCheck)|--watch/.test(p.args?.command||""))ciPoll+=d; if(p.name==="bash"&&/(pytest|npm test|npm run|vitest|go test|cargo test|make test|uv run|ci\.mjs)/.test(p.args?.command||""))testRun+=d; delete pending[x.m.toolCallId]}}
    }
    const tot=lastT-t; if(tot<3*60000)continue;
    const mm=v=>(v/60000).toFixed(1);
    out.push({d:new Date(t).toISOString().slice(0,16),repo:path.basename(path.dirname(f)).split("-").filter(Boolean).at(-1),tot:mm(tot),llm:mm(llm),sub:mm(by.subagent||0),bash:mm(by.bash||0),ci:mm(ciPoll),tests:mm(testRun),readRefs,subs:subs.map(s=>s.agent+":"+s.mins).join(" ")});
  }
}
for(const o of out)console.log(`${o.d} ${o.repo.padEnd(20)} tot=${o.tot.padStart(5)} llm=${o.llm.padStart(5)} sub=${o.sub.padStart(5)} bash=${o.bash.padStart(5)} ci=${o.ci.padStart(4)} tests=${o.tests.padStart(4)} refs=${o.readRefs} | ${o.subs}`);
