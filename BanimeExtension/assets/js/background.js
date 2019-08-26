var canBlock = false;

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        //callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}

function replacementImage(){
  var random = Math.floor((Math.random() * 5));
  url_list = ["https://steamuserimages-a.akamaihd.net/ugc/941715783849125672/FC3C6E47FC140A75160C22EB86BE67DEBAA3B45B/","https://i.redd.it/gsqw5ib2xib11.jpg","https://pics.me.me/thumb_put-god-first-and-youll-never-be-last-spiritualdigest-tumblr-44251311.png",
              "https://us.123rf.com/450wm/lisafx/lisafx1403/lisafx140300006/27015739-bossy-looking-middle-aged-woman-wagging-her-finger-in-disapproval-isolated-on-white-.jpg?ver=6","https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Cefal%C3%B9_Pantocrator_retouched.jpg/220px-Cefal%C3%B9_Pantocrator_retouched.jpg",
              "https://www.gannett-cdn.com/-mm-/1856fd589f6ad075cfb0e40b35da9e23fb3c619e/c=0-345-3280-4723/local/-/media/USATODAY/USATODAY/2014/04/27//1398610263007-AFP-529290635.jpg?width=534&height=712&fit=crop",
              "http://images7.memedroid.com/images/UPLOADED739/5bce6785209fa.jpeg"]
  return url_list[random];
}

chrome.runtime.onMessage.addListener(function(message, sender, senderResponse){

  if(message.msg === "image" & canBlock){
    // Usage
    getDataUri(message.url, async function(dataUri) {
        await fetch('http://192.168.0.13:5000/predict/', {
          method: 'POST',
          body: dataUri
        })
        .then(response => response.text())
        .then(data => {
          if(data == 'Anime'){
            senderResponse({response: replacementImage(), index: message.index});
          }
        })
        .catch(function(response){
          console.log('Could not fetch. Error: '+response);
        })
    });
    return true;
  }
  return true;
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  if(canBlock){
    chrome.browserAction.setIcon({path: "assets/images/icon16.png"});
  }
  else{
    chrome.browserAction.setIcon({path: "assets/images/icon16_disabled.png"});
  }
  canBlock = !canBlock;
  console.log('canBlock is: ' + canBlock);
});
