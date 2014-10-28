// Saves options to chrome.storage
function save_options() {
  var mapProviders = document.getElementsByTagName("input");
  var checked = [];
  for (var i = 0; i < mapProviders.length; i++) {
    if (mapProviders[i].type == "checkbox" && mapProviders[i].checked) {
        checked.push(mapProviders[i]);
    }
  }
  chrome.storage.sync.set({
    mapProviders: mapProviders
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    mapProviders: []
  }, function(items) {
    mapProviders = document.getElementsByTagName("input");
    for (var i = 0; i < mapProviders.length; i++) {
      if (mapProviders[i].type == "checkbox") {

      }
    }
    document.getElementById('provider').checked = items.mapProviders;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
