const MAX_PANORAMA_DISTANCE = 100;
var panoLocation;
var guessedLocation;
var numGuesses = 0;
var marker;

const countryBoundingBoxes = [
  [19.3044861183, 39.624997667, 21.0200403175, 42.6882473822],
  [1.5795186705, 22.4969475367, 56.3968473651, 26.055464179],
  [-73.4154357571, -55.25, -53.628348965, -21.8323104794],
  [113.338953078, -43.6345972634, 153.569469029, -10.6681857235],
  [9.47996951665, 46.4318173285, 16.9796667823, 49.0390742051],
  [2.51357303225, 49.5294835476, 6.15665815596, 51.4750237087],
  [88.0844222351, 20.670883287, 92.6727209818, 26.4465255803],
  [22.3805257504, 41.2344859889, 28.5580814959, 44.2349230007],
  [-78.98, 23.71, -77.0, 27.04],
  [-69.5904237535, -22.8729187965, -57.4983711412, -9.76198780685],
  [-73.9872354804, -33.7683777809, -34.7299934555, 5.24448639569],
  [88.8142484883, 26.7194029811, 92.1037117859, 28.2964385035],
  [19.8954577979, -26.8285429827, 29.4321883481, -17.6618156877],
  [-140.99778, 41.6751050889, -52.6480987209, 83.23324],
  [6.02260949059, 45.7769477403, 10.4427014502, 47.8308275417],
  [-75.6443953112, -55.61183, -66.95992, -17.5800118954],
  [-78.9909352282, -4.29818694419, -66.8763258531, 12.4373031682],
  [-85.94172543, 8.22502798099, -82.5461962552, 11.2171192489],
  [12.2401111182, 48.5553052842, 18.8531441586, 51.1172677679],
  [5.98865807458, 47.3024876979, 15.0169958839, 54.983104153],
  [8.08997684086, 54.8000145534, 12.6900061378, 57.730016588],
  [-71.9451120673, 17.598564358, -68.3179432848, 19.8849105901],
  [-80.9677654691, -4.95912851321, -75.2337227037, 1.3809237736],
  [-9.39288367353, 35.946850084, 3.03948408368, 43.7483377142],
  [23.3397953631, 57.4745283067, 28.1316992531, 59.6110903998],
  [20.6455928891, 59.846373196, 31.5160921567, 70.1641930203],
  [-180.0, -18.28799, 180.0, -16.0208822567],
  [-54.5247541978, 2.05338918702, 9.56001631027, 51.1485061713],
  [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085],
  [-3.24437008301, 4.71046214438, 1.0601216976, 11.0983409693],
  [20.1500159034, 34.9199876979, 26.6041955909, 41.8269046087],
  [-73.297, 60.03676, -12.20855, 83.64513],
  [-92.2292486234, 13.7353376327, -88.2250227526, 17.8193260767],
  [13.6569755388, 42.47999136, 19.3904757016, 46.5037509222],
  [16.2022982113, 45.7594811061, 22.710531447, 48.6238540716],
  [95.2930261576, -10.3599874813, 141.03385176, 5.47982086834],
  [68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078],
  [-9.97708574059, 51.6693012559, -6.03298539878, 55.1316222195],
  [-24.3261840479, 63.4963829617, -13.609732225, 66.5267923041],
  [34.2654333839, 29.5013261988, 35.8363969256, 33.2774264593],
  [6.7499552751, 36.619987291, 18.4802470232, 47.1153931748],
  [129.408463169, 31.0295791692, 145.543137242, 45.5514834662],
  [33.8935689697, -4.67677, 41.8550830926, 5.506],
  [69.464886916, 39.2794632025, 80.2599902689, 43.2983393418],
  [102.3480994, 10.4865436874, 107.614547968, 14.5705838078],
  [126.117397903, 34.3900458847, 129.468304478, 38.6122429469],
  [100.115987583, 13.88109101, 107.564525181, 22.4647531194],
  [79.6951668639, 5.96836985923, 81.7879590189, 9.82407766361],
  [26.9992619158, -30.6451058896, 29.3251664568, -28.6475017229],
  [21.0558004086, 53.9057022162, 26.5882792498, 56.3725283881],
  [5.67405195478, 49.4426671413, 6.24275109216, 50.1280516628],
  [21.0558004086, 55.61510692, 28.1767094256, 57.9701569688],
  [43.2541870461, -25.6014344215, 50.4765368996, -12.0405567359],
  [-117.12776, 14.5388286402, -86.811982388, 32.72083],
  [20.46315, 40.8427269557, 22.9523771502, 42.3202595078],
  [18.45, 41.87755, 20.3398, 43.52384],
  [87.7512642761, 41.5974095729, 119.772823928, 52.0473660345],
  [100.085756871, 0.773131415201, 119.181903925, 6.92805288332],
  [164.029605748, -22.3999760881, 167.120011428, -20.1056458473],
  [2.69170169436, 4.24059418377, 14.5771777686, 13.8659239771],
  [3.31497114423, 50.803721015, 7.09205325687, 53.5104033474],
  [4.99207807783, 58.0788841824, 31.29341841, 80.6571442736],
  [166.509144322, -46.641235447, 178.517093541, -34.4506617165],
  [-81.4109425524, -18.3479753557, -68.6650797187, -0.0572054988649],
  [117.17427453, 5.58100332277, 126.537423944, 18.5052273625],
  [14.0745211117, 49.0273953314, 24.0299857927, 54.8515359564],
  [-67.2424275377, 17.946553453, -65.5910037909, 18.5206011011],
  [-9.52657060387, 36.838268541, -6.3890876937, 42.280468655],
  [20.2201924985, 43.6884447292, 29.62654341, 48.2208812526],
  [-180.0, 41.151416124, 180.0, 81.2504],
  [-17.6250426905, 12.332089952, -11.4678991358, 16.5982636581],
  [156.491357864, -10.8263672828, 162.398645868, -6.59933847415],
  [18.82982, 42.2452243971, 22.9860185076, 46.1717298447],
  [16.8799829444, 47.7584288601, 22.5581376482, 49.5715740017],
  [13.6981099789, 45.4523163926, 16.5648083839, 46.8523859727],
  [11.0273686052, 55.3617373725, 23.9033785336, 69.1062472602],
  [30.6766085141, -27.2858794085, 32.0716654803, -25.660190525],
  [97.3758964376, 5.69138418215, 105.589038527, 20.4178496363],
  [-61.95, 10.0, -60.895, 10.89],
  [7.52448164229, 30.3075560572, 11.4887874691, 37.3499944118],
  [26.0433512713, 35.8215347357, 44.7939896991, 42.1414848903],
  [29.5794661801, -1.44332244223, 35.03599, 4.24988494736],
  [22.0856083513, 44.3614785833, 40.0807890155, 52.3350745713],
  [-58.4270741441, -34.9526465797, -53.209588996, -30.1096863746],
  [-171.791110603, 18.91619, -66.96466, 71.3577635769],
  [102.170435826, 8.59975962975, 109.33526981, 23.3520633001],
  [166.629136998, -16.5978496233, 167.844876744, -14.6264970842],
  [16.3449768409, -34.8191663551, 32.830120477, -22.0913127581],
]

window.initialize = initialize;


function initialize() {
  const sv = new google.maps.StreetViewService();
  sv.getPanoramaByLocation(getRandomLocation(), MAX_PANORAMA_DISTANCE, function (streetViewPanoramaData, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      initPanoramaAndMap(streetViewPanoramaData);
    } else {
        initialize();
    }
  });

  const guessButton = document.getElementById("guessButton");
  guessButton.addEventListener("click", confirmGuess);
}

function getRandomLocation() {
  var country = countryBoundingBoxes[Math.floor(Math.random() * countryBoundingBoxes.length)];
  const lat = Math.random() * (country[3] - country[1]) + country[1];
  const lng = Math.random() * (country[2] - country[0]) + country[0];
  return new google.maps.LatLng(lat, lng);
}

function initPanoramaAndMap(data) {
  panoLocation = data.location.latLng;
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 },
    zoom: 1,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
  });
  const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      addressControl: false,
      linksControl: false,
      enableCloseButton: false,
      fullscreenControl: false,
      clickToGo: false,
      showRoadLabels: false,
    }
  );
  panorama.setPano(data.location.pano)
  map.setStreetView(panorama);

  google.maps.event.addListener(map, 'click', function(event){
    selectLocation(event.latLng, map);
  })
}

function selectLocation(location, map) {
  guessedLocation = location;
  enableButton();

  if(marker != null){
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: location,
    map: map
  });
}

function calculateDistance(locationA, locationB){
  const earthRadius = 6371;
  const latA = locationA.lat();
  const lngA = locationA.lng();
  const latB = locationB.lat();
  const lngB = locationB.lng();

  const dLat = degreesToRadians(latB - latA);
  const dLng = degreesToRadians(lngB - lngA);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
    Math.cos(degreesToRadians(latA)) * Math.cos(degreesToRadians(latB)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadius * c;
}

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}

function confirmGuess(){
  if(guessedLocation){
    addGuessToHTML(guessedLocation);
    numGuesses++;
    marker.setLabel(numGuesses+'');

    disableButton();
    marker = null;
  }
}

function disableButton(){
  guessButton.innerText = "Select a location";
  guessButton.disabled = true;
}

function enableButton(){
  guessButton.innerText = "Confirm guess";
  guessButton.disabled = false;
}

function addGuessToHTML(guessedLocation){
  const distance = calculateDistance(guessedLocation, panoLocation);
  const list = document.getElementById("guessList");
  list.innerHTML += "<li>" + distanceToString(distance) + "</li>";
}

function distanceToString(distance){
  if(distance >= 10){
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