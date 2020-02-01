// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { ipcRenderer } = require('electron');

ipcRenderer.on('message-from-worker', (event, arg) => {
  console.log('y', event, arg)
  let payload = arg.payload;
  console.log('My param:x', payload.myParam);
  console.log('Another param:', payload.anotherParam);
});

window.appRootDir = require('app-root-dir').get();
window.spawn = require( 'child_process' ).spawn;

window.fs = require('fs');