const SUPABASE_URL = "https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"; // replace with your key
let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const session_id = crypto.randomUUID();
const sliders = ["comfort", "vulnerability", "punctuality"];
const EDGE_SENSITIVITY = 0.05; // slow movement beyond 100 or below 0
const sliderValues = {comfort:50, vulnerability:50, punctuality:50};

function updateDisplay(id){
  const slider = document.getElementById(id);
  const bubble = document.getElementById(id+"_value");
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const value = sliderValues[id];

  // bubble percent relative to 0-100 scale visually
  let percent = Math.min(Math.max((value - min)/(max - min)*100,0),100);
  bubble.innerText = Math.round(value);
  bubble.style.left = percent + "%";
}

function adjust(id, step){
  sliderValues[id] += step;
  updateDisplay(id);
  logResponse();
}

sliders.forEach(id=>{
  const slider = document.getElementById(id);
  slider.step = 1;

  slider.addEventListener("input", e=>{
    const rawValue = parseFloat(e.target.value);
    let delta = rawValue - 50;

    if(delta > 0) delta *= EDGE_SENSITIVITY;    // slow beyond 100
    else if(delta < -50) delta *= EDGE_SENSITIVITY; // slow below 0

    sliderValues[id] = 50 + delta;
    updateDisplay(id);
    logResponse();
  });

  updateDisplay(id);
});

async function logResponse(){
  const data = {
    session_id: session_id,
    comfort_value: sliderValues.comfort,
    comfort_id: "comfort",
    vulnerability_value: sliderValues.vulnerability,
    vulnerability_id: "vulnerability",
    punctuality_value: sliderValues.punctuality,
    punctuality_id: "punctuality"
  };

  const { error } = await supa.from("survey_responses").insert(data);
  if(error) console.error("Supabase insert error:", error);
}
