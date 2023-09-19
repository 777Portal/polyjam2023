function hideShowElement(menu){
    var x = document.getElementById(menu);
    if (!x.style.display || x.style.display == "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

document.getElementById("githubIcon").addEventListener("click", openGithub);
function openGithub(){
  console.log('clicked on the github icon');
  window.open("https://github.com/777Portal/")
}