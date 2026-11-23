const dec=s=>(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
module.exports=async(req,res)=>{
 let u=(req.query.url||'').trim();
 if(!u)return res.status(400).json({error:'Link khali hai'});
 if(u[0]==='@')u='https://www.youtube.com/'+u;
 if(!/^https?:/.test(u))u='https://'+u;
 let host='';try{host=new URL(u).hostname}catch(e){return res.status(400).json({error:'Link galat hai'})}
 if(!/(^|\.)youtube\.com$/.test(host))return res.status(400).json({error:'Sirf YouTube channel ka link dalain'});
 let id=(u.match(/\/channel\/(UC[\w-]{22})/)||[])[1],html='';
 try{const r=await fetch(id?'https://www.youtube.com/channel/'+id:u,{headers:{'user-agent':'Mozilla/5.0','accept-language':'en','cookie':'CONSENT=YES+1'}});html=await r.text()}catch(e){}
 id=id||(html.match(/"channelId":"(UC[\w-]{22})"/)||html.match(/channel_id=(UC[\w-]{22})/)||[])[1];
 if(!id)return res.status(404).json({error:'Channel nahi mila'});
 const name=dec((html.match(/property="og:title" content="([^"]+)"/)||[])[1])||'Channel';
 const img=(html.match(/property="og:image" content="([^"]+)"/)||[])[1]||'';
 let last='',title='';
 try{const x=await(await fetch('https://www.youtube.com/feeds/videos.xml?channel_id='+id)).text();
  last=(x.match(/<yt:videoId>([^<]+)/)||[])[1]||'';title=dec((x.match(/<entry>[\s\S]*?<title>([^<]+)/)||[])[1]);}catch(e){}
 res.json({id,name,img,last,title});
};
