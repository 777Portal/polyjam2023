var priceForMultiplier = -1000;
var typeForMultiplier;
var children;
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  addPumpkinsMenu();
  children = Array.from(document.getElementById("candy").children);
  children.forEach((element) => {
    GetGameSave(element.id).then((result) => {
      document.getElementById(element.id).innerText += `\n ${result}`;
    })
  })
  addAllMultipliers();
});

//hack job but its due in like 9 hours and i have stuff to do tmrw

const upgrades = {
	"multiplier": [
		{"basecost":"1000",  "costType": "candyCorn" , "multiplier":3}
	],
	"lowerTime": [
		{"basecost":"10000", "costType": "candyCorn", "multiplier":2}
	],
}


async function addAllMultipliers(){  
  for (var key in upgrades) {
    let upgradeLvl = parseInt(await GetGameSave(`${key}Level`))

    upgrades[key].forEach(upgrade => {
      const { basecost, costType, multiplier } = upgrade;  // declaring the valeus (duhhhh)
      let actualCost;      
      
      let parentDiv = document.getElementById("upgrade")

      if (typeof(upgradeLvl) !== Number){upgradeLvl = 1}

      if (upgradeLvl === 1){actualCost = basecost} else {
        actualCost = parseInt(basecost) * (parseInt(multiplier) * parseInt(upgradeLvl))
      }
    
      let newDivParent = document.createElement("div");
        newDivParent.id = key;
        newDivParent.className = "parent";

      let levelOfUpgrade = document.createElement("div");
        levelOfUpgrade.id = `${key}Level`
        levelOfUpgrade.className = "box"
        levelOfUpgrade.innerText =  `${key} level:\n `

      let levelText = document.createElement("p");
        levelText.className = "center"
        levelText.innerText = upgradeLvl

      let button = document.createElement("button")
        button.id = `${key}button`;
        button.className = "circle";
        button.innerText = `Purchase ${key}\n${actualCost} ${costType}`
        
      levelOfUpgrade.appendChild(levelText)
      newDivParent.appendChild(levelOfUpgrade)
      newDivParent.appendChild(button)
      parentDiv.append(newDivParent)
        
      // handels shop transaction.
      document.getElementById(`${key}button`).addEventListener("click", async function(){
        let oldText;
        oldText = this.innerText
        this.disabled = true;

        if (upgradeLvl === 1){actualCost = basecost} else {
          actualCost = parseInt(basecost) * (parseInt(multiplier) * parseInt(upgradeLvl))
        }

        let currentBal = parseInt(await GetGameSave(costType))
        let endingCost = currentBal - actualCost

        if(endingCost >= 0){
          this.innerText = `Purchased ${key}!`
        } else {
          this.innerText = `Not enough ${costType}\n (need ${endingCost * -1} more)`
        }
        setTimeout(() => {
          this.disabled = false
          this.innerText = oldText;
        }, 4500);
      }, false)

      console.log(`${key} | Base Cost: ${basecost}, Multiplier: ${multiplier}`);

    });
    
}}

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
  children = Array.from(document.getElementById("candy").children);
  children.forEach((element) => {
    GetGameSave(element.id).then((result) => {
      document.getElementById(element.id).innerText = `\n ${result}`;
    })
  })
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}