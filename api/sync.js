const db=require('./_db');
module.exports=async(req,res)=>{
 if(req.method!=='POST')return res.status(405).end();
 const {sub,channels}=req.body||{};
 if(!sub||!sub.endpoint||!Array.isArray(channels))return res.status(400).json({error:'bad request'});
 let old=await db.hget('devices',sub.endpoint);if(typeof old==='string')old=JSON.parse(old);
 const prev={};((old&&old.channels)||[]).forEach(c=>prev[c.id]=c.last);
 const list=channels.slice(0,100).map(c=>({id:c.id,name:c.name,last:prev[c.id]||c.last||''}));
 await db.hset('devices',{[sub.endpoint]:JSON.stringify({sub,channels:list})});
 res.json({ok:true});
};
