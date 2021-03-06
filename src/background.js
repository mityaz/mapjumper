// Global accessor that the popup uses.
var coordinates = {};
var selectedCoordinates = null;
var selectedId = null;

function updateCoordinates(tabId) {
    chrome.tabs.sendRequest(tabId, {}, function(coordinates_pair) {
        coordinates[tabId] = coordinates_pair;
        if (!coordinates_pair) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.pageAction.show(tabId);
            if (selectedId == tabId) {
                updateSelected(tabId);
            }
        }
    });
}

function updateSelected(tabId) {
    selectedCoordinates = coordinates[tabId];
    if (selectedCoordinates)
        chrome.pageAction.setTitle({tabId:tabId, title:selectedCoordinates});
}

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
    if (change.status == "complete") {
        updateCoordinates(tabId);
    }
});

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
    selectedId = tabId;
    updateSelected(tabId);
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    updateCoordinates(tabs[0].id);
});
