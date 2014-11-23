// Saves options to chrome.storage
function save_options() {
  var mapProviders = document.getElementsByTagName("input");
  var checkedValues = [];
  for (var i = 0; i < mapProviders.length; i++) {
    if (mapProviders[i].type == "checkbox" && mapProviders[i].checked) {
        checkedValues.push(mapProviders[i].value);
    }
  }
  chrome.storage.sync.set({
    mapProviders: checkedValues
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved!';
    setTimeout(function() {
      status.textContent = '';
    }, 1750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(
    'mapProviders', function(settings) {
      var mapProviders = document.getElementsByTagName("input");
      for (var i = 0; i < settings.mapProviders.length; i++) {
        for (var j = 0; j < mapProviders.length; j++) {
          debugger;
          if (mapProviders[j].type == "checkbox" &&
              mapProviders[j].value == settings.mapProviders[i]) {
                mapProviders[j].checked = true;
                break;
          }
        }
      }
    }
  );
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
