const webpush=require('web-push'),db=require('./_db');
let fb;function admin(){if(!fb){const a=require('firebase-admin');a.initializeApp({credential:a.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))});fb=a}return fb}
async function push(dev,p){if(dev.sub.fcm)return admin().messaging().send({token:dev.sub.fcm,data:p,android:{priority:'high',ttl:3600000}});
 return webpush.sendNotification(dev.sub,JSON.stringify(p),{urgency:'high',TTL:3600})}
const dec=s=>(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const cache={};
function latest(id){return cache[id]||(cache[id]=fetch('https://www.youtube.com/feeds/videos.xml?channel_id='+id).then(r=>r.text()).then(x=>{
 const v=(x.match(/<yt:videoId>([^<]+)/)||[])[1];return v?{vid:v,title:dec((x.match(/<entry>[\s\S]*?<title>([^<]+)/)||[])[1])}:null}).catch(()=>null))}
module.exports=async(req,res)=>{
 if(process.env.CRON_SECRET&&req.query.key!==process.env.CRON_SECRET)return res.status(401).end();
 webpush.setVapidDetails('mailto:'+(process.env.VAPID_EMAIL||'admin@example.com'),process.env.VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);
 const all=await db.hgetall('devices')||{};let sent=0;
 for(const ep of Object.keys(all)){
  const dev=typeof all[ep]==='string'?JSON.parse(all[ep]):all[ep];let dirty=false;
  for(const ch of dev.channels){
   const l=await latest(ch.id);if(!l)continue;
   if(ch.last&&ch.last!==l.vid){
    try{await push(dev,{channel:ch.name,title:l.title,vid:l.vid,url:'https://www.youtube.com/watch?v='+l.vid});sent++}
    catch(e){if(e.statusCode===404||e.statusCode===410||(e.code||'').includes('registration-token-not-registered')){await db.hdel('devices',ep);break}}
   }
   if(ch.last!==l.vid){ch.last=l.vid;dirty=true}
  }
  if(dirty)await db.hset('devices',{[ep]:JSON.stringify(dev)});
 }
 res.json({ok:true,sent});
};
