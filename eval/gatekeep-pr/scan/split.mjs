import fs from "fs"; import path from "path";
import assert from "node:assert/strict";
const txt=c=>typeof c==="string"?c:(c||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n");
const med=a=>{a=[...a].sort((x,y)=>x-y);return a.length?a[Math.floor(a.length/2)]:NaN};
const spans=msgs=>{
  const starts=msgs.flatMap((x,i)=>x.m.role==="user"&&txt(x.m.content).includes('<skill name="gatekeep-pr"')?[i]:[]);
  return starts.map((start,s)=>{
    let end=starts[s+1]??msgs.length;
    let stopped=false;
    for(let i=start+1;i<end;i++){
      if(msgs[i].m.role!=="user")continue;
      if(stopped){end=i;break;}
      const prompt=txt(msgs[i].m.content).trim();
      if(/^(stop|[0-9]+\s*[-:]?\s*stop)\b/i.test(prompt)){stopped=true;continue;}
      if(prompt.length<=40||/^(fix|wait|stop|merge|approve|show evidence|fix nits|fix \+ nits|[0-9]+)\b/i.test(prompt)||/\b(continue|fix|merge|wait)\b/i.test(prompt))continue;
      end=i;
      break;
    }
    return msgs.slice(start,end);
  });
};
if(process.argv.includes("--selftest")){
  const message=(role,content)=>({m:{role,content}});
  const call=id=>message("assistant",[{type:"toolCall",id,name:"bash",arguments:{command:"gh pr checks"}}]);
  for(const stop of ["stop","3 - stop","3: stop"]){
    const msgs=[message("user",'<skill name="gatekeep-pr">'),message("assistant","Verdict: fixable"),message("user","fix"),call("fix"),message("toolResult","stop"),message("assistant","Fixed"),message("user",stop),message("assistant","Stopped"),message("user","Explain caching"),call("caching"),message("toolResult","caching result"),message("user","Please fix the unrelated database migration performance regression"),call("migration"),message("toolResult","migration result"),message("user",'<skill name="gatekeep-pr">'),call("gate"),message("assistant","Verdict: mergeable")];
    const runs=spans(msgs);
    assert.equal(runs.length,2);
    assert.deepEqual(runs.map(run=>run.flatMap(x=>Array.isArray(x.m.content)?x.m.content.filter(c=>c.type==="toolCall").map(c=>c.id):[])),[["fix"],["gate"]]);
    assert.equal(runs[0].at(-1).m.content,"Stopped");
    assert.equal(runs[1][0],msgs[14]);
  }
  console.log("selftest ok");
  process.exit(0);
}
const buckets={};
for(const f of process.argv.slice(2)){
  const lines=fs.readFileSync(f,"utf8").trim().split("\n").map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean);
  const msgs=lines.filter(l=>l.type==="message").map(l=>({t:Date.parse(l.timestamp),m:l.message}));
  for(const span of spans(msgs)){
  const u0=span[0];
  const st=txt(u0.m.content); const v=/Retain repair consent/.test(st)?"v7.10(34ac9bab)":/blocker-only|fix nits/.test(st)?"v7.7-7.8(3c43a508)":/exact-head|Verify, don't trust/.test(st)?"v7.0-7.6":"older";
  const day=new Date(u0.t).toISOString().slice(0,10);
  let firstReport=null, bodyOnly=0, reports=0, bodyItems=0, items=0, pollMs=0, subs=0;
  const pend={};
  for(const x of span){ if(x.m.role==="assistant"){for(const c of x.m.content||[]){ if(c.type==="toolCall"){pend[c.id]={n:c.name,t:x.t,cmd:c.arguments?.command||""}; if(c.name==="subagent")subs++;} if(c.type==="text"&&/Verdict:?\**\s*(fixable|mergeable|blocked)/i.test(c.text)){reports++; if(!firstReport)firstReport=(x.t-u0.t)/60000; const b=(c.text.match(/(?:^|\n)[#*\s]*Blockers?[^\n]*\n([\s\S]*?)(?=\n[#*\s]*(?:Verdict|Nits|PR comments|Next|Pick|Menu|\d+\.\s+\[)|$)/i)||[])[1]||""; const its=b.split(/\n(?=\s*\d+\.\s)/).filter(s=>/^\s*\d+\./.test(s)); const bi=its.filter(s=>/PR body|description|PR says|The PR (says|reports|claims|lacks|does not report)/i.test(s)).length; items+=its.length; bodyItems+=bi; if(its.length&&bi===its.length)bodyOnly++;}}}
    if(x.m.role==="toolResult"){const p=pend[x.m.toolCallId]; if(p&&p.n==="bash"&&/gh (pr checks|run (watch|view|list)|pr view)|sleep \d+/.test(p.cmd))pollMs+=x.t-p.t;}}
  const k=v; (buckets[k]=buckets[k]||[]).push({day,firstReport,bodyOnly,reports,bodyItems,items,pollMin:pollMs/60000,subs});
  }
}
for(const k of Object.keys(buckets).sort()){const b=buckets[k].filter(r=>r.firstReport!=null); console.log(k,"runs="+b.length,"days="+[...new Set(b.map(r=>r.day))].sort().join(",").slice(0,80));console.log("   med firstReport="+med(b.map(r=>r.firstReport)).toFixed(1)+"m med poll="+med(b.map(r=>r.pollMin)).toFixed(1)+"m med subs="+med(b.map(r=>r.subs))+" bodyItems/items="+b.reduce((a,r)=>a+r.bodyItems,0)+"/"+b.reduce((a,r)=>a+r.items,0)+" bodyOnlyReports="+b.reduce((a,r)=>a+r.bodyOnly,0)+"/"+b.reduce((a,r)=>a+r.reports,0))}
