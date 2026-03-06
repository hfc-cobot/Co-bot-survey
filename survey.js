const SUPABASE_URL="https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"; // replace with your key

let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const session_id = crypto.randomUUID();
const sliders = ["comfort", "vulnerability", "punctuality"];
const SENSITIVITY = 0.01; // sensitivity for slower slider movement

// Update the bubble above the thumb
function updateDisplay(id){
  const slider = document.getElementById(id);
  const bubble = document.getElementById(id+"_value");
  const value = parseFloat(slider.value);
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const percent = (value - min)/(max - min)*100;
  bubble.innerText = Math.round(value);
  bubble.style.left = percent + "%";
}

// Adjust scale dynamically
function expandRange(slider){
  let value = parseFloat(slider.value);
  let min = parseFloat(slider.min);
  let max = parseFloat(slider.max);
  const threshold = 5; // distance from edge

  // slowly expand beyond max
  if(value >= max - threshold){
    max += 5; // small increment
  }
  // slowly expand below min
  if(value <= min + threshold){
    min -= 5;
  }
  slider.min = min;
  slider.max = max;
}

// Adjust with + / - buttons
function adjust(id, step){
  const slider = document.getElementById(id);
  slider.value = parseFloat(slider.value) + step;
  expandRange(slider);
  updateDisplay(id);
  logResponse();
}

// Initialize sliders
sliders.forEach(id=>{
  const slider = document.getElementById(id);
  slider.step = 1;

  // mouse / touch drag with slower sensitivity
  let lastX = null;
  slider.addEventListener("mousedown", startDrag);
  slider.addEventListener("touchstart", startDrag);

  function startDrag(e){
    e.preventDefault();
    lastX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;

    function moveHandler(ev){
      const currentX = ev.type.includes("touch") ? ev.touches[0].clientX : ev.clientX;
      let dx = currentX - lastX;
      slider.value = parseFloat(slider.value) + dx * SENSITIVITY;
      expandRange(slider);
      updateDisplay(id);
      lastX = currentX;
      logResponse();
    }

    function stopHandler(){
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("mouseup", stopHandler);
      document.removeEventListener("touchend", stopHandler);
    }

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, {passive:false});
    document.addEventListener("mouseup", stopHandler);
    document.addEventListener("touchend", stopHandler);
  }

  // Also update bubble for normal input events
  slider.addEventListener("input", ()=>{
    expandRange(slider);
    updateDisplay(id);
    logResponse();
  });

  updateDisplay(id);
});

// Send data to Supabase
async function logResponse(){
  const data = {
    session_id: session_id,
    comfort_value: parseFloat(document.getElementById("comfort").value),
    comfort_id: "comfort",
    vulnerability_value: parseFloat(document.getElementById("vulnerability").value),
    vulnerability_id: "vulnerability",
    punctuality_value: parseFloat(document.getElementById("punctuality").value),
    punctuality_id: "punctuality"
  };

  const { error } = await supa.from("survey_responses").insert(data);
  if(error) console.error("Supabase insert error:", error);
}
