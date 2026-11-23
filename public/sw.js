const C='vidsiren-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['/','/icon-192.png'])))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||e.request.url.includes('/api/'))return;
e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){}
e.waitUntil((async()=>{
 await self.registration.showNotification('🚨 '+(d.channel||'New video'),{body:d.title||'Naya video upload hua hai',icon:'/icon-192.png',badge:'/icon-192.png',tag:d.vid||'vs',renotify:true,requireInteraction:true,vibrate:[600,200,600,200,600,200,600],data:{url:d.url||'/'}});
 const cl=await self.clients.matchAll({type:'window'});cl.forEach(c=>c.postMessage({type:'alarm',d}));
})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data.url))});
