const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co"
const SUPABASE_KEY="YOUR_KEY"

const supa = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const session_id = crypto.randomUUID()

const sliders={
comfort:{value:50},
vulnerability:{value:50},
punctuality:{value:50}
}

function updateSlider(id){

const s=sliders[id]

const thumb=document.getElementById(id+"_thumb")
const bubble=document.getElementById(id+"_bubble")
const fill=document.getElementById(id+"_fill")

let percent=s.value

// clamp only for visual position
let visual=Math.max(0,Math.min(100,percent))

thumb.style.left=visual+"%"
bubble.style.left=visual+"%"
fill.style.width=visual+"%"

bubble.innerText=Math.round(s.value)

}

function adjust(id,step){

let s=sliders[id]

s.value+=step

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

// allow unlimited values
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
