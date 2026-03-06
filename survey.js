const SUPABASE_URL = "https://zuzufciobmzjfcaujpet.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1enVmY2lvYm16amZjYXVqcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTg3ODAsImV4cCI6MjA4NTM3NDc4MH0.Md56UoBCOUjOTu5qEvJsMYG0TZvgAFmWU6jPgTgTAn4"; // replace with your key
let supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const session_id = crypto.randomUUID();

const sliders = {
  comfort: {value:50, track: 'comfort_track', thumb: 'comfort_thumb', bubble: 'comfort_bubble'},
  vulnerability: {value:50, track: 'vulnerability_track', thumb: 'vulnerability_thumb', bubble: 'vulnerability_bubble'},
  punctuality: {value:50, track: 'punctuality_track', thumb: 'punctuality_thumb', bubble: 'punctuality_bubble'}
};

const EDGE_SENSITIVITY = 0.05; // slower movement beyond edges

function updateSlider(id){
  const s = sliders[id];
  const thumb = document.getElementById(s.thumb);
  const bubble = document.getElementById(s.bubble);

  const percent = Math.min(Math.max((s.value/100)*100,0),100);
  thumb.style.left = percent + '%';
  bubble.style.left = percent + '%';
  bubble.innerText = Math.round(s.value);
}

function adjust(id, step){
  sliders[id].value += step;
  updateSlider(id);
  logResponse();
}

// Drag handling
Object.keys(sliders).forEach(id=>{
  const s = sliders[id];
  const thumb = document.getElementById(s.thumb);
  const track = document.getElementById(s.track);
  let dragging = false;

  const handleMove = (clientX) => {
    const rect = track.getBoundingClientRect();
    let x = clientX - rect.left;
    let percent = x/rect.width;
    let value = percent*100;

    if(value>100) value = 100 + (value-100)*EDGE_SENSITIVITY;
    if(value<0) value = 0 + (value*EDGE_SENSITIVITY);

    sliders[id].value = value;
    updateSlider(id);
    logResponse();
  };

  // Mouse events
  thumb.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  document.addEventListener('mouseup', e => dragging=false);
  document.addEventListener('mousemove', e => { if(dragging) handleMove(e.clientX); });

  // Touch events
  thumb.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); });
  document.addEventListener('touchend', e => dragging=false);
  document.addEventListener('touchmove', e => { if(dragging) handleMove(e.touches[0].clientX); });
});

// Initial render
Object.keys(sliders).forEach(id => updateSlider(id));

async function logResponse(){
  const data = {
    session_id: session_id,
    comfort_value: sliders.comfort.value,
    comfort_id: "comfort",
    vulnerability_value: sliders.vulnerability.value,
    vulnerability_id: "vulnerability",
    punctuality_value: sliders.punctuality.value,
    punctuality_id: "punctuality"
  };
  const { error } = await supa.from("survey_responses").insert(data);
  if(error) console.error("Supabase insert error:", error);
}
