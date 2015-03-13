var bkg = chrome.extension.getBackgroundPage();

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
  // sanitize url, remove query info
  url = url.substr(0, url.indexOf('?'));

  // bkg.getBackgroundPage().console.log(url);
  
  // append tab url to the wayback api
  var searchUrl = 'http://archive.org/wayback/available?url=' + url + '&timestamp=' + timestamp;
  // can add a timestamp by appending '&timestamp=:timestamp' to search url
  
  var xmlHttp = new XMLHttpRequest();   // create xmlHttpRequest object
  xmlHttp.open('GET', searchUrl, false);// set POST/GET, url, and async
  xmlHttp.send(null);

  // bkg.console.log(JSON.parse(xmlHttp.responseText));
  callback(JSON.parse(xmlHttp.responseText));   // return JSON object from wayback api
  
}
/*
*
* Updates the status div element on popup.html with
* statusText
*
*/
function renderWayBackLink(link) {
  //document.getElementById('status').textContent = statusText;
  var content = '<a id="wbLink" href="' + link + '">' + 'link</a>'; // popup a tag link
  document.getElementById('wayBackLink').innerHTML = content; // put link on popup
  
  // give link a listener to open link in new tab on click
  document.getElementById('wbLink').addEventListener('click', function(){
    chrome.tabs.create({ url: link });
  }, false);


}

function renderStatus(statusText) {
  document.getElementById('status').innerText = statusText;
}
//on tab load summon satan
document.addEventListener('DOMContentLoaded', function() {
  var tabUrl;       // duh
  var wayBackRes;   // JSON response from the wayback api
 
  //return the url of the active tab 
  getCurrentTabUrl(function(url){
    tabUrl = url;
    renderStatus(tabUrl);   // outputs a message to the user in popup
  });

  //when the user chooses a date...
  document.getElementById('datePicker').addEventListener('change', function(){
    var time = document.getElementById('datePicker').value;   // simply get value from date input element
    var time = time.toString().replace(/-/g,'');    // remove hyphons from time string
    
    // gets the wayback object from wayback api
    getWayBackRes(tabUrl, time, function(res) {
      wayBackRes = res;
      renderWayBackLink(res.archived_snapshots.closest.url);  // put link in popup 
      //bkg.console.log(res.archived_snapshots); 
    });
  });

});

