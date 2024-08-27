const settings = {
  fontSize: 1.1,
  autoscroll: false,
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};

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
  setFontSize(settings.fontSize)
};

const slide_toggle = document.querySelector("#autoscroll.slide-toggle");

const isEndOfPage = ()=>
// Sprawdza czy jesteśmy już na końcu strony
  window.innerHeight + window.scrollY >= document.body.scrollHeight

const toggleAutoscroll = (e) => {
  if (settings.autoscroll || isEndOfPage() ) {
    clearInterval(settings.autoscroll);
  e.classList.remove("active");
    settings.autoscroll = null;
    return
  } else {
    settings.autoscroll = setInterval(() => {
      window.scrollBy(0, 1);
      if (isEndOfPage()) 
        toggleAutoscroll(e)
    }, 65);
    e.classList.add("active");
  }
};

function setMenuListeners() {
  try {
    document.getElementById("tr-up").onclick = transposeUp;
    document.getElementById("tr-down").onclick = transposeDown;
    document.getElementById("font-size-up").onclick = fontSizeUp;
    document.getElementById("font-size-down").onclick = fontSizeDown;
    const autoscroll = document.getElementById("autoscroll");
    autoscroll.onclick = () => toggleAutoscroll(autoscroll);
  } catch (error) {}
}
