const SUPABASE_URL = "https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"; // replace with your key
let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const session_id = crypto.randomUUID();
const sliders = ["comfort", "vulnerability", "punctuality"];
const EDGE_SENSITIVITY = 0.05; // slower movement beyond 100

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

function expandRange(slider){
  let value = parseFloat(slider.value);
  let min = parseFloat(slider.min);
  let max = parseFloat(slider.max);
  const threshold = 5;

  if(value >= max - threshold){ max += 5; }
  if(value <= min + threshold){ min -= 5; }

  slider.min = min;
  slider.max = max;
}

function adjust(id, step){
  const slider = document.getElementById(id);
  slider.value = parseFloat(slider.value) + step;
  expandRange(slider);
  updateDisplay(id);
  logResponse();
}

// Initialize sliders
sliders.forEach(id => {
  const slider = document.getElementById(id);
  slider.step = 1;

  slider.addEventListener("input", ()=>{
    const value = parseFloat(slider.value);

    // Only slow movement beyond 100
    if(value > 100){
      const delta = value - 100;
      slider.value = 100 + delta * EDGE_SENSITIVITY;
    }

    expandRange(slider);
    updateDisplay(id);
    logResponse();
  });

  updateDisplay(id);
});

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
