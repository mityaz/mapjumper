// The background page is asking us to find an address on the page.
if (window == top) {
    chrome.extension.onRequest.addListener(
        function(request, sender, sendResponse) {
        sendResponse(findCoordinates());
    });
}

// Search latitude and longitude in meta
// Return null if none is found.
var findCoordinates= function() {
    var node = document.head;
    var lat = null;
    var lon = null;
    var zoom = null;
    var zoom_default = 16;
    var hostname = window.location.hostname;
    if (hostname.match(/maps.google/))
        hostname = 'maps.google.com';
    if (hostname.match(/www.google/))
        hostname = 'www.google.com';
    if (hostname.match(/openstreetmap.org/))
        hostname = 'openstreetmap.org';
    if (hostname.match(/foursquare/))
        hostname = 'foursquare';
    if (hostname.match(/wikimapia/))
        hostname = 'wikimapia';
    if (hostname.match(/www.bing.com/))
        hostname = 'bing';
    switch(hostname){
        case "foursquare":
            console.log("foursquare");
            for (var i = 0; i < node.childNodes.length; ++i) {
                var child = node.childNodes[i];
                if(child.nodeName){
                    if (child.nodeName == 'META') {
                        if(child.getAttribute('property') == "playfoursquare:location:latitude") lat = child.getAttribute('content');
                        if(child.getAttribute('property') == "playfoursquare:location:longitude") lon = child.getAttribute('content');
                    }
                }
            }
            break;
        case "maps.google.com":
            console.log("maps.google.com");
            var gmap_link = document.getElementById("link");
            gmap_link = gmap_link.getAttribute('href');
            latlon = gmap_link.match(/[^s]ll=([\d.-]+),([\d.-]+)/);
            if (!latlon)
                break;
            lat = parseFloat(latlon[1]);
            lon = parseFloat(latlon[2]);
            zoom = parseInt(gmap_link.match(/z=(\d*)/)[1], 10);
            break;
        case "www.google.com":
            console.log("www.google.com");
            var pathname = window.location.pathname;
            if (pathname){
                latlonz = pathname.match(/@([\d.-]+),([\d.-]+),([\d]+)z/);
                lat = parseFloat(latlonz[1]);
                lon = parseFloat(latlonz[2]);
                zoom = parseFloat(latlonz[3]);
            }
            break;
        case "openstreetmap.org":
            var hash = window.location.hash;
            if(hash){
                zlatlon = hash.match(/map=([\d]+)\/([\d.-]+)\/([\d.-]+)/);
                if (!zlatlon) break;
                zoom = parseFloat(zlatlon[1]);
                lat = parseFloat(zlatlon[2]);
                lon = parseFloat(zlatlon[3]);
            }
            break;
        case "bing":
            console.log("bing");
            var link = document.getElementById("MapControl_MapControl");
            link = link.getAttribute('value');
            latlon = link.match(/'C':{'Latitude':([\d.-]+),'Longitude':([\d.-]+)/);
            if (!latlon)
                break;
            lat = parseFloat(latlon[1]);
            lon = parseFloat(latlon[2]);
            zoom = parseInt(link.match(/'Z':(\d*)/)[1], 10);
            break;
        case "wikimapia":
            console.log("wikimapia");
            var hash = window.location.hash;
            if(hash){
                console.log(hash);
                latlonz = hash.match(/lat=([\d.-]+)&lon=([\d.-]+)&z=([\d]+)/);
                if (!latlonz) break;
                lat = parseFloat(latlonz[1]);
                lon = parseFloat(latlonz[2]);
                zoom = parseFloat(latlonz[3]);
            }
            break;
    }
    if(!(lat === null) && !(lon === null)){
        return {"lat":lat, "lon":lon, "zoom":zoom};
    }
    console.log("no place detected");
    var not_found_message;
    switch(hostname){
        case "foursquare":
            not_found_message = "browse to a place page";
            break;
        case "maps.google.com":
            not_found_message = "no coordinates detected, drag the map around, click again";
            break;
        case "openstreetmap.org":
            not_found_message = "no coordinates detected";
            break;
        default:
            not_found_message = "no coordinates detected";
    }
    return {"found": false, "message": not_found_message};
};

function initialize(tabId) {
    chrome.tabs.sendRequest(tabId, {}, function(coordinates_pair) {
        if (!coordinates_pair) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.pageAction.show(tabId);
        }
    });
}
