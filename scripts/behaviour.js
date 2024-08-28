const toggleActive = (e) => {
    console.log(e)
}

const menu = document.querySelector('menu');
document.querySelector('.menu-btn').onclick = () => menu.classList.add("active")
document.querySelector('#hide').onclick = () => menu.classList.remove("active")

setMenuListeners()