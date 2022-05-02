const MAX_PANORAMA_DISTANCE = 100;
const backendURL = "http://localhost:5000/";
var panoLocation;
var guessedLocation;
var bestGuess;
var bestGuessDistance;
var numGuesses = 0;
var marker;
var guessButton;
var playAgainButton;
var resultsOverlay;
var searchBar;

window.initialize = initialize;


async function initialize() {
  const sv = new google.maps.StreetViewService();
  sv.getPanoramaByLocation(await getRandomLocation(), MAX_PANORAMA_DISTANCE, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      initPanoramaAndMap(streetViewPanoramaData);
    } else {
        initialize();
    }
  });

  playAgainButton = document.getElementById("playAgainButton");
  playAgainButton.addEventListener("click", resetGame);

  searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("keyup", updateSearch);

  resultsOverlay = document.getElementById("results");
  resultsOverlay.style.visibility = "hidden";
}

function resetGame(){
  guessedLocation = null;
  marker = null;
  bestGuess = null;
  bestGuessDistance = null;
  numGuesses = 0;
  marker = null;

  document.getElementById("guessList").innerHTML = "";
  document.getElementById("resultHeader").innerHTML = "";
  initialize();
}

async function getRandomLocation() {
  const requestURL = backendURL + 'get_location/';
  let response = await fetch(requestURL);
  let json = await response.json();
  return new google.maps.LatLng(json.lat, json.lng);
}

function initPanoramaAndMap(data) {
  panoLocation = data.location.latLng;
  const usCenter = {lat: 39.8283, lng: -98.5795};
  const map = new google.maps.Map(document.getElementById("map"), {
    center: usCenter,
    zoom: 3,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    clickableIcons: false
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      linksControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      showRoadLabels: false,
    }
  );
  panorama.setPano(data.location.pano)
  map.setStreetView(panorama);

  google.maps.event.addListener(map, 'click', function(event){
    selectLocation(event.latLng, map);
  })
}

function addGuessToHTML(distance){
  const list = document.getElementById("guessList");
  list.innerHTML += "<li>" + distanceToString(distance) + "</li>";
}

function distanceToString(distance){
  if(distance >= 1){
    return new Intl.NumberFormat('en-GB', {
      style: 'unit',
      unit: 'kilometer'
    }).format(distance);
  }
  else{
    return new Intl.NumberFormat('en-GB',{
      style: 'unit',
      unit: 'meter'
    }).format(distance*1000);
  }
}
function displayWinResult(){
  resultsOverlay.style.visibility = "visible";
  resultsOverlay.style.backgroundColor = "green";

  const text = document.getElementById("resultHeader")
  text.innerHTML = "<h1>Victory</h1>";
  text.innerHTML += "<p>You were within 100 meters from the location!"
  createResultHTML();
}

function displayLossResult(){
  resultsOverlay.style.visibility = "visible";
  resultsOverlay.style.backgroundColor = "#c71104";

  const text = document.getElementById("resultHeader")
  text.innerHTML = "<h1>Defeat</h1>";
  text.innerHTML += "<p>You were " + 
    distanceToString(bestGuessDistance) +   " from the right location!</p>";
  createResultHTML();
}

async function updateSearch(){
  let search = searchBar.value;
  const requestURL = backendURL + 'search/' + search;
  let response = await fetch(requestURL);
  let json = await response.json();
  const results = json.results;
  console.log(results)

  let searchResults = document.getElementById("searchResults");
  searchResults.innerHTML="";
  for(city of results){
    searchResults.innerHTML += "<li class='searchResult' city-id=" +city[0]+"><a href='#'>"+city[1]+","+city[2]+"</a><li/>\n"
  }
  addEventToSearchResults();
}

function addEventToSearchResults(){
  var searchResults = document.getElementsByClassName("searchResult");
  for(result of searchResults){
    result.addEventListener('click', selectSearchResult);
  }
}

async function selectSearchResult(){
  const requestURL = backendURL + 'guess/' + this.getAttribute("city-id");
  let response = await fetch(requestURL);
  let json = await response.json();

  console.log(json);
}

function createResultHTML(){
  const map = new google.maps.Map(document.getElementById("resultMap"), {
    center: panoLocation,
    zoom: 6,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    clickableIcons: false
  });

  new google.maps.Marker({
    position: bestGuess,
    map: map
  });

  new google.maps.Marker({
    position: panoLocation,
    map: map,
    icon: "answer-marker.png",
  });

  const lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
  }

  new google.maps.Polyline({
    path: [bestGuess, panoLocation],
    icons: [{
      icon: lineSymbol,
      offset: '100%'
    }],
    geodesic: true,
    strokeColor: "#5D665F",
    strokeOpacity: 1.0,
    strokeWeight: 4,
    map: map,
  });
}

