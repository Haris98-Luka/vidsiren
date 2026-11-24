const Redis=require('ioredis');
let c;
module.exports=new Proxy({},{get:(_,k)=>{c=c||new Redis(process.env.REDIS_URL,{maxRetriesPerRequest:2,connectTimeout:8000});return c[k].bind(c)}});
