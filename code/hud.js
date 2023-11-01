
function getRandomHexColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function checkVersion(){
    const response = await fetch("https://version.socooirafa12345.workers.dev/");
    const version = await response.json();
    console.log(version);
}

document.addEventListener("visibilitychange", async () => {
    checkVersion();
});

// async function getPumpkins() {
    //     console.log("got pumpkins?");
    //     pumpkins = Math.floor(Math.random() * 10); // max is 10, least is 0
    //     try {
        //         var retrievedValue = await GetGameSave('pumpkins');
        //         newAmountOfPumpkins = parseInt(retrievedValue) + pumpkins;
        //         console.log(`Got more pumpkins! ${retrievedValue} => ${newAmountOfPumpkins}`);
        //         await changeGameSave("pumpkins", newAmountOfPumpkins); // Pass the updated value, not a string
        //         newNotification(`New pumpkins! \n ${retrievedValue} => ${newAmountOfPumpkins}) (+${newAmountOfPumpkins})`);
        //     } catch (error) {
//         console.error(error);
//     }
// }
//getPumpkins();

            
window.onload = function () {
    var div = document.createElement('div');
    div.id = "notificationHolder";
    div.className = "notifications";
    //div.innerText = "ExonAuto"; semi annoying so no more watermark
    document.body.appendChild(div);
    console.log("done with div");
};

function newNotification(text) {
    var id = `notif${getRandomHexColor()}`;
    var div = document.getElementById("notificationHolder");

    var bar = document.createElement("div");
    bar.id = id;
    bar.className = "bar";

    var h3 = document.createElement("h3");
    h3.innerText = text;

    var p = document.createElement("p");
    p.id = id + "timer";
    p.innerText = "guh!";
    p.className = "valign";

    bar.appendChild(h3);
    bar.appendChild(p);
    div.prepend(bar);

    bar.addEventListener("click", function () {
        clearInterval(this.timer);
        this.remove();
    });

    var date2 = new Date();
    bar.timer = setInterval(function () {
        var date1 = new Date(); 
        var timeDiff = Math.abs(date2.getTime() - date1.getTime()); // in milliseconds

        if (timeDiff >= 15000) {
            clearInterval(bar.timer); 
            document.getElementById(id).remove();
        }

        var timeLeft = (15000 - timeDiff) / 1000;

        try {
            var timerElem = document.getElementById(id + "timer");
            timerElem.innerText = Math.round(timeLeft * 100) / 100; // rounded to the first decimal
        } catch (e) {
            //newNotification(text)
            // 99% of the tiem due to dom being not loaded so we can j ingore it :) if not it'll fix itself
        }
    }, 100);
}