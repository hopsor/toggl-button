/*jslint indent: 2 */
/*global window: false, XMLHttpRequest: false, chrome: false, btoa: false */
"use strict";

var TogglButton = {
  $user: null,
  $apiUrl: "https://www.toggl.com/api",

  checkUrl: function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      if (/toggl\.com\/track/.test(tab.url)) {
        TogglButton.fetchUser();
      }
    }
  },

  fetchUser: function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", TogglButton.$apiUrl + "/v7/me.json?with_related_data=true", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var resp = JSON.parse(xhr.responseText);
        TogglButton.$user = resp.data;
      }
    };
    xhr.send();
  },

  createTimeEntry: function (timeEntry) {
    var start = new Date(),
      xhr = new XMLHttpRequest(),
      timeEntry = {
          start: start.toISOString(),
          created_with: "Toggl Button",
          description: timeEntry.description,
          duration: -(start.getTime() / 1000)
        },
      entry = {};

    if (TogglButton.$user.default_pid == 'default' || TogglButton.$user.default_pid == undefined){
      timeEntry.wid = TogglButton.$user.default_wid;
    }else{
      timeEntry.pid = TogglButton.$user.default_pid;
    }

    entry.time_entry = timeEntry;

    xhr.open("POST", TogglButton.$apiUrl + "/v8/time_entries", true);
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(TogglButton.$user.api_token + ':api_token'));
    xhr.send(JSON.stringify(entry));
  },

  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'activate') {
      if (TogglButton.$user !== null) {
        chrome.pageAction.show(sender.tab.id);
      }
      sendResponse({success: TogglButton.$user !== null});
    } else if (request.type === 'timeEntry') {
      TogglButton.createTimeEntry(request);
    } else if (request.type === 'getOptions'){
      sendResponse({workspaces: TogglButton.$user.workspaces, projects: TogglButton.$user.projects});
    } else if (request.type === 'setProjectId'){
      TogglButton.$user.default_pid = request.pid;
    }
  }

};

TogglButton.fetchUser();
chrome.tabs.onUpdated.addListener(TogglButton.checkUrl);
chrome.extension.onMessage.addListener(TogglButton.newMessage);
