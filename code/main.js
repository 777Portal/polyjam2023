//add function for saving, changing, and reseting a username.
function setStorage(keySent, value){
    key = keySent //idk why but it doesn't seem to want to accept the value directly from the function.
    chrome.storage.local.set({key: value}, () => {
      console.log('Stored name: ' + value.name);
    });
}
function getStorage(key){ //turn this into a save file parser
    chrome.storage.local.get([key], (result) => {
      console.log('Retrieved name: ' + result.myKey.name);
    });
}
//Encrypted? idk maybe not it doesn't really matter.
