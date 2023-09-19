// :P
function hideShowElement(menu){
    console.log("toggling element "+menu)
    var x = document.getElementById(menu);
    if (!x.style.display || x.style.display == "none") {
        x.style.display = "block";
        console.log("Display type set to block");
    } else {
        x.style.display = "none";
        console.log("[Display type set to none")
    }
}
document.getElementById("settingsIcon").addEventListener("click", function(){
    hideShowElement("settings");
    //hideShowElement("welcomeScreen"); fix dis later, doesn't trigger and hides both once you close the settings.
    console.log("clicked on settings")
}, false);

document.getElementById("githubIcon").addEventListener("click", function(){
    console.log('clicked on the github icon');
    window.open("https://github.com/777Portal/")
}, false);