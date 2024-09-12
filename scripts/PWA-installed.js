const bc = new BroadcastChannel("fancy-channel")

bc.onmessage = e=>{
    if(e.data === "downloading-done")
        alert("Dane zostały pobrane :>")
    else
    console.log(e);
}

console.log("Window-channel:", bc)

function downloadAll(){
        bc.postMessage("download-all")
        alert("Pobieranie...")
}