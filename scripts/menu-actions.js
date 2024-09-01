const settings = {
  fontSize: 1.1,
  scrollTempo: 1,
  autoscroll: false,
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};
var elemAutoscroll;

const setFontSize = (value) => {
  console.log("changing font size:", value);
  settings.fontSize = Number(value.toFixed(2));
  document.body.style.setProperty("--font-size", `${value}rem`);
};
const fontSizeUp = () => {
  settings.fontSize += 0.1;
  setFontSize(settings.fontSize);
};

const fontSizeDown = () => {
  settings.fontSize -= 0.1;
  setFontSize(settings.fontSize);
};

const slide_toggle = document.querySelector("#autoscroll.slide-toggle");

const isEndOfPage = () =>
  // Sprawdza czy jesteśmy już na końcu strony
  window.innerHeight + window.scrollY >= document.body.scrollHeight;

const setAutoscrolling = () => {
  console.log("Setting autscroll")
  if(settings.autoscroll)
    clearInterval(settings.autoscroll);
  settings.autoscroll = setInterval(() => {
    window.scrollBy(0, 1);
    if (isEndOfPage()) toggleAutoscroll();
  }, settings.scrollTempo);
};

// it changes time of scrolling
// in what time it has to scroll x pixels
const scrollUp = () => {
  if (settings.scrollTempo <= 5) settings.scrollTempo = 5;
  else settings.scrollTempo -= 5;
  if (settings.autoscroll) setAutoscrolling();
  console.log("Autoscroll: " + settings.scrollTempo)
};

const scrollDown = () => {
  if (settings.scrollTempo > 60) settings.scrollTempo = 60;
  else settings.scrollTempo += 5;
  if (settings.autoscroll) setAutoscrolling();
  console.log("Autoscroll: "+ settings.scrollTempo)
};

const toggleAutoscroll = () => {
  console.log("toggle")
  if (settings.autoscroll || isEndOfPage()) {
    clearInterval(settings.autoscroll);
    elemAutoscroll.classList.remove("active");
    settings.autoscroll = null;
    return;
  } else {
    setAutoscrolling();
    elemAutoscroll.classList.add("active");
  }
};

function setMenuListeners() {
  try {
    document.getElementById("tr-up").onclick = transposeUp;
    document.getElementById("tr-down").onclick = transposeDown;
    document.getElementById("font-size-up").onclick = fontSizeUp;
    document.getElementById("font-size-down").onclick = fontSizeDown;
    document.getElementById("scroll-up").onclick = scrollUp;
    document.getElementById("scroll-down").onclick = scrollDown;

    elemAutoscroll = document.getElementById("autoscroll");
    elemAutoscroll.onclick = () => toggleAutoscroll();
  } catch (error) {}
}
