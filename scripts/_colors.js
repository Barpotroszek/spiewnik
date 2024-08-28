const displayPopup = () =>{
    const bg = prompt("Jaki dać kolor tła");
    const link_1 = prompt("Jaki dać 1. kolor tych linków");
    const link_2 = prompt("Jaki dać 2. kolor tych linków");

    console.log("BG:", bg, "\nlink_1:", link_1, "\nlink_2:", link_2)
    if(bg !== "")
    document.body.style.setProperty("--bg-color", bg)
    if(link_1 !== "")
        document.body.style.setProperty("--link-color", link_1)
    if(link2 !== "")
        document.body.style.setProperty("--second-link-color", link_2)
}