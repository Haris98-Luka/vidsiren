const webpush=require('web-push'),db=require('./_db');
module.exports=async(req,res)=>{
 if(process.env.CRON_SECRET&&req.query.key!==process.env.CRON_SECRET)return res.status(401).json({error:'key galat hai'});
 const out={vapidPublic:!!process.env.VAPID_PUBLIC_KEY,vapidPrivate:!!process.env.VAPID_PRIVATE_KEY,devices:0,sent:0,errors:[]};
 try{
  webpush.setVapidDetails('mailto:'+(process.env.VAPID_EMAIL||'admin@example.com'),process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);
  const all=await db.hgetall('devices')||{};out.devices=Object.keys(all).length;
  for(const ep of Object.keys(all)){const d=typeof all[ep]==='string'?JSON.parse(all[ep]):all[ep];
   try{await webpush.sendNotification(d.sub,JSON.stringify({channel:'VidSiren Test',title:'Ye test notification hai',vid:'t'+Date.now(),url:'/'}),{urgency:'high'});out.sent++}
   catch(e){out.errors.push(String(e.statusCode||e.message))}}
 }catch(e){out.errors.push('setup: '+e.message)}
 res.json(out);
};
