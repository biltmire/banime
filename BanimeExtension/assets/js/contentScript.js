const toDataURL = url => fetch(url)
.then(response => response.blob())
.then(blob => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => resolve(reader.result)
  reader.onerror = reject
  reader.readAsDataURL(blob)
}))

let images = document.getElementsByTagName('img');
for(let i = 0; i < images.length; i++){
  /*First half sends the object {msg: 'image', index i} to background process */
  /*Second half takes the returned data and index and sets the image given by index in
  the images list to the link specified by data.link*/
  //console.log(images[i].src)
  /*
  toDataURL(images[i].src).then(function(value){
    console.log(value);
  });*/
  chrome.runtime.sendMessage({msg: 'image', index: i, url: images[i].src}, function({response, index}){
    images[index].src = response
  });
}
