const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const tripResult = document.querySelector(".bus-container");

const mapAPIURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapAPIBB = "&bbox=-97.325875,49.766204,-96.953987,49.99275";
const mapAPILimit = ".json?limit=10";
const mapAPIKey =
  "&access_token=pk.eyJ1IjoiZXJpbnJpbmdsYW5kIiwiYSI6ImNramxrMnVjczA1cWMycXF1bnBpZjd3NTEifQ.7yWMSJkj2XtoX7XlAkbbDw";
// const busAPIURL =
//   "https://api.winnipegtransit.com/v3/trip-planner.json?api-key=BGA5REIJoz3BbXP5CXN4";
// const busAPIorigin = "&origin=geo/";
// const busAPIdest = "&destination=geo/";

///https://api.winnipegtransit.com/v3/trip-planner.json?api-key=BGA5REIJoz3BbXP5CXN4&origin=geo/49.8638714,-97.1848822&destination=geo/49.8093036,-97.1356527

///49.8638714
///-97.1848822

///49.8093036
///-97.1356527

function clearPage() {
  startLocationSuggestions.innerHTML = "";
  destLocationSuggestions.innerHTML = "";
  tripResult.innerHTML = "";
}

function startingPoint(start) {
  let startAPIURL = mapAPIURL + start + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(startAPIURL)
    .then((response) => response.json())
    .then((startLocation) => {
      let startLocationsArr = [];
      startLocation.features.forEach((location) => {
        let startTitle = location.place_name;
        let startLong = location.center[0];
        let startLat = location.center[1];

        startLocationsArr.push({
          title: startTitle,
          lat: startLat,
          long: startLong,
        });
      });
      displayStartResults(startLocationsArr);
    })
    .catch(function () {
      alert("API Failed, please refresh the page and try again");
    });
}

function destinationPoint(final) {
  let finalAPIURL = mapAPIURL + final + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(finalAPIURL)
    .then((response) => response.json())
    .then((finalLocation) => console.log(finalLocation.features))
    .catch(function () {
      alert("API Failed, please refresh the page and try again");
    });
}

function displayStartResults(startResults) {
  startResults.forEach((results) => {
    console.log(results);
    startLocationSuggestions.insertAdjacentHTML(
      "beforeend",
      `
      <li data-long="${results.long}" data-lat="${results.lat}">
        <div class="name">${results.title}</div>
        <div>1845 Pembina Hwy</div>
      </li>`
    );
  });
}

clearPage();

startLocation.addEventListener("submit", function (e) {
  e.preventDefault();
  if (startLocation[0].value === "") {
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
  } else {
    destinationPoint(destLocation[0].value);
  }
  destLocation[0].value = "";
});
