
let joinBtn = document.getElementById("join") as HTMLButtonElement;
let createBtn = document.getElementById("create") as HTMLButtonElement;
let url = window.location.origin;

async function rooms() {
    let full = url + "/rooms";
    let res = await fetch(full);
    let txt = await res.text();
    console.log(txt);
}

async function create() {
    let full = url + "/create";
    let res = await fetch(full);
    let txt = await res.text();
    console.log(txt);
}

joinBtn.addEventListener("click", rooms);
createBtn.addEventListener("click", create);
