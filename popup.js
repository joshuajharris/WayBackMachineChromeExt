/*
*
* gotCurrentTabUrl() from google official chrome extension tutorial
*
*/
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

/*
*
* makes an xmlhttprequest to wayback archive passing the site current
* tab url and a date picked by the user
*
*/
function getWayBackRes(url, timestamp, callback) {
  var searchUrl = 'http://archive.org/wayback/available?url=' + encodeURIComponent(url) + '&timestamp=' + encodeURIComponent(timestamp);
  //can add a timestamp by appending '&timestamp=:timestamp' to search url
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', searchUrl, false);
  xmlHttp.send(null);
  callback(xmlHttp.responseText);
  
}
/*
*
* Updates the status div element on popup.html with
* statusText
*
*/
function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  var tabUrl;
  getCurrentTabUrl(function(url){
    tabUrl = url;
    renderStatus(url);
  });

  document.getElementById('datePicker').addEventListener('change', function(){
    var time = document.getElementById('datePicker').value;
    var time = time.toString().replace(/-/g,'');
    getWayBackRes(tabUrl, time, function(data){
      renderStatus(data);
    });
  });
});

