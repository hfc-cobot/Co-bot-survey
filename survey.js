const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4";

let supa=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

const session_id=crypto.randomUUID();

const sliders=["comfort","vulnerability","punctuality"];

const sensitivity=0.2; // 5x slower movement



function updateDisplay(id){

const slider=document.getElementById(id);
const bubble=document.getElementById(id+"_value");

const value=parseFloat(slider.dataset.realValue);

const percent=slider.value;

bubble.innerText=Math.round(value);
bubble.style.left=percent+"%";

}



function adjust(id,step){

const slider=document.getElementById(id);

let value=parseFloat(slider.dataset.realValue);

value+=step;

slider.dataset.realValue=value;

updateDisplay(id);

logResponse();

}



sliders.forEach(id=>{

const slider=document.getElementById(id);

slider.min=0;
slider.max=100;
slider.value=50;

slider.dataset.realValue=50;

let last=50;

slider.addEventListener("input",()=>{

let current=parseFloat(slider.value);

let movement=current-last;

/* slow sensitivity */

let real=parseFloat(slider.dataset.realValue);

real+=movement*20*sensitivity;

slider.dataset.realValue=real;

/* keep thumb centered */

slider.value=50;
last=50;

updateDisplay(id);

logResponse();

});

updateDisplay(id);

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
