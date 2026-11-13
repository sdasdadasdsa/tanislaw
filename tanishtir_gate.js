/* Tanishtir Android-only APK gate. Inert until /api/app-status explicitly confirms a ready APK. */
(function(){
'use strict';
var apiBase=String(window.TANISHTIR_API_BASE||'').trim().replace(/\/$/,'');
var ua=navigator.userAgent||'';
var os=/Android/i.test(ua)?'Android':(/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))?'iPhone / iOS':/Windows|Macintosh|Linux|CrOS/i.test(ua)?'ПК':'Другое';
window.TANISHTIR_DEVICE_OS=os;
var android=os==='Android';
var gateEnabled=false, checking=false, LIMIT=20;
var counterKey='tanishtir_android_swipes_after_enabled_v1';
var swipes=Math.max(0,Number(localStorage.getItem(counterKey))||0,Number(localStorage.getItem('dildosh_live_index_v3') ? JSON.parse(localStorage.getItem('dildosh_live_index_v3')) : 0)||0);
var get=function(id){return document.getElementById(id)};
async function reportDevice(){
 if(!apiBase||typeof visitorId!=='string')return;
 try{await fetch(apiBase+'/api/presence',{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitor:visitorId,device_os:os})})}catch(e){}
}
void reportDevice();
setInterval(reportDevice,60000);
if(!android||!apiBase)return;
var style=document.createElement('style');
style.textContent=[
'#tsGate[hidden],#tsGuide[hidden]{display:none!important}',
'.ts-overlay{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:12px;background:#0c0617e8;backdrop-filter:blur(10px);color:#fff;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif}',
'.ts-card{position:relative;box-sizing:border-box;width:min(100%,430px);max-height:calc(100dvh - 22px);overflow:auto;overscroll-behavior:contain;padding:28px 20px 20px;text-align:center;border-radius:24px;border:1px solid #ffffff30;background:linear-gradient(150deg,#442253,#1d102b 80%);box-shadow:0 22px 70px #000a}',
'.ts-card h2{font-size:24px;line-height:1.18;margin:4px 0 12px;color:white}.ts-card p{font-size:14px;line-height:1.45;margin:0 0 18px;color:#e8d6ed}',
'.ts-x{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid #ffffff30;background:#ffffff18;color:white;font-size:24px;cursor:pointer}',
'.ts-heart{display:grid;place-items:center;width:63px;height:63px;margin:0 auto 15px;border-radius:20px;background:linear-gradient(130deg,#f8489b,#a547e0);box-shadow:0 10px 32px #ee39964a;font-size:32px}',
'.ts-download{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;min-height:54px;border:0;border-radius:15px;background:linear-gradient(120deg,#fa3c95,#bd3fe4);color:#fff;font-size:16px;font-weight:850;cursor:pointer}',
'.ts-label{margin-top:11px;color:#bfa9ca;font-size:11px}',
'.ts-guide-card{padding:18px 13px 13px}.ts-guide-card h2{font-size:20px;text-align:left;padding-right:36px;margin:0 0 5px}',
'.ts-guide-card p{font-size:12px;margin:0 0 10px}.ts-step{border:1px solid #ffffff20;border-radius:14px;background:#ffffff0b;padding:9px;margin:0 0 9px;text-align:left}',
'.ts-step-top{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:750;margin-bottom:7px}',
'.ts-number{display:grid;place-items:center;width:24px;height:24px;border-radius:8px;background:#ef429a;flex-shrink:0}',
'.ts-screenshot{width:100%;max-height:165px;object-fit:cover;object-position:center;border-radius:9px;display:block}',
'.ts-file{display:flex;align-items:center;gap:10px;border:2px solid #4e9dff;border-radius:10px;padding:10px;background:#181923;font-size:13px;color:white}',
'.ts-file small{display:block;color:#b4b9c7}.ts-arrow{margin-left:auto;color:#42df95;font-weight:900;font-size:24px}',
'.ts-note{font-size:10px!important;margin:8px 3px 0!important;color:#beaaca!important}',
'@media(max-height:660px){.ts-guide-card{padding:10px}.ts-guide-card h2{font-size:18px}.ts-step{padding:7px;margin-bottom:6px}.ts-screenshot{max-height:110px}.ts-card p{margin-bottom:8px}}',
'@media(max-height:550px){.ts-screenshot{max-height:80px}.ts-file{padding:6px}.ts-card h2{font-size:18px}}'
].join('');
document.head.appendChild(style);
var gate=document.createElement('div');
gate.id='tsGate';gate.className='ts-overlay';gate.hidden=true;
gate.innerHTML='<section class="ts-card" role="dialog" aria-modal="true" aria-labelledby="tsGateHeading">'+
'<button class="ts-x" id="tsHideGate" type="button" aria-label="Ёпиш">×</button>'+
'<div class="ts-heart" aria-hidden="true">♡</div><h2 id="tsGateHeading">Анкеталар лимити тугади!</h2>'+
'<p>Кечирасиз, 20 та анкетани кўриб чиқдингиз. <strong>Иловада лимитлар йўқ!</strong> Танишувни давом эттириш учун иловани юклаб олинг.</p>'+
'<button class="ts-download" id="tsDownload" type="button">↓ Иловани юклаб олиш</button>'+
'<div class="ts-label">Android учун · Tanislaw.apk</div></section>';
var guide=document.createElement('div');guide.id='tsGuide';guide.className='ts-overlay';guide.hidden=true;
guide.innerHTML='<section class="ts-card ts-guide-card" role="dialog" aria-modal="true" aria-labelledby="tsGuideHeading">'+
'<button class="ts-x" id="tsHideGuide" type="button" aria-label="Ёпиш">×</button>'+
'<h2 id="tsGuideHeading">Ўрнатиш йўриқномаси</h2><p>Файл юклангач, қуйидаги қадамларни бажаринг:</p>'+
'<div class="ts-step"><div class="ts-step-top"><span class="ts-number">1</span>Юкланган файл ёнидаги «Ochish» тугмасини босинг</div>'+
'<img class="ts-screenshot" src="guide/open.webp" alt="Юкланган файлни очиш" loading="lazy"></div>'+
'<div class="ts-step"><div class="ts-step-top"><span class="ts-number">2</span>Ёки «Юклаб олинганлар» бўлимидаги файлни очинг</div>'+
'<div class="ts-file"><span style="font-size:22px">▣</span><span><strong>Tanislaw.apk</strong><small>Android илова файли</small></span><span class="ts-arrow">↖</span></div></div>'+
'<button class="ts-download" id="tsRepeat" type="button">↻ Қайта юклаб олиш</button>'+
'<p class="ts-note">Юклаб олиш фақат тугмани босганингизда бошланади.</p></section>';
document.body.appendChild(gate);document.body.appendChild(guide);
var frame=document.createElement('iframe');frame.hidden=true;frame.style.display='none';frame.title='APK download';document.body.appendChild(frame);
function welcomeOpen(){return !get('welcomeOverlay')?.classList.contains('hidden')}
function unlock(){if(!get('chatModal')?.classList.contains('open')&&!welcomeOpen())document.body.style.overflow=''}
function closeOverlays(){gate.hidden=true;guide.hidden=true;unlock()}
function showGate(){if(!gateEnabled||swipes<LIMIT||welcomeOpen()||!guide.hidden)return;gate.hidden=false;document.body.style.overflow='hidden'}
get('tsHideGate').addEventListener('click',function(){gate.hidden=true;unlock()});
get('tsHideGuide').addEventListener('click',function(){guide.hidden=true;unlock()});
get('welcomeContinue')?.addEventListener('click',function(){setTimeout(showGate,100)});
var oldAct=window.act;
if(typeof oldAct==='function')window.act=function(kind){
 if(gateEnabled&&swipes>=LIMIT){showGate();return}
 var canSwipe=gateEnabled&&(kind==='like'||kind==='nope')&&!busy&&!get('chatModal')?.classList.contains('open')&&get('discover')?.classList.contains('is-active');
 var result=oldAct(kind);
 if(canSwipe){swipes++;localStorage.setItem(counterKey,String(swipes));if(swipes>=LIMIT)setTimeout(showGate,380)}
 return result;
};
var oldOpenChat=window.openChat;
if(typeof oldOpenChat==='function')window.openChat=function(profile){
 if(gateEnabled&&swipes>=LIMIT&&!get('messages')?.classList.contains('is-active')){showGate();return}
 return oldOpenChat(profile);
};
function logClick(type){
 var payload=JSON.stringify({visitor:typeof visitorId==='string'?visitorId:'',device_os:os,click_type:type});
 var url=apiBase+'/api/download-click';
 try{if(navigator.sendBeacon&&navigator.sendBeacon(url,new Blob([payload],{type:'text/plain'})))return}catch(e){}
 void fetch(url,{method:'POST',mode:'cors',keepalive:true,headers:{'Content-Type':'text/plain'},body:payload}).catch(function(){});
}
function startDownload(type){
 if(!gateEnabled)return;
 logClick(type);
 frame.src=apiBase+'/download/tanislaw.apk?source=tanishtir&t='+Date.now();
 gate.hidden=true;guide.hidden=false;document.body.style.overflow='hidden';
}
get('tsDownload').addEventListener('click',function(){startDownload('first')});
get('tsRepeat').addEventListener('click',function(){startDownload('repeat')});
async function checkReady(){
 if(checking)return;checking=true;
 try{var res=await fetch(apiBase+'/api/app-status',{cache:'no-store',mode:'cors'});if(!res.ok)throw Error('server unavailable');var data=await res.json();gateEnabled=data.available===true&&data.filename==='Tanislaw.apk'}
 catch(e){gateEnabled=false}
 finally{checking=false}
 if(!gateEnabled)closeOverlays();else if(swipes>=LIMIT)showGate();
}
void checkReady();
setInterval(checkReady,30000);
window.addEventListener('focus',function(){void checkReady()});
})();