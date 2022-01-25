import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === 'loadImages') {
    let images = Array.from(document.querySelectorAll('.imgpage .imglist li'));
    let rlt = [];
    if (images) {
      images.map((img) => {
        let name = img.querySelector('a.imgitem-title')
          ? img.querySelector('a.imgitem-title').innerText
          : '';
        let url = img.querySelector('img.main_img')
          ? img.querySelector('img.main_img').src
          : '';
        // let url = img.querySelector('a.down')
        //   ? img.querySelector('a.down').href
        //   : '';
        if (name && url) {
          rlt.push({
            name,
            url,
          });
        }
        return null;
      });
    }
    console.log(images);
    sendResponse({ images: rlt });
  }
});
