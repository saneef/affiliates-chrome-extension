'use strict';

function clickHandler() {
  chrome.storage.sync.set({
    '_trackIdAmazonIn': document.getElementById('_trackIdAmazonIn').value
  });


  // Update status to let user know options were saved.
  document.querySelector('button').innerHTML = 'Saved.';

  // Close tab/popup
  setTimeout(
    function() {
        window.close();
      }, 750);
}

function restoreOptions() {
  chrome.storage.sync.get('_trackIdAmazonIn', function(data) {
    if (data._trackIdAmazonIn) {
      document.getElementById('_trackIdAmazonIn').value = data._trackIdAmazonIn;
    }
  });

}

// Add listeners after the DOM has loaded
document.addEventListener('DOMContentLoaded',
  function() {
    // listen for clicks on the Save button
    document.querySelector('button').addEventListener('click', clickHandler);

    // Run restore options to load saved values.
    restoreOptions();
  }
);