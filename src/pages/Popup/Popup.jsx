import React, { useState } from 'react';
import './Popup.css';

const Popup = () => {

  const [ images, setImages ] = useState([]);
  const [ downloading, setDownloading ] = useState(false);
  const [progress, setProgress] = useState(0);

  const loadImages = () => {
    // get current tab data here.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "loadImages"}, function(response) {
          // console.log(response.images);
          setImages(response.images);
      });
    });
  }

  const getExtension = (url) => {
    var extension = url.split('.').pop();
    if (extension && extension.length <= 5) {
      return extension;
    } else {
      return 'jpg';
    }
  }

  const downloadImages = async () => {
    setDownloading(true);
    let i = 0;
    for (let i = 0; i < images.length; i++) {
      setProgress(100 / images.length * (i + 1));
      let item = images[i]
      try {
        let response = await fetch(item.url)
        let blob = await response.blob()
        const blobURL = URL.createObjectURL(blob);
        let downloadLink = document.createElement("a");

        let extension = getExtension(item.url)
        downloadLink.download = `${item.name}.${extension}`;
        downloadLink.href = blobURL;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
      } catch (e) {
        console.log('we got error', e)
      }
    }
    setDownloading(false);
    alert('Download complete!')

  }

  return (
    <div className="App">
      <h2 className="title">Baidu Image downloader</h2>
      <div className="buttons">
        <button onClick={loadImages}>Load Images</button>
        <button onClick={downloadImages} disabled={downloading || images.length === 0}>Download Images</button>
      </div>
      <div className="progress" style={{ width: `${progress}%` }}></div>
      <div className="images-list">
      { images && images.map((image, index) => {
        return <div key={index}>
          <span className='index-of-image'>{ index + 1 }</span>
          { image.name }
          </div>
      }) }
      </div>
    </div>
  );
};

export default Popup;
