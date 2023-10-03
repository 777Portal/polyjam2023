var div;
var priceForMultiplier = -1000;
var typeForMultiplier;
var children;
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  addPumpkinsMenu();
  div = document.getElementById("candy");
  children = Array.from(document.getElementById("candy").children);
  children.forEach((element) => {
    GetGameSave(element.id).then((result) => {
      document.getElementById(element.id).innerText += `\n ${result}`;
    })
  })
  GetGameSave("multiplier").then((value) => {
    multiButton = document.getElementById("multiplier")
    multiAlready = document.getElementById("multiplierLevel")
    value = parseInt(value)
    priceForMultiplier = -1000

    if(value == 1 || isNaN(value)){
      priceForMultiplier = priceForMultiplier*1
      typeForMultiplier = "candyCorn"
      multiButton.innerText = "upgrade multiplier \n Price: " + priceForMultiplier + " candy corn | Upgrade: 1 => 1.25"
      multiAlready.innerText = "1" 
    } else if (value == 2){
      typeForMultiplier = "candyCorn"
      priceForMultiplier = priceForMultiplier*2
      multiButton.innerText = "upgrade multiplier \n Price: $" + priceForMultiplier + " candy corn | Upgrade: 1.25 => 1.50"
      multiAlready.innerText = "1.25" 
    } else if (value == 0){
      multiButton.innerText = "Huh??? IDK?"
      multiAlready.innerText = "0" 
    } else {
      priceForMultiplier = 99999999999
      multiButton.innerText = "Max upgraded! Please wait for update!"
      multiAlready.innerText = "1.75"
    }
  })
  //fillCanvas();
});

//hack job but its due in like 9 hours and i have stuff to do tmrw
document.getElementById("multiplier").addEventListener("click", function() {
  GetGameSave("multiplier").then((value) => {
    let intValue = parseInt(value);
    if (isNaN(intValue)) {
      changeGameSave("multiplier", "1");
      return;
    }
    console.log("Cost is " + priceForMultiplier);
    GetGameSave(typeForMultiplier).then((value) => {
      let finalValue = parseInt(value) - parseInt(priceForMultiplier);
      if (finalValue >= 0) {
        changeGameSave(typeForMultiplier, finalValue);
        GetGameSave("multiplier").then((value) => {
          changeGameSave("multiplier", value+1);

          let oldTextValue = this.innerText;
          this.innerText = "Purchased upgrade from the shop!";
  
          setTimeout(() => {
            this.innerText = oldTextValue;
          }, 5000);          
        })
      } else {
        let oldTextValue = this.innerText;
        this.innerText = "You don't have enough " + typeForMultiplier;
        setTimeout(() => {
          this.innerText = oldTextValue;
        }, 5000);

      }
    });
  });
}, false);


document.getElementById("cornToPumpkin").addEventListener("click", function(){  
  shopTransaction("candyCorn", -1000, "candyPumpkin", 1).then((value) => {
    if(value !== "notEnoughCandy"){

      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Purchased item from shop!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);

    } else {

      console.log("Not enough candy");
      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Not enough candy to buy this!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);         
    }
  });
}, false);

document.getElementById("pumpkinToBar").addEventListener("click", function(){  
  shopTransaction("candyPumpkin", -100, "candyBar", 1).then((value) => {
    if(value !== "notEnoughCandy"){

      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Purchased item from shop!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);
      
    } else {

      console.log("Not enough candy");
      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Not enough candy to buy this!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);         
    }
  });
}, false);

document.getElementById("pumpkinToCorn").addEventListener("click", function(){  
  shopTransaction("candyPumpkin", -1, "candyCorn", 950).then((value) => {
    if(value !== "notEnoughCandy"){

      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Purchased item from shop!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);
      
    } else {

      console.log("Not enough candy");
      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Not enough candy to buy this!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);         
    }
  });
}, false);

document.getElementById("barToPumpkin").addEventListener("click", function(){  
  console.log("handled")
  shopTransaction("candyBar", -1, "candyPumpkin", 90).then((value) => {
    if(value !== "notEnoughCandy"){

      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Purchased item from shop!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);
      
    } else {

      console.log("Not enough candy");
      let oldTextValue = this.innerText;
      console.log(oldTextValue);
      this.innerText = "Not enough candy to buy this!";
      console.log(oldTextValue);
      setTimeout(() => {
        this.innerText = oldTextValue;
      }, 5000);         
    }
  });
}, false);

async function shopTransaction(key, change, secondKey, secondChange){
  let firstKeyAmount = parseInt(await GetGameSave(key))
  if (typeof firstKeyAmount === NaN){return "notEnoughCandy";}
  amountAfterTransaction = firstKeyAmount + change
  if (amountAfterTransaction < 0){
    console.log("Not enough candy")
    console.log(amountAfterTransaction)
    //newNotification("Not enough candy!");
    return "notEnoughCandy";
  } 
  if(isNaN(firstKeyAmount)) {
    console.error("Wtf? ignoring request")
    return "notEnoughCandy"; 
  }
  if(secondKey !== undefined || null){
    let secondKeyAmount = parseInt(await GetGameSave(secondKey))
    await changeGameSave(key, firstKeyAmount+change)
    await changeGameSave(secondKey, secondKeyAmount+secondChange)
    console.log("Done w/ transaction (2 keys) updating html element")
    
  } else if (isNaN(firstKeyAmount)) {
    console.error("Wtf? ignoring request")
    return "notEnoughCandy"; 
  } else {
    console.log(amountAfterTransaction, firstKeyAmount)
    await changeGameSave(key, firstKeyAmount+change)
    console.log("Done w/ transaction (1 key) updating html element")
    
  }
  updateAmount();
}

function updateAmount(){
  div = document.getElementById("candy");
  children = Array.from(document.getElementById("candy").children);
  children.forEach((element) => {
    GetGameSave(element.id).then((result) => {
      document.getElementById(element.id).innerText = `\n ${result}`;
    })
  })
}

// async function getAmountViaId(id){
//   value = await GetGameSave(id)
//   if(value === undefined || "undefined"){console.log("Was undefined, setting to 0.")}
//   document.getElementById(id).innerText += '\n'+value
//   console.log(id, " : " ,value)
//   console.log(value)
// }

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// var canvas = document.getElementById("gameCanv");
// var ctx = canvas.getContext("2d");

// function fillCanvas(){
//   ctx.canvas.width  = document.body.clientWidth - 40;
//   ctx.canvas.height = 400;
//   ctx.fillStyle = "blue";
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

// var date2 = new Date("04/20/69")
// fps = 0
// setInterval(function() {
  // date1 = new Datem(); // current date
  // var timeDiff = Math.abs(date2.getTime() - date1.getTime()); // in miliseconds
  // if (timeDiff >= 1000){
    // console.log(`1 second passed.\n final fps:${fps/1}`)
    // date2 = new Date();
    // fps = 0
  // } else { 
    // fps += 1
  // }
  // ctx.fillStyle = getRandomHexColor();
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "orange"
  // ctx.fillText(Math.round(fps/timeDiff*1000), 10, 400);
  // ctx.fillRect(0, 0, 10, 400-10);
  // console.log(timeDiff);
  // console.log("Updated")
// }, 10);


//Encrypted? idk maybe not it doesn't really matter.
