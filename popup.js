function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];

    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

}

function getWayBackRes(tabUrl, callback) {
  var searchUrl = 'http://archive.org/wayback/available?url=' + encodeURIComponent(tabUrl);
  //can add a timestamp by appending '&timestamp=:timestamp' to search url
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', searchUrl, false);
  xmlHttp.send(null);
  callback(xmlHttp.responseText);
  
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Performing WayBack Archive Search' + url);
    getWayBackRes(url, function(data) {
      renderStatus(data)
    });
  });
});
