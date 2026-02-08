const countries=[
{code:'IN',name:'India',tz:'Asia/Kolkata',utc:'+05:30',lat:20.5937,lng:78.9629,color:'#ff9933'},
{code:'US',name:'United States',tz:'America/New_York',utc:'-05:00',lat:37.0902,lng:-95.7129,color:'#3b82f6'},
{code:'GB',name:'United Kingdom',tz:'Europe/London',utc:'+00:00',lat:55.3781,lng:-3.4360,color:'#6366f1'},
{code:'JP',name:'Japan',tz:'Asia/Tokyo',utc:'+09:00',lat:36.2048,lng:138.2529,color:'#ec4899'},
{code:'KR',name:'South Korea',tz:'Asia/Seoul',utc:'+09:00',lat:35.9078,lng:127.7669,color:'#22c55e'},
{code:'CN',name:'China',tz:'Asia/Shanghai',utc:'+08:00',lat:35.8617,lng:104.1954,color:'#ef4444'},
{code:'PK',name:'Pakistan',tz:'Asia/Karachi',utc:'+05:00',lat:30.3753,lng:69.3451,color:'#10b981'},
{code:'NL',name:'Netherlands',tz:'Europe/Amsterdam',utc:'+01:00',lat:52.1326,lng:5.2913,color:'#f59e0b'},
{code:'DE',name:'Germany',tz:'Europe/Berlin',utc:'+01:00',lat:51.1657,lng:10.4515,color:'#facc15'},
{code:'FR',name:'France',tz:'Europe/Paris',utc:'+01:00',lat:46.2276,lng:2.2137,color:'#60a5fa'},
{code:'ES',name:'Spain',tz:'Europe/Madrid',utc:'+01:00',lat:40.4637,lng:-3.7492,color:'#fb923c'},
{code:'IT',name:'Italy',tz:'Europe/Rome',utc:'+01:00',lat:41.8719,lng:12.5674,color:'#34d399'},
{code:'AU',name:'Australia',tz:'Australia/Sydney',utc:'+10:00',lat:-25.2744,lng:133.7751,color:'#22d3ee'},
{code:'CA',name:'Canada',tz:'America/Toronto',utc:'-05:00',lat:56.1304,lng:-106.3468,color:'#ef4444'},
{code:'BR',name:'Brazil',tz:'America/Sao_Paulo',utc:'-03:00',lat:-14.2350,lng:-51.9253,color:'#22c55e'},
{code:'MX',name:'Mexico',tz:'America/Mexico_City',utc:'-06:00',lat:23.6345,lng:-102.5528,color:'#eab308'},
{code:'ZA',name:'South Africa',tz:'Africa/Johannesburg',utc:'+02:00',lat:-30.5595,lng:22.9375,color:'#84cc16'},
{code:'AE',name:'UAE',tz:'Asia/Dubai',utc:'+04:00',lat:23.4241,lng:53.8478,color:'#f97316'},
{code:'SA',name:'Saudi Arabia',tz:'Asia/Riyadh',utc:'+03:00',lat:23.8859,lng:45.0792,color:'#10b981'},
{code:'SG',name:'Singapore',tz:'Asia/Singapore',utc:'+08:00',lat:1.3521,lng:103.8198,color:'#06b6d4'},
{code:'MY',name:'Malaysia',tz:'Asia/Kuala_Lumpur',utc:'+08:00',lat:4.2105,lng:101.9758,color:'#a78bfa'},
{code:'TH',name:'Thailand',tz:'Asia/Bangkok',utc:'+07:00',lat:15.87,lng:100.9925,color:'#f472b6'},
{code:'ID',name:'Indonesia',tz:'Asia/Jakarta',utc:'+07:00',lat:-0.7893,lng:113.9213,color:'#38bdf8'},
{code:'PH',name:'Philippines',tz:'Asia/Manila',utc:'+08:00',lat:12.8797,lng:121.774,color:'#fb7185'},
{code:'NZ',name:'New Zealand',tz:'Pacific/Auckland',utc:'+12:00',lat:-40.9006,lng:174.886,color:'#4ade80'}
];

const countrySel=document.getElementById('country');
const typeSel=document.getElementById('holidayType');
const clock=document.getElementById('clock');

countries.forEach(c=>{
const o=document.createElement('option');
o.value=c.code;
o.text=c.name;
countrySel.appendChild(o);
});

countrySel.value="IN";

function updateClock(){
const c=countries.find(x=>x.code===countrySel.value);
if(!c) return;
const now=new Date().toLocaleString('en-US',{timeZone:c.tz});
clock.innerText=`Local Time (${c.name}): ${now} | UTC ${c.utc}`;
}

setInterval(updateClock,1000);

function loadTimeline(){

const country=countrySel.value;
const selectedType=typeSel.value;
const data=holidayDB[country]||[];

const grouped={};
for(let i=1;i<=12;i++) grouped[i]=[];

data.filter(h=> selectedType==='All' || h.type===selectedType)
.forEach(h=>{
const m=new Date(h.date).getMonth()+1;
grouped[m].push(h);
});

const container=document.getElementById('timeline');
container.innerHTML='';

Object.keys(grouped).forEach(month=>{

const card=document.createElement('div');
card.className='month-card';

const title=document.createElement('h3');
title.innerText=new Date(2024,month-1).toLocaleString('en',{month:'long'});
card.appendChild(title);

if(!grouped[month].length){
const empty=document.createElement('div');
empty.innerText='No holidays';
empty.style.opacity='0.5';
card.appendChild(empty);
}

grouped[month].forEach(h=>{
const pill=document.createElement('div');
pill.className=`holiday-pill type-${h.type}`;
pill.innerText=`${h.date} - ${h.name}`;
pill.onclick=()=>openModal(h);
card.appendChild(pill);
});

container.appendChild(card);
gsap.from(card,{opacity:0,y:40,duration:0.5});
});

updateClock();
rotateGlobeToCountry();
}

function openModal(h){
modalTitle.innerText=h.name;
modalDesc.innerText=`${h.date} | ${h.type}`;
modal.classList.add('active');
}

function closeModal(){
modal.classList.remove('active');
}

/* ===============================
📰 COUNTRY NEWS FEATURE
=============================== */
let previousTitles = new Set();

async function loadNews(){

const c=countries.find(x=>x.code===countrySel.value);
if(!c) return;

modalTitle.innerHTML=`
<div class="modal-header">
<span class="modal-title">📰 ${c.name} News</span>
<button class="refresh-btn" onclick="loadNews()">Refresh</button>
</div>
`;

modalDesc.innerHTML=`
<div class="modal-content-scroll">
<div class="news-skeleton"></div>
<div class="news-skeleton"></div>
<div class="news-skeleton"></div>
</div>
`;

modal.classList.add('active');

const cacheBuster=Date.now();

/* ---------- FETCH HELPER ---------- */

async function fetchRSS(url){

try{
const api=`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&cb=${cacheBuster}`;
const res=await fetch(api);
const data=await res.json();
return data.items || [];
}catch{
return [];
}

}

/* ---------- SEARCH VARIANTS ---------- */

const searchVariants=[
c.name,
`${c.name} news`,
`${c.name} economy`,
`${c.name} politics`,
`${c.name} business`
];

const variant=searchVariants[Math.floor(Math.random()*searchVariants.length)];

const feeds=[
`https://news.google.com/rss/search?q=${encodeURIComponent(variant)}`,
`https://news.google.com/rss?hl=en-${c.code}&gl=${c.code}&ceid=${c.code}:en`,
`https://news.google.com/rss`
];

/* ---------- FETCH ---------- */

let results=[];

for(const feed of feeds){
const items=await fetchRSS(feed);
results=[...results,...items];
}

/* ---------- REMOVE DUPLICATES ---------- */

const seen=new Set();

results=results.filter(n=>{
if(seen.has(n.title)) return false;
seen.add(n.title);
return true;
});

/* ---------- COUNTRY RELEVANCE SCORING ---------- */

results = results.map(n=>{

const text=(n.title+" "+(n.description||"")).toLowerCase();
let score=0;

if(text.includes(c.name.toLowerCase())) score+=3;
if(text.includes(c.code.toLowerCase())) score+=2;
if(n.source?.name?.toLowerCase().includes(c.name.toLowerCase())) score+=1;

return {...n,score};

});

/* ---------- SORT BY RELEVANCE ---------- */

results.sort((a,b)=>b.score-a.score);

/* ---------- REMOVE PREVIOUS ---------- */

results=results.filter(n=>!previousTitles.has(n.title));

if(results.length<3){
previousTitles.clear();
}

/* ---------- SHUFFLE TOP RESULTS ONLY ---------- */

let topResults=results.slice(0,10);
topResults.sort(()=>Math.random()-0.5);

/* ---------- STORE MEMORY ---------- */

topResults.slice(0,5).forEach(n=>{
previousTitles.add(n.title);
});

/* ---------- NO RESULT ---------- */

if(topResults.length===0){
modalDesc.innerHTML="📰 Try refreshing after few seconds";
return;
}

/* ---------- RENDER ---------- */

let html="";

topResults.slice(0,5).forEach(n=>{

html+=`
<div class="news-card" onclick="window.open('${n.link}')">

<div class="news-title">${n.title}</div>

<div class="news-source">
${n.source?.name || ""} • ${new Date(n.pubDate).toLocaleDateString()}
</div>

</div>
`;
});

modalDesc.innerHTML=`
<div class="modal-content-scroll">
${html}
</div>
`;

}





/*Wheather Code*/
function weatherCodeToIcon(code){
const map={
0:"☀️",
1:"🌤️",
2:"⛅",
3:"☁️",
45:"🌫️",
48:"🌫️",
51:"🌦️",
61:"🌧️",
71:"❄️",
95:"⛈️"
};
return map[code] || "🌍";
}

/* ===============================
🌦️ OPEN METEO WEATHER FEATURE
=============================== */

async function loadWeather(){

const c=countries.find(x=>x.code===countrySel.value);
if(!c) return;

const url=`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

try{

const res=await fetch(url);
const data=await res.json();

const current=data.current_weather;
const daily=data.daily;

if(!current){
alert("Weather unavailable");
return;
}

const icon=weatherCodeToIcon(current.weathercode);

/* ---------- AI Suggestion ---------- */

let suggestion="";

if([61,63,65].includes(current.weathercode))
suggestion="☔ Carry umbrella";

else if([0,1].includes(current.weathercode))
suggestion="🌞 Great for outdoor plans";

else if([71,73,75].includes(current.weathercode))
suggestion="❄ Wear warm clothes";

else
suggestion="🌍 Good day for travel";

/* ---------- 5 Day Forecast ---------- */

let forecastHTML="<br><b>📆 5 Day Forecast</b><br>";

for(let i=0;i<5;i++){

const fIcon=weatherCodeToIcon(daily.weathercode[i]);

forecastHTML+=`
<div style="
margin-top:8px;
padding:8px;
border-radius:10px;
background:rgba(255,255,255,0.05)
">
${daily.time[i]} — ${fIcon}
<br>
${daily.temperature_2m_min[i]}°C / ${daily.temperature_2m_max[i]}°C
</div>
`;
}

/* ---------- MODAL ---------- */

modalTitle.innerText=`Weather in ${c.name}`;

modalDesc.innerHTML=`

<div style="font-size:22px;margin-bottom:8px">
${icon}
</div>

<div style="margin-bottom:10px">
🌡️ Temperature: <b>${current.temperature}°C</b><br>
🌬️ Wind: <b>${current.windspeed} km/h</b><br>
</div>

<div style="
margin-top:10px;
padding:10px;
border-radius:12px;
background:rgba(0,234,255,0.08)
">
🧠 ${suggestion}
</div>

${forecastHTML}

`;

modal.classList.add('active');

}catch(err){
alert("Weather data unavailable");
}

}


/* ===============================
🌍 THEME AWARE GLOBE
=============================== */

let globe;

function initGlobe(){

const isLight=document.body.classList.contains("light-theme");

globe = Globe()(document.getElementById('globeViz'))
.globeImageUrl(
isLight
? '//unpkg.com/three-globe/example/img/earth-day.jpg'
: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
)
.bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
.backgroundColor(isLight ? '#e2e8f0' : '#020617')
.pointsData(countries)
.pointLat(d=>d.lat)
.pointLng(d=>d.lng)
.pointColor(d=>d.color)
.pointAltitude(0.03)
.pointRadius(0.7)
.onPointClick(d=>{
countrySel.value=d.code;
loadTimeline();
});

resizeGlobe();
rotateGlobeToCountry();
}


/* ===============================
🌗 THEME TOGGLE SYSTEM
=============================== */

const themeToggle = document.getElementById("themeToggle");

if(localStorage.getItem("theme")==="light"){
document.body.classList.add("light-theme");
themeToggle.innerText="🌞 Light Mode";
}

themeToggle.onclick=()=>{

document.body.classList.toggle("light-theme");

if(document.body.classList.contains("light-theme")){
localStorage.setItem("theme","light");
themeToggle.innerText="🌞 Light Mode";
}else{
localStorage.setItem("theme","dark");
themeToggle.innerText="🌙 Dark Mode";
}

/* Rebuild globe */
document.getElementById("globeViz").innerHTML="";
initGlobe();

};

/* MOBILE RESIZE SUPPORT */

function resizeGlobe(){
const container=document.getElementById("globeViz");
if(!container || !globe) return;
globe.width(container.offsetWidth);
globe.height(container.offsetHeight);
}

window.addEventListener("resize", resizeGlobe);
window.addEventListener("orientationchange", ()=>{
setTimeout(resizeGlobe,600);
});
setTimeout(resizeGlobe,500);

function rotateGlobeToCountry(){
if(!globe) return;
const c=countries.find(x=>x.code===countrySel.value);
if(!c) return;
globe.pointOfView({lat:c.lat,lng:c.lng,altitude:1.8},1500);
}

countrySel.onchange=loadTimeline;
typeSel.onchange=loadTimeline;

window.addEventListener("load", ()=>{
initGlobe();
loadTimeline();
});
