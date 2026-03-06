const SUPABASE_URL = "https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"; // replace with your key

let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const session_id = crypto.randomUUID();
const sliders = ["comfort", "vulnerability", "punctuality"];
const SENSITIVITY = 0.04; // very slow, precise movement

// Update bubble above slider
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

// Expand slider range dynamically
function expandRange(slider){
  let value = parseFloat(slider.value);
  let min = parseFloat(slider.min);
  let max = parseFloat(slider.max);
  const threshold = 5;

  if(value >= max - threshold){
    max += 5;
  }
  if(value <= min + threshold){
    min -= 5;
  }

  slider.min = min;
  slider.max = max;
}

// + / - button adjustment
function adjust(id, step){
  const slider = document.getElementById(id);
  slider.value = parseFloat(slider.value) + step;
  expandRange(slider);
  updateDisplay(id);
  logResponse();
}

// Initialize sliders with drag support
sliders.forEach(id=>{
  const slider = document.getElementById(id);
  slider.step = 1;

  // drag logic
  let dragging = false;
  let startX = 0;
  let startValue = 0;

  slider.addEventListener("mousedown", startDrag);
  slider.addEventListener("touchstart", startDrag);

  function startDrag(e){
    e.preventDefault();
    dragging = true;
    startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startValue = parseFloat(slider.value);

    function moveHandler(ev){
      const currentX = ev.type.includes("touch") ? ev.touches[0].clientX : ev.clientX;
      const dx = currentX - startX;

      // Apply slow sensitivity
      const newValue = startValue + dx * SENSITIVITY;
      slider.value = newValue;
      expandRange(slider);
      updateDisplay(id);
    }

    function stopHandler(){
      dragging = false;
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("mouseup", stopHandler);
      document.removeEventListener("touchend", stopHandler);
      logResponse();
    }

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, {passive:false});
    document.addEventListener("mouseup", stopHandler);
    document.addEventListener("touchend", stopHandler);
  }

  slider.addEventListener("input", ()=>{
    expandRange(slider);
    updateDisplay(id);
    logResponse();
  });

  updateDisplay(id);
});

// Log to Supabase
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
