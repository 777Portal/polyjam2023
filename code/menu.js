// :P
function hideShowElement(menu){
    console.log("toggling element "+menu)
    var x = document.getElementById(menu);
    if (!x.style.display || x.style.display == "none") {
        x.style.display = "block";
        console.log("[Display] type set to block");
    } else {
        x.style.display = "none";
        console.log("[Display] type set to none")
    }
}

function addPumpkinsMenu(){
    console.log("Adding more pumkins to menu...")
    width = document.body.clientWidth
    final = Math.round((width-40)/25)-1 // Math.round(divided - 1)
    console.log(final) 
    for (let i = 0; i < final; i++) {
        console.log(i)
        rotateNum = getRandomNumber(0, 180)
        var img = document.createElement("img");
            img.id = `pumpkin${i}` //will start at 0 because js so parse it properly as that (if needed)
            img.width = 25
            img.height = 25
            img.src = `assets/pumpkin.png`
            //img.style.position = "absolute"
            img.style.transform = `rotate(${rotateNum}deg)`
        document.getElementById("pumpkin").appendChild(img)
    }
}

//addPumpkinsMenu()

// document.getElementById("settingsIcon").addEventListener("click", function(){
//     hideShowElement("settings");
//     console.log("clicked on settings")
// }, false);

document.getElementById("githubIcon").addEventListener("click", function(){
    console.log('clicked on the github icon');
    window.open("https://github.com/777Portal/")
}, false);
