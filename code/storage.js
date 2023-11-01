console.log("loaded storage!")
const regex = /(.+)\;(.+)/;

async function checkIfNewUser() {
  try {
    var gamesave = await getStorage('gamesave');
    if (gamesave === undefined || gamesave === null) {
      // It's a new user, create a new gamesave
      await setStorage("gamesave", "time;0|candyCorn;0|candyBar;0|candyPumpkin;0|madeBy;exonAuto|" + new Date())
      console.log('New user detected. Created a new gamesave for them.');
    } else {
      console.log('Existing user detected. Gamesave found:', gamesave);
    }
  } catch (error) {
    console.error('Error checking if new user:', error);
    await setStorage("gamesave", "timeSpentOpen;0|candyCorn;0|candyBar;0|candyPumpkin;0|madeBy;exonAuto|" + new Date())
  }
}
checkIfNewUser();

function checkIfFocused() {
  if (document.hidden) {
      // User is inside the extension menu, stop the timer and random candy giving
      clearInterval(timeInterval);
      clearInterval(trickOrTreatInterval);
  } else {
      timeInterval = setInterval(getTime, 1000);
      trickOrTreatInterval = setInterval(getTrickOrTreat, 60000);
  }
}

document.addEventListener('visibilitychange', checkIfFocused);
checkIfFocused();

async function setStorage(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });
    //console.log(`Stored key "${key}" with value:`, value);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

async function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (typeof result[key] !== 'undefined' && result[key] !== null) {
        resolve(result[key]);
      } else {
        reject(`Key '${key}' is undefined or null (skill issue)`);
      }
    });
  });
}

async function changeGameSave(keyValue, newValue) {
  try {
    var value = await getStorage('gamesave');
    var dataSplit = value.split('|'); // pumpkins | candy, ect
    let finalValue = '';
    let keyExists = false;

    dataSplit.forEach((element, index) => {
      let match = element.match(regex);
      if (match && match[1] === keyValue) {
        finalValue += `${keyValue};${newValue}|`;
        keyExists = true;
      } else {
        finalValue += element + '|';
      }
    });
    
    if (!keyExists) {
      finalValue += `${keyValue};${newValue}|`;
    }

    finalValue = finalValue.slice(0, -1); // removes the final |

    await setStorage('gamesave', finalValue);
    //console.log('Game save updated successfully.');
  } catch (error) {
    if (error !== "Key 'gamesave' is undefined or null (skill issue)") {
      console.error('Error updating game save:', error);
    } else {
      setStorage("gamesave", "time;0|candyCorn;0|candyBar;0|candyPumpkin;0|madeBy;exonAuto"+Date.now())
      console.warn('[get storage], ' + error + '. Assuming it\'s empty and creating a new game file');
    }
    throw error;
  }
}

async function GetGameSave(keyValue) {
    try {
        var value = await getStorage('gamesave');
        var retrievedValue;
        var dataSplit = value.split('|');

        dataSplit.forEach((element) => {
            // console.log(element);
            match = element.match(regex);
            if (match && match[1] === keyValue) {
                //console.log('Found value: ' + match[2]);
                retrievedValue = match[2];
            } else {
                //some unknown value that isn't needed
            }
        });

        return retrievedValue;
        
    } catch (error) {
        if (error !== "Key 'gamesave' is undefined or null (skill issue)") {
            console.warn('[get storage], ' + error + '. Assuming it\'s empty, and another level will take care of it.');
        } else {
            console.error(error);
        }
        throw error;
    }
}

async function getTime(){
    if(document.hidden){
      return;
    }

    try {
      var retrievedValue = await GetGameSave('timeSpentOpen');
      oldTime = parseInt(retrievedValue)
        if (oldTime === NaN || retrievedValue == "NaN"){
          await changeGameSave("timeSpentOpen", "0");
          return;
        } else {
          await changeGameSave("timeSpentOpen", oldTime+1);
        }
      } catch (error){
        console.log(error)
      }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getTrickOrTreat(){
  // 1 candy corn (1000 CC = 1 PC), 
  // 2 mini pumpkin candy (100 PC = 1 CB),
  // 3 candy bar.

  let trickOrTreat = getRandomInt(0,150)
  //console.log(trickOrTreat)
  if(trickOrTreat <= 10){newNotification("Get tricked\!\n no candy for you\!"); return;}
  
  let typeOfCandy = getRandomInt(-1000, 1000);
  if (typeOfCandy == 1000 || typeOfCandy == -1000){
    CandyDistro(`candyBar`, getRandomInt(0, 1))
    return;
  } else if (typeOfCandy >= 850){
    CandyDistro('candyCorn',getRandomInt(20, 40));
    setTimeout(() => {
      CandyDistro('candyPumpkin', getRandomInt(0, 3)) // i know, hack job, but its late man
    }, 500)
    return;
  } else if (typeOfCandy >= 0){
    CandyDistro('candyCorn', getRandomInt(15, 35))
    return;
  } else if (typeOfCandy >= -1000){
    CandyDistro('candyCorn', getRandomInt(0, 15))
    return;
  }
};


async function CandyDistro(key, howMany){
  candyType = key.replace("candy", "")
  if (howMany == 0){
    newNotification(`You were supposed to get more ${candyType} candy\n but you have terrible rng! \n No extra candy gained!`)
    return;
  }
  let multi = parseInt(await GetGameSave("multiplier"))
  if (isNaN(multi)){
    multi = 1
  }

  oldAmount = await GetGameSave(key);
  if (oldAmount === undefined || oldAmount == "undefined"){
    await changeGameSave(key, howMany);
    return;
  }

  newAmount = parseInt(howMany)
  oldAmount = parseInt(oldAmount)
  const final = Math.round(oldAmount+(newAmount*multi));
  await changeGameSave(key, final);
  if(multi == 1){
    newNotification(`Candy obtained! \n ${candyType} candy ++ ${howMany} (${oldAmount+(newAmount*multi)})`)
    return
  }
  
  newNotification(`Candy obtained! \n ${candyType} candy ++ ${howMany} (${oldAmount+(newAmount*multi)}) \n You got ${final-(newAmount+oldAmount)} extra from your multiplier!`)
}

//last resort
function clear(){
  console.log("")
  chrome.storage.sync.clear()
}