import fs from "fs"; import path from "path";
const root=process.env.PI_SESSIONS_DIR || process.env.HOME+"/.pi/agent/sessions";
const files=process.argv.slice(2);
if(!files.length){
  const discover=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const file=path.join(dir,entry.name); if(file.includes("/run-"))continue;
    if(entry.isDirectory())discover(file); else if(entry.isFile()&&file.endsWith(".jsonl"))files.push(file);
  }};
  discover(root);
}
const rows=[];
for(const f of files){
  let lines; try{lines=fs.readFileSync(f,"utf8").trim().split("\n").map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean)}catch{continue}
  const msgs=lines.filter(l=>l.type==="message").map(l=>({t:Date.parse(l.timestamp),m:l.message}));
  const txt=c=>typeof c==="string"?c:(c||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n");
  for(let i=0;i<msgs.length;i++){
    const {t,m}=msgs[i]; if(m.role!=="user")continue; const u=txt(m.content); if(!u.includes('<skill name="gatekeep-pr"'))continue;
    // span until next real user message (not toolResult)
    let j=i+1; const stats={tools:{},sub:0,asst:0,cost:0,out:0,in:0,ctx:0,models:new Set(),lastText:"",bashCmds:[]};
    let lastT=t;
    for(;j<msgs.length;j++){const x=msgs[j]; if(x.m.role==="user")break; lastT=x.t;
      if(x.m.role==="assistant"){stats.asst++; stats.models.add(x.m.model); if(x.m.usage){stats.cost+=x.m.usage.cost?.total||0;stats.out+=x.m.usage.output||0;stats.ctx=Math.max(stats.ctx,x.m.usage.totalTokens||0)}
        for(const c of x.m.content||[]){ if(c.type==="toolCall"){stats.tools[c.name]=(stats.tools[c.name]||0)+1; if(c.name==="subagent")stats.sub++; if(c.name==="bash")stats.bashCmds.push((c.arguments?.command||"").slice(0,100))} if(c.type==="text"&&c.text.trim())stats.lastText=c.text}}
    }
    const arg=(u.match(/<\/skill>\s*([^\n]*)/)||[])[1]||"";
    const nextUser=j<msgs.length?txt(msgs[j].m.content).slice(0,120).replace(/\n/g," "):"(end)";
    const rep=stats.lastText;
    const verdict=(rep.match(/verdict[^\n]{0,80}/i)||[])[0]||"";
    const blockers=(rep.match(/blockers?[^\n]{0,60}/i)||[])[0]||"";
    rows.push({file:path.basename(path.dirname(f))+"/"+path.basename(f).slice(0,19),start:new Date(t).toISOString().slice(0,16),mins:((lastT-t)/60000).toFixed(1),asst:stats.asst,tools:JSON.stringify(stats.tools),sub:stats.sub,cost:stats.cost.toFixed(2),ctx:stats.ctx,model:[...stats.models].join(","),arg:arg.slice(0,40),verdict,blockers,nextUser,repLen:rep.length,rep});
  }
}
if(process.env.GK_ROWS_OUT)fs.writeFileSync(process.env.GK_ROWS_OUT,JSON.stringify(rows,null,1));
for(const r of rows){console.log([r.start,r.file.split("/")[0].split("-").filter(Boolean).at(-1),r.arg,r.mins+"m",r.asst+"t",r.sub+"sub",r.cost+"$",r.ctx,r.model,r.tools].join(" | "))}
