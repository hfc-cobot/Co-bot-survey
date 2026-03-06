const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4";

let supa=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const session_id=crypto.randomUUID();

const sliders=["comfort","vulnerability","punctuality"];



function updateDisplay(id){

const slider=document.getElementById(id);
const bubble=document.getElementById(id+"_value");

const value=parseFloat(slider.dataset.realValue);

const min=parseFloat(slider.min);
const max=parseFloat(slider.max);

const percent=(slider.value-min)/(max-min)*100;

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



function scaleValue(x){

if(x<=100) return x;

if(x<=300) return 100+(x-100)*0.5;

if(x<=1000) return 200+(x-300)*0.25;

return 375+(x-1000)*0.1;

}



function inverseScaleValue(y){

if(y<=100) return y;

if(y<=200) return 100+(y-100)/0.5;

if(y<=375) return 300+(y-200)/0.25;

return 1000+(y-375)/0.1;

}



function adjust(id,step){

const slider=document.getElementById(id);

let real=parseFloat(slider.dataset.realValue||50);

real+=step;

slider.dataset.realValue=real;

slider.value=scaleValue(real);

updateDisplay(id);
updateMarkers(id);

logResponse();

}



sliders.forEach(id=>{

const slider=document.getElementById(id);

slider.step=0.1;

slider.dataset.realValue=slider.value;

slider.addEventListener("input",()=>{

let scaled=parseFloat(slider.value);

let real=inverseScaleValue(scaled);

slider.dataset.realValue=real;

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

comfort_value:parseFloat(document.getElementById("comfort").dataset.realValue),
comfort_id:"comfort",

vulnerability_value:parseFloat(document.getElementById("vulnerability").dataset.realValue),
vulnerability_id:"vulnerability",

punctuality_value:parseFloat(document.getElementById("punctuality").dataset.realValue),
punctuality_id:"punctuality"

};

const {error}=await supa
.from("survey_responses")
.insert(data);

if(error){

console.error("Supabase insert error:",error);

}

}
