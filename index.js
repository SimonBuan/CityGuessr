const MAX_PANORAMA_DISTANCE = 100;
const backendURL = "http://localhost:5000/";
var panoLocation;
var map;
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
  map = new google.maps.Map(document.getElementById("map"), {
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

function distanceToString(distance){
  if(distance >= 1){
    return new Intl.NumberFormat('en-GB', {
      style: 'unit',
      unit: 'mile'
    }).format(distance);
  }
  else{
    return new Intl.NumberFormat('en-GB',{
      style: 'unit',
      unit: 'yard'
    }).format(distance*1760);
  }
}

async function updateSearch(){
  let search = searchBar.value;
  const requestURL = backendURL + 'search/' + search;
  let response = await fetch(requestURL);
  let json = await response.json();
  const results = json.results;

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
  const cityId = this.getAttribute("city-id");
  const requestURL = backendURL + 'guess/' + cityId;
  let response = await fetch(requestURL);
  let json = await response.json();

  ++numGuesses;

  if(json["correct_city"]){
    displayWinResult();
  } else if(numGuesses == 5){
    displayLossResult();
  } else{
    updateGuesses(json);
  }
}

function updateGuesses(resultJSON){
  const guessTable = document.getElementById("guessTable");
  const guessedCity = resultJSON["guessed_city"];

  var newRow = guessTable.insertRow();
  var city = newRow.insertCell(0);
  var state = newRow.insertCell(1);
  var distance = newRow.insertCell(2);
  city.innerHTML =  guessedCity[1];
  state.innerHTML =  guessedCity[2];
  if(resultJSON.correct_state){
    state.setAttribute("class", "correctGuess");
  } else {
    state.setAttribute("class", "wrongGuess");
  }
  distance.innerHTML = distanceToString(resultJSON["distance"]);

  new google.maps.Marker({
    position: {lat: guessedCity[3], lng: guessedCity[4]},
    map,
    label: numGuesses+'',
  })
}

function displayWinResult(){
  resultsOverlay.style.visibility = "visible";
  resultsOverlay.style.backgroundColor = "green";

  const text = document.getElementById("resultHeader")
  text.innerHTML = "<h1>Correct</h1>";
  text.innerHTML += "<p>You were within 100 meters from the location!"
  createResultHTML();
}

async function displayLossResult(){
  resultsOverlay.style.visibility = "visible";
  resultsOverlay.style.backgroundColor = "#c71104";

  const requestURL = backendURL + "get_current_city/";
  let response = await fetch(requestURL);
  let json = await response.json();

  
  const result = json["city_data"];
  console.log(result);

  const text = document.getElementById("resultHeader")
  text.innerHTML = "<h1>No More Guesses</h1>";
  text.innerHTML += "<p>The correct city was " + result[1] + ".";
  createResultHTML();
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
    position: panoLocation,
    map: map,
    icon: "answer-marker.png",
  });

}

