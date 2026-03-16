const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"

const supa = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const session_id = crypto.randomUUID()


const sliders={
comfort:{value:50},
vulnerability:{value:50},
punctuality:{value:50}
}


function updateSlider(id){

const s=sliders[id]

const track=document.getElementById(id+"_track")
const thumb=document.getElementById(id+"_thumb")
const bubble=document.getElementById(id+"_bubble")
const fill=document.getElementById(id+"_fill")

let percent=s.value

thumb.style.left=percent+"%"
bubble.style.left=percent+"%"
fill.style.width=percent+"%"

bubble.innerText=Math.round(s.value)

}


function adjust(id,step){

let s=sliders[id]

s.value+=step

if(s.value<0)s.value=0
if(s.value>100)s.value=100

updateSlider(id)
logResponse()

}


function setupDrag(id){

const track=document.getElementById(id+"_track")
const thumb=document.getElementById(id+"_thumb")

let dragging=false


function move(clientX){

const rect=track.getBoundingClientRect()

let percent=(clientX-rect.left)/rect.width*100

percent=Math.max(0,Math.min(100,percent))

sliders[id].value=percent

updateSlider(id)

}


thumb.addEventListener("mousedown",()=>dragging=true)

document.addEventListener("mouseup",()=>{
if(dragging){
dragging=false
logResponse()
}
})

document.addEventListener("mousemove",(e)=>{
if(dragging)move(e.clientX)
})


thumb.addEventListener("touchstart",()=>dragging=true)

document.addEventListener("touchend",()=>{
if(dragging){
dragging=false
logResponse()
}
})

document.addEventListener("touchmove",(e)=>{
if(dragging)move(e.touches[0].clientX)
})

}


Object.keys(sliders).forEach(id=>{
setupDrag(id)
updateSlider(id)
})



async function logResponse(){

const data={
session_id:session_id,
comfort_value:sliders.comfort.value,
vulnerability_value:sliders.vulnerability.value,
punctuality_value:sliders.punctuality.value
}

const {error}=await supa.from("survey_responses").insert(data)

if(error)console.error(error)

}
