const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4";

let supa=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const session_id=crypto.randomUUID();

const sliders=["comfort","vulnerability","punctuality"];



function updateDisplay(id){

const slider=document.getElementById(id);
const bubble=document.getElementById(id+"_value");

const value=parseFloat(slider.value);
const min=parseFloat(slider.min);
const max=parseFloat(slider.max);

const percent=(value-min)/(max-min)*100;

bubble.innerText=Math.round(value);
bubble.style.left=percent+"%";

}



function updateMarkers(id){

const slider=document.getElementById(id);

const zero=document.getElementById(id+"_zero");
const hundred=document.getElementById(id+"_hundred");

const min=parseFloat(slider.min);
const max=parseFloat(slider.max);

const zeroPercent=(0-min)/(max-min)*100;
const hundredPercent=(100-min)/(max-min)*100;

zero.style.left=zeroPercent+"%";
hundred.style.left=hundredPercent+"%";

}



function adjust(id,step){

const slider=document.getElementById(id);

slider.value=parseFloat(slider.value)+step;

expandRange(slider);

updateDisplay(id);
updateMarkers(id);

logResponse();

}



function expandRange(slider){

let value=parseFloat(slider.value);
let min=parseFloat(slider.min);
let max=parseFloat(slider.max);

/* very slow expansion (10x slower) */

const threshold=2;

if(value>=max-threshold){

max=max+5;

}

if(value<=min+threshold){

min=min-5;

}

slider.min=min;
slider.max=max;

}



sliders.forEach(id=>{

const slider=document.getElementById(id);

slider.step=1;

slider.addEventListener("input",()=>{

expandRange(slider);

updateDisplay(id);
updateMarkers(id);

logResponse();

});

updateDisplay(id);
updateMarkers(id);

});



async function logResponse(){

const data={

session_id:session_id,

comfort_value:parseFloat(document.getElementById("comfort").value),
comfort_id:"comfort",

vulnerability_value:parseFloat(document.getElementById("vulnerability").value),
vulnerability_id:"vulnerability",

punctuality_value:parseFloat(document.getElementById("punctuality").value),
punctuality_id:"punctuality"

};

const {error}=await supa
.from("survey_responses")
.insert(data);

if(error){

console.error("Supabase insert error:",error);

}

}
