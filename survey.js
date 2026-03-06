const SUPABASE_URL = "https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY = "YOUR_SUPABASE_KEY"; // replace with your key
let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const session_id = crypto.randomUUID();
const sliders = ["comfort", "vulnerability", "punctuality"];

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
    // Remove any slowdown, allow free drag beyond 100 or below 0
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
