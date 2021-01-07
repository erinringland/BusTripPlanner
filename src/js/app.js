const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const tripResult = document.querySelector(".bus-container");

const mapAPIURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapAPIBB = "&box=-97.325875,49.766204,-96.953987,49.99275";
const mapAPILimit = ".json?limit=10";
const mapAPIKey =
  "&access_token=pk.eyJ1IjoiZXJpbnJpbmdsYW5kIiwiYSI6ImNramxrMnVjczA1cWMycXF1bnBpZjd3NTEifQ.7yWMSJkj2XtoX7XlAkbbDw";
const busAPIKey = "BGA5REIJoz3BbXP5CXN4";

/// https://api.mapbox.com/geocoding/v5/mapbox.places/starbucks.json?bbox=-77.083056,38.908611,-76.997778,38.959167&access_token=pk.eyJ1IjoiZXJpbnJpbmdsYW5kIiwiYSI6ImNramxrMnVjczA1cWMycXF1bnBpZjd3NTEifQ.7yWMSJkj2XtoX7XlAkbbDw

function clearPage() {
  startLocationSuggestions.innerHTML = "";
  destLocationSuggestions.innerHTML = "";
  tripResult.innerHTML = "";
}

function startingPoint(start) {
  let startAPIURL = mapAPIURL + start + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(startAPIURL)
    .then((response) => response.json())
    .then((startLocation) => console.log(startLocation.features))
    .catch(function(){
      alert("API Failed")
    })
}

function destinationPoint(final) {
  let finalAPIURL = mapAPIURL + final + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(finalAPIURL)
    .then((response) => response.json())
    .then((finalLocation) => console.log(finalLocation.features))
    .catch(function () {
      alert("API Failed");
    });
}

clearPage();

startLocation.addEventListener("submit", function (e) {
  e.preventDefault();
  if (startLocation[0].value === "") {
    console.log("Yeet");
    startLocationSuggestions.innerHTML = `<p>Please enter a location!</p>`;
  } else {
    startingPoint(startLocation[0].value);
  }
  startLocation[0].value = "";
});

destLocation.addEventListener("submit", function (e) {
  e.preventDefault();
  if (destLocation[0].value === "") {
    destLocationSuggestions.innerHTML = `<p>Please enter a destination!</p>`;
    console.log("This bitch empty");
  } else {
    destinationPoint(destLocation[0].value);
  }
  destLocation[0].value = "";
});
