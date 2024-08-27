const dark_mode = document.getElementById("dark-mode"),
 toggle=document.querySelector("#theme-toggle > .slide-toggle");


function switchTheme() {
  if(dark_mode.checked){
    document.body.classList.add('dark-theme')
    toggle.classList.add('active')
  }
  else{
    toggle.classList.remove('active')
    document.body.classList.remove('dark-theme')
}}

dark_mode.onchange = () => switchTheme();
dark_mode.checked = window.matchMedia("(prefers-color-scheme: dark)").matches
switchTheme()
// console.log(window.matchMedia("(prefers-color-scheme: dark)"))