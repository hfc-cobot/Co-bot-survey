// added new supbase keys
const SUPABASE_URL= "https://rrgrghlvdtailyxiwjti.supabase.co"
const SUPABASE_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3JnaGx2ZHRhaWx5eGl3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjc1OTEsImV4cCI6MjA5MTg0MzU5MX0.C1P8m4iONxi7NRoSI08alJcbjCzoykpiOl-X8J6oq2Y"

const supa = supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const session_id = crypto.randomUUID()

const sliders={
  task:{value:50},
  vulnerability:{value:50}
}
// =======================
// UPDATE UI (DYNAMIC SCALE + SPACING FIX)
// =======================
function updateSlider(id){

  const s = sliders[id]

  const thumb = document.getElementById(id+"_thumb")
  const bubble = document.getElementById(id+"_bubble")
  const fill = document.getElementById(id+"_fill")

  const topLabel = document.getElementById(id+"_top")
  const bottomLabel = document.getElementById(id+"_bottom")

  let value = s.value

  // ✅ Dynamic range
  let min = Math.min(0, value)
  let max = Math.max(100, value)
  let range = max - min

  let percent = ((value - min) / range) * 100

  // Slider UI
  thumb.style.bottom = percent + "%"
  fill.style.height = percent + "%"
  bubble.style.bottom = percent + "%"
  bubble.innerText = Math.round(value)

  // Label positions
  let topPercent = ((100 - min) / range) * 100
  let bottomPercent = ((0 - min) / range) * 100

  // ✅ spacing fix so labels don’t touch buttons
  const OFFSET = 12

  topLabel.style.bottom = `calc(${topPercent}% - ${OFFSET}px)`
  bottomLabel.style.bottom = `calc(${bottomPercent}% + ${OFFSET}px)`

  topLabel.innerText = 100
  bottomLabel.innerText = 0
}

// =======================
// BUTTON CONTROLS
// =======================
let saveTimeout

function adjust(id,step){
  sliders[id].value += step
  updateSlider(id)

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(()=>{
    logResponse()
  }, 600)
}

// =======================
// DRAG FUNCTIONALITY
// =======================
function setupDrag(id){

  const track=document.getElementById(id+"_track")
  const thumb=document.getElementById(id+"_thumb")

  let dragging=false
  let startY=0
  let startValue=0

  function move(clientY){
    const rect = track.getBoundingClientRect()

    let deltaY = startY - clientY
    let percentMove = deltaY / rect.height * 100

    let min = Math.min(0, startValue)
    let max = Math.max(100, startValue)
    let range = max - min

    sliders[id].value = startValue + (percentMove / 100) * range

    updateSlider(id)
  }

  thumb.addEventListener("pointerdown",(e)=>{
    dragging = true
    startY = e.clientY
    startValue = sliders[id].value
    thumb.setPointerCapture(e.pointerId)
  })

  thumb.addEventListener("pointermove",(e)=>{
    if(!dragging) return
    move(e.clientY)
  })

  thumb.addEventListener("pointerup",(e)=>{
    if(!dragging) return

    dragging = false
    thumb.releasePointerCapture(e.pointerId)

    logResponse()
  })

  thumb.addEventListener("pointercancel",()=>{
    dragging=false
  })
}

// =======================
// INIT
// =======================
Object.keys(sliders).forEach(id=>{
  setupDrag(id)
  updateSlider(id)
})

// =======================
// DATABASE SAVE
// =======================
async function logResponse(){

  const data = {
    session_id: session_id,
    task_value: Math.round(sliders.task.value),
    safety_value: Math.round(sliders.safety.value)
  }

  console.log("Saving:", data)

  const {error}=await supa
    .from("trust_survey")
    .insert(data)

  if(error){
    console.error("Supabase ERROR:", error)
  } else {
    console.log("Saved successfully")
  }
}