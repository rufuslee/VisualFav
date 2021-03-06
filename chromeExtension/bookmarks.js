var extensionID = "cghfecgpjjdediiljjckdjjfndlkoebh";
var holder = document.getElementById("bookmark-holder");
var searchBookmark = document.getElementById("search");
var bookmarks;

function dumpBookmarks(bookmarkTreeNodes, query) {
    holder.appendChild(dumpTreeNodes(bookmarkTreeNodes, query));
}
function dumpTreeNodes(bookmarkNodes, query) {
  var div = document.createElement('div');
  var i;
  div.setAttribute("class", "folder");
  for (i = 0; i < bookmarkNodes.length; i++) {
    div.appendChild(dumpNode(bookmarkNodes[i], query));
  }
  return div;
}
function dumpNode(bookmarkNode, query) {
  var node;
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).toLowerCase().indexOf(query.toLowerCase()) == -1) {
        return document.createElement('span');
      }
    }
    var content;
    if (bookmarkNode.url) {
      content = document.createElement('div');
      content.setAttribute("class", "bookmark");
      content.setAttribute("draggable", "true");
      content.setAttribute("ondragstart", "drag(event)")

      var anchor = document.createElement('a');
      anchor.setAttribute("class", "bookmarkurl");
	    anchor.setAttribute('href', bookmarkNode.url);
      anchor.innerHTML = bookmarkNode.title;

      var trashCan = document.createElement('a');
      trashCan.setAttribute("class", "trashcan hidden");
      trashCan.setAttribute("url", "#");

      content.appendChild(anchor);
      content.appendChild(trashCan);

      content.onmouseover = function () {
        var that = this;
        var trashcan = that.getElementsByClassName("trashcan");
        trashcan[0].className = "trashcan";
      }
      content.onmouseleave = function () {
        var that = this;
        var trashcan = that.getElementsByClassName("trashcan");
        trashcan[0].className = "trashcan hidden";
      }
      trashCan.onmouseover = function () {
        var that = this;
      }
      trashCan.onclick = function () {
        var that = this;
        chrome.runtime.sendMessage(extensionID, {method: "remove", id: bookmarkNode.id}, {}, function (res) {
          content.parentNode.removeChild(content);
        });
      }
	  } else {
      content = document.createElement('div');
      content.setAttribute("class", "folder");

      var paragraph = document.createElement('p');
      paragraph.innerHTML = bookmarkNode.title;
      content.appendChild(paragraph);
    }
    //anchor.setAttribute('text', bookmarkNode.title);
    node = document.createElement('div').appendChild(content);
  } else {
    node = document.createElement('div');
  }
  
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    node.appendChild(dumpTreeNodes(bookmarkNode.children, query));
  }
  return node;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse){
	console.log(message);
	console.log(sender);
	bookmarks = message;
  dumpBookmarks(message);

});

chrome.runtime.sendMessage(extensionID, {method: "get"}, {}, function (res) {
  console.log(res);
});

searchBookmark.oninput = function () {
  console.log(this.value);
  holder.innerHTML = "";
  dumpBookmarks(bookmarks, this.value);
};
