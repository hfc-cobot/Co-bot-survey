// added new supbase keys
const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co"
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"

const supa = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const session_id = crypto.randomUUID()

const sliders={
  task:{value:50},
  vulnerability:{value:50}
}

// update UI
function updateSlider(id){

const s=sliders[id]

const thumb=document.getElementById(id+"_thumb")
const bubble=document.getElementById(id+"_bubble")
const fill=document.getElementById(id+"_fill")

const label0=document.getElementById(id+"_label_0")
const label100=document.getElementById(id+"_label_100")

let value = s.value

let percent = Math.max(0, Math.min(100, value))

thumb.style.left = percent + "%"
bubble.style.left = percent + "%"
fill.style.width = percent + "%"

bubble.innerText = Math.round(value)

// label logic
let pos0 = 0
let pos100 = 100

if(value > 100){
  pos100 = 100 - (value - 100)
}

if(value < 0){
  pos0 = Math.abs(value)
}

pos0 = Math.max(0, Math.min(100, pos0))
pos100 = Math.max(0, Math.min(100, pos100))

label0.style.left = pos0 + "%"
label100.style.left = pos100 + "%"

}

// buttons
function adjust(id,step){
sliders[id].value += step
updateSlider(id)
logResponse()
}

// DRAG
function setupDrag(id){

const track=document.getElementById(id+"_track")
const thumb=document.getElementById(id+"_thumb")

let startX=0
let startValue=0
let dragging=false

thumb.addEventListener("mousedown",(e)=>{
e.stopPropagation()
dragging=true
startX = e.clientX
startValue = sliders[id].value

function onMove(e){
if(!dragging) return

const rect=track.getBoundingClientRect()
let deltaX = e.clientX - startX
let percentMove = deltaX / rect.width * 100

sliders[id].value = startValue + percentMove
updateSlider(id)
}

function onUp(){
dragging=false
document.removeEventListener("mousemove",onMove)
document.removeEventListener("mouseup",onUp)
logResponse()
}

document.addEventListener("mousemove",onMove)
document.addEventListener("mouseup",onUp)

})

// TOUCH
thumb.addEventListener("touchstart",(e)=>{
dragging=true
startX = e.touches[0].clientX
startValue = sliders[id].value

function onMove(e){
if(!dragging) return

const rect=track.getBoundingClientRect()
let deltaX = e.touches[0].clientX - startX
let percentMove = deltaX / rect.width * 100

sliders[id].value = startValue + percentMove
updateSlider(id)
}

function onEnd(){
dragging=false
document.removeEventListener("touchmove",onMove)
document.removeEventListener("touchend",onEnd)
logResponse()
}

document.addEventListener("touchmove",onMove)
document.addEventListener("touchend",onEnd)

})

}

// init
Object.keys(sliders).forEach(id=>{
setupDrag(id)
updateSlider(id)
})

// DB
async function logResponse(){

const data={
session_id:session_id,
task_value:sliders.task.value,
vulnerability_value:sliders.vulnerability.value
}

const {error}=await supa.from("trust-survey").insert(data)

if(error)console.error(error)

}
