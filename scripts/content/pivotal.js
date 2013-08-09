/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
"use strict";

(function () {

  function showNotice(text) {
    var notice = createTag('div', 'message notice alert');
    notice.appendChild(document.createTextNode(text));
    $('.status').appendChild(notice);
    window.setTimeout(function () {
      notice.parentNode.removeChild(notice);
    }, 2500);
  }

  function addButtonListener(e) {
    var elem = e.relatedNode, cont, btn, link;
    if (elem.classList && (elem.classList.contains("story") || elem.classList.contains("model_details"))) {
      cont = $(".edit aside", elem);

      if ($('.toggl-button', cont)) {
        btn = $('.toggl-button', cont);
        btn.parentNode.removeChild(btn);
      }

      link = createLink('toggl-button pivotal');
      link.addEventListener("click", function (e) {
        showEntryDialog($("textarea", elem).value);
      });
      cont.appendChild(link);
    }
  }

  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      // Load dialog
      createEntryDialog(response.user);
      document.addEventListener('DOMNodeInserted', addButtonListener);
    }
  });

}());
