/*jslint indent: 2 */
/*global document: false */
"use strict";

function $(s, elem) {
  elem = elem || document;
  return elem.querySelector(s);
}

function createTag(name, className) {
  var tag = document.createElement(name);
  tag.className = className;
  return tag;
}

function createLink(className) {
  var link = createTag('a', className);
  link.href = '#';
  link.appendChild(document.createTextNode('Start timer'));
  return link;
}

function createEntryDialog(user){
  var iframe, iframeContainer, overlay;

  overlay = createTag('div', 'toggl-overlay');
  iframeContainer = createTag('div', 'toggl-iframe-container');
  iframe = document.createElement("iframe");
  iframe.id = "toggl_iframe";
  iframe.src = chrome.extension.getURL("toggl-dialog.html");

  overlay.addEventListener("click", function(e){
    closeEntryDialog();
  });

  iframeContainer.appendChild(iframe);
  document.body.appendChild(iframeContainer);
  document.body.appendChild(overlay);
}

function showEntryDialog(description){
  var overlay = $(".toggl-overlay"),
      frameContainer = $(".toggl-iframe-container"),
      iframe = $("#toggl_iframe");
  
  overlay.style.display = 'block';
  frameContainer.style.display = 'block';

  iframe.contentWindow.postMessage({command: "setDescription", description: description}, "*");
}

function closeEntryDialog(){  
  var overlay = $(".toggl-overlay"),
      frameContainer = $(".toggl-iframe-container");
  
  overlay.style.display = 'none';
  frameContainer.style.display = 'none';
}


(function () {
  window.addEventListener("message", function(event) {
    if (event.data.command == "closeToggl"){
      closeEntryDialog();
    }else if (event.data.command == "submitEntry"){
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: event.data.description
      });
      // showNotice('Toggl timer started');
      closeEntryDialog();
    }
  });

}());