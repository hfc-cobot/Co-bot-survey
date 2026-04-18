// added new supbase keys
const SUPABASE_URL= "https://rrgrghlvdtailyxiwjti.supabase.co"
const SUPABASE_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3JnaGx2ZHRhaWx5eGl3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjc1OTEsImV4cCI6MjA5MTg0MzU5MX0.C1P8m4iONxi7NRoSI08alJcbjCzoykpiOl-X8J6oq2Y"

const supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// unique session
const session_id = crypto.randomUUID()

// slider state
const sliders = {
  task: { value: 50 },
  vulnerability: { value: 50 }
}

// ✅ UPDATE UI
function updateSlider(id){
  const s = sliders[id]

  // clamp value
  s.value = Math.max(0, Math.min(100, s.value))

  const thumb = document.getElementById(id+"_thumb")
  const bubble = document.getElementById(id+"_bubble")
  const fill = document.getElementById(id+"_fill")

  const percent = s.value

  thumb.style.left = percent + "%"
  bubble.style.left = percent + "%"
  fill.style.width = percent + "%"

  bubble.innerText = Math.round(s.value)
}

// ✅ BUTTON CONTROL
function adjust(id, step){
  sliders[id].value += step
  updateSlider(id)

  // log after button click
  logResponse()
}

// ✅ DRAG SETUP
function setupDrag(id){
  const track = document.getElementById(id+"_track")
  const thumb = document.getElementById(id+"_thumb")

  let startX = 0
  let startValue = 0
  let dragging = false

  function move(clientX){
    const rect = track.getBoundingClientRect()
    let percent = (clientX - rect.left) / rect.width * 100
    sliders[id].value = percent
    updateSlider(id)
  }

  thumb.addEventListener("mousedown",(e)=>{
    dragging = true

    function onMove(e){
      if(!dragging) return
      move(e.clientX)
    }

    function onUp(){
      dragging = false
      document.removeEventListener("mousemove",onMove)
      document.removeEventListener("mouseup",onUp)

      logResponse()
    }

    document.addEventListener("mousemove",onMove)
    document.addEventListener("mouseup",onUp)
  })

  thumb.addEventListener("touchstart",(e)=>{
    dragging = true

    function onMove(e){
      if(!dragging) return
      move(e.touches[0].clientX)
    }

    function onEnd(){
      dragging = false
      document.removeEventListener("touchmove",onMove)
      document.removeEventListener("touchend",onEnd)

      logResponse()
    }

    document.addEventListener("touchmove",onMove)
    document.addEventListener("touchend",onEnd)
  })
}

// init sliders
Object.keys(sliders).forEach(id=>{
  setupDrag(id)
  updateSlider(id)
})

// ✅ DB INSERT
async function logResponse(){
  const payload = {
    session_id: session_id,
    task_value: sliders.task.value,
    vulnerability_value: sliders.vulnerability.value
  }

  const { data, error } = await supa
    .from("trust_survey") // ✅ IMPORTANT: underscore, not hyphen
    .insert([payload])

  if(error){
    console.error("INSERT ERROR:", error)
  } else {
    console.log("INSERT SUCCESS:", data)
  }
}