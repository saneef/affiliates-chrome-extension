/* jshint unused:false */
/* global escape */
'use strict';

var trackId = '', _key = 'tag';

function updateTrackId() {
  chrome.storage.sync.get('_trackIdAmazonIn', function(data) {
    console.log('Settings Loaded', data);

    if (!data._trackIdAmazonIn) {
      chrome.storage.sync.set({
        '_trackIdAmazonIn': 'saneef-21'
      });
    }

    trackId = data._trackIdAmazonIn;
  });
}

updateTrackId();

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

// returns the url with key-value pair added to the parameter string.
// if key already exists, the value will be replaced
function insertParam(url, key, value) {
  if (url.indexOf('?') !== -1) {
    var urlParts = url.split('?'), baseUrl, paramsPairs;

    baseUrl = urlParts[0];

    if (urlParts[1].indexOf('tag') === -1) {
      paramsPairs = urlParts[1] + '&' + escape(key) + '=' + escape(value);
    } else {
      var i, len, p;
      paramsPairs = urlParts[1].split('&');

      for (i = 0, len = paramsPairs.length; i < len; i++) {
        p = paramsPairs[i].split('=');

        if(p[0] === key) {
          p[1] = escape(value);
        }
        paramsPairs[i] = p.join('=');
      }

      paramsPairs = paramsPairs.join('&');
    }

    return baseUrl + '?' + paramsPairs;
  }
  else {
    return url + '?' + [key, value].join('=');
  }
}

// listen for new web page requests to the amazon.in site
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // only for the top-most window (ignore frames)
    if (window === top) {

      updateTrackId();

      // if the url does not already contain the tracking id
      if (details.url.search(trackId) === -1 &&
          details.url.search('gp/search-inside') === -1 &&
          details.url.search('gp/digital') === -1 &&
          details.url.search('uedata/unsticky') === -1 &&
          details.url.search('ap/widget') === -1) {
            // redirect them to the url with the new tracking id parameter inserted
        return { redirectUrl: insertParam(details.url, _key, trackId) };
      }
    }
  },
  { urls: ['http://www.amazon.in/*', 'https://www.amazon.in/*'] }, // only run for requests to the following urls
  ['blocking']    // blocking permission necessary in order to perform the redirect
  );
