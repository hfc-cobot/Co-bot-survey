const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"

const supa = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const session_id = crypto.randomUUID()

const sliders={
punctuality:{value:50}
}

function updateSlider(id){

const s=sliders[id]

const thumb=document.getElementById(id+"_thumb")
const bubble=document.getElementById(id+"_bubble")
const fill=document.getElementById(id+"_fill")

const label0=document.getElementById(id+"_label_0")
const label100=document.getElementById(id+"_label_100")

let value = s.value

// keep thumb visually within track
let percent = Math.max(0, Math.min(100, value))

thumb.style.left = percent + "%"
bubble.style.left = percent + "%"
fill.style.width = percent + "%"

bubble.innerText = Math.round(value)

// 🔥 label movement logic (YOUR REQUIREMENT)

let pos0 = 0
let pos100 = 100

if(value > 100){
  pos100 = 100 - (value - 100)
}

if(value < 0){
  pos0 = Math.abs(value)
}

// clamp labels inside track
pos0 = Math.max(0, Math.min(100, pos0))
pos100 = Math.max(0, Math.min(100, pos100))

label0.style.left = pos0 + "%"
label100.style.left = pos100 + "%"

}

function adjust(id,step){

let s=sliders[id]
s.value += step

updateSlider(id)
logResponse()

}

// 🔥 FIXED DRAG (solves ALL 3 issues)
function setupDrag(id){

const track=document.getElementById(id+"_track")
const thumb=document.getElementById(id+"_thumb")

let dragging=false
let startX=0
let startValue=0

thumb.addEventListener("mousedown",(e)=>{
dragging=true
startX = e.clientX
startValue = sliders[id].value
})

document.addEventListener("mouseup",()=>{
if(dragging){
dragging=false
logResponse()
}
})

document.addEventListener("mousemove",(e)=>{
if(!dragging) return

const rect=track.getBoundingClientRect()

let deltaX = e.clientX - startX
let percentMove = deltaX / rect.width * 100

sliders[id].value = startValue + percentMove

updateSlider(id)
})

// TOUCH

thumb.addEventListener("touchstart",(e)=>{
dragging=true
startX = e.touches[0].clientX
startValue = sliders[id].value
})

document.addEventListener("touchend",()=>{
if(dragging){
dragging=false
logResponse()
}
})

document.addEventListener("touchmove",(e)=>{
if(!dragging) return

const rect=track.getBoundingClientRect()

let deltaX = e.touches[0].clientX - startX
let percentMove = deltaX / rect.width * 100

sliders[id].value = startValue + percentMove

updateSlider(id)
})

}

// init
Object.keys(sliders).forEach(id=>{
setupDrag(id)
updateSlider(id)
})

async function logResponse(){

const data={
session_id:session_id,
punctuality_value:sliders.punctuality.value
}

const {error}=await supa.from("survey_responses").insert(data)

if(error)console.error(error)

}
