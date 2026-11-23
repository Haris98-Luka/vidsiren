(()=>{const C=window.Capacitor;if(!C||!C.isNativePlatform||!C.isNativePlatform())return;
const P=C.Plugins.PushNotifications;let tok=localStorage.fcm||'';
const on=()=>{$('nb').textContent='🔔 Alarm on hai';$('nb').classList.add('on')};
P.addListener('registration',t=>{tok=t.value;localStorage.fcm=tok;on();sync()});
window.sub=async()=>tok?{toJSON:()=>({endpoint:'fcm:'+tok,fcm:tok})}:null;
$('nb').onclick=async()=>{const r=await P.requestPermissions();if(r.receive!=='granted')return say('Notification ki ijazat dein');await P.register();say('✅ Ab app band hone par bhi alarm bajega')};
if(tok){on();P.register()}})();
