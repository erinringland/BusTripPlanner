const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const startItems = document.querySelectorAll(".origins li");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const destItems = document.querySelectorAll(".destinations li");
const tripButton = document.querySelector(".plan-trip");
const tripResultContainer = document.querySelector(".bus-container");
const recTripResult = document.querySelector(".rec-trip");

const mapAPIURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const mapAPIBB = "&bbox=-97.325875,49.766204,-96.953987,49.99275";
const mapAPILimit = ".json?limit=10";
const mapAPIKey =
  "&access_token=pk.eyJ1IjoiZXJpbnJpbmdsYW5kIiwiYSI6ImNramxrMnVjczA1cWMycXF1bnBpZjd3NTEifQ.7yWMSJkj2XtoX7XlAkbbDw";
const busAPIURL =
  "https://api.winnipegtransit.com/v3/trip-planner.json?api-key=BGA5REIJoz3BbXP5CXN4&usage=long";
const busAPIorigin = "&origin=geo/";
const busAPIdest = "&destination=geo/";

function clearPage() {
  startLocationSuggestions.innerHTML = "";
  destLocationSuggestions.innerHTML = "";
  tripResultContainer.innerHTML = "";
}

function startingPoint(start) {
  let startAPIURL = mapAPIURL + start + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(startAPIURL)
    .then((response) => response.json())
    .then((startLocation) => {
      let startLocationsArr = [];
      startLocation.features.forEach((location) => {
        // Name
        let titleObj = location.place_name;
        titleObj = titleObj.split(",", 1);
        let startTitle = titleObj.toString();
        // Location/Address
        let startAddress = location.place_name;
        startAddress = startAddress.split(",");
        let startLong = location.center[0];
        let startLat = location.center[1];

        startLocationsArr.push({
          title: startTitle,
          address: startAddress[1],
          lat: startLat,
          long: startLong,
        });
      });
      displayStartResults(startLocationsArr);
    });
  // .catch(function () {
  //   alert("API Failed, please refresh the page and try again");
  // });
}

function destinationPoint(final) {
  let finalAPIURL = mapAPIURL + final + mapAPILimit + mapAPIBB + mapAPIKey;
  fetch(finalAPIURL)
    .then((response) => response.json())
    .then((finalLocation) => {
      let finalLocationArr = [];
      finalLocation.features.forEach((destination) => {
        // Name
        let titleObj = destination.place_name;
        titleObj = titleObj.split(",", 1);
        let destTitle = titleObj.toString();
        // Location/Address
        let destAddress = destination.place_name;
        destAddress = destAddress.split(",");
        let destLong = destination.center[0];
        let destLat = destination.center[1];

        finalLocationArr.push({
          title: destTitle,
          address: destAddress[1],
          lat: destLat,
          long: destLong,
        });
      });
      displayDestinationResults(finalLocationArr);
    });
  // .catch(function () {
  //   alert("API Failed, please refresh the page and try again");
  // });
}

function displayStartResults(startResults) {
  startLocationSuggestions.innerHTML = "";
  startResults.forEach((results) => {
    startLocationSuggestions.insertAdjacentHTML(
      "beforeend",
      `
      <li data-long="${results.long}" data-lat="${results.lat}">
        <div class="name">${results.title}</div>
        <div>${results.address}</div>
      </li>`
    );
  });
  selectStartLocation();
}

function selectStartLocation() {
  let newStartItems = document.querySelectorAll(".origins li");
  newStartItems.forEach((element) => {
    element.addEventListener("click", function (e) {
      if (startLocationSuggestions.querySelector(".selected")) {
        startLocationSuggestions
          .querySelector(".selected")
          .classList.remove("selected");
      }
      element.classList.add("selected");
    });
  });
}

function displayDestinationResults(destResults) {
  destLocationSuggestions.innerHTML = "";
  destResults.forEach((results) => {
    destLocationSuggestions.insertAdjacentHTML(
      "beforeend",
      `
      <li data-long="${results.long}" data-lat="${results.lat}">
        <div class="name">${results.title}</div>
        <div>${results.address}</div>
      </li>`
    );
  });
  selectDestLocation();
}

function selectDestLocation() {
  let newDestItems = document.querySelectorAll(".destinations li");
  newDestItems.forEach((element) => {
    element.addEventListener("click", function (e) {
      if (destLocationSuggestions.querySelector(".selected")) {
        destLocationSuggestions
          .querySelector(".selected")
          .classList.remove("selected");
      }
      element.classList.add("selected");
    });
  });
}

function tripPlanner(startLat, startLong, destLat, destLong) {
  let startCoord = startLat + "," + startLong;
  let destCoord = destLat + "," + destLong;
  let finalBusAPIURL =
    busAPIURL + busAPIorigin + startCoord + busAPIdest + destCoord;
  fetch(finalBusAPIURL)
    .then((response) => response.json())
    .then((trips) => {
      if (trips.plans.length === 0) {
        console.log("There are no results!");
      }

      recTripLogic(trips.plans.shift());
      altTripLogic(trips.plans);
    })
    .catch(() => {
      errorMessage();
    });
}

function errorMessage() {
  return tripResultContainer.insertAdjacentHTML(
    "afterbegin",
    `<p>No trips are avaiable, please try again!</p>`
  );
}

function recTripLogic(recTrip) {
  if (recTrip.segments.length > 1) {
    tripResultContainer.insertAdjacentHTML(
      "afterbegin",
      `<h1>Recommended Trip</h1>
      <ul class="rec-trip">
      </ul>`
    );
  }
  recTrip.segments.forEach((item) => {
    const recTripResult = document.querySelector(".rec-trip");

    if (item.type === "walk") {
      if (item.to.stop) {
        let walkDuration = item.times.durations.total;
        let walkStopKey = item.to.stop.key;
        let walkStopName = item.to.stop.name;
        recTripResult.insertAdjacentHTML(
          "beforeend",
          `<li> <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${walkDuration} minutes to stop #${walkStopKey} - ${walkStopName} </li>`
        );
      } else {
        let walkDuration = item.times.durations.total;
        recTripResult.insertAdjacentHTML(
          "beforeend",
          `<li><i class="fas fa-walking" aria-hidden="true"></i>Walk for ${walkDuration} minutes to your destination</li>`
        );
      }
    }
    if (item.type === "transfer") {
      let transferKey = item.from.stop.key;
      let transferStopName = item.from.stop.name;
      let transferNewKey = item.to.stop.key;
      let transferNewStopName = item.to.stop.name;
      recTripResult.insertAdjacentHTML(
        "beforeend",
        `<li> <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop #${transferKey} - ${transferStopName} to stop #${transferNewKey} - ${transferNewStopName}</li>`
      );
    }
    if (item.type === "ride") {
      let rideRoute = item.route.name;
      let rideDuration = item.times.durations.total;
      recTripResult.insertAdjacentHTML(
        "beforeend",
        `<li><i class="fas fa-bus" aria-hidden="true"></i>Ride the ${rideRoute} for ${rideDuration} minutes.</li>`
      );
    }
  });
}

function altTripLogic(altTrips) {
  if (altTrips.length > 0) {
    tripResultContainer.insertAdjacentHTML(
      "beforeend",
      `<h1>Alternate Trip(s)</h1>
        <ul class="alt-trip">
        </ul>`
    );
  }
  let tripCounter = 1;
  altTrips.forEach((altTripItems) => {
    const altTripResult = document.querySelector(".alt-trip");
    altTripResult.insertAdjacentHTML(
      "beforeend",
      `<li><strong>Alternate Trip ${tripCounter++}</strong></li>`
    );
    altTripItems.segments.forEach((item) => {
      if (item.type === "walk") {
        if (item.to.stop) {
          let walkDuration = item.times.durations.total;
          let walkStopKey = item.to.stop.key;
          let walkStopName = item.to.stop.name;
          altTripResult.insertAdjacentHTML(
            "beforeend",
            `<li> <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${walkDuration} minutes to stop #${walkStopKey} - ${walkStopName} </li>`
          );
        } else {
          let walkDuration = item.times.durations.total;
          altTripResult.insertAdjacentHTML(
            "beforeend",
            `<li><i class="fas fa-walking" aria-hidden="true"></i>Walk for ${walkDuration} minutes to your destination</li>`
          );
        }
      }
      if (item.type === "transfer") {
        let transferKey = item.from.stop.key;
        let transferStopName = item.from.stop.name;
        let transferNewKey = item.to.stop.key;
        let transferNewStopName = item.to.stop.name;
        altTripResult.insertAdjacentHTML(
          "beforeend",
          `<li> <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop #${transferKey} - ${transferStopName} to stop #${transferNewKey} - ${transferNewStopName}</li>`
        );
      }
      if (item.type === "ride") {
        let rideRoute = item.route.name;
        let rideDuration = item.times.durations.total;
        altTripResult.insertAdjacentHTML(
          "beforeend",
          `<li><i class="fas fa-bus" aria-hidden="true"></i>Ride the ${rideRoute} for ${rideDuration} minutes.</li>`
        );
      }
    });
  });
}

function startError() {
  startLocationSuggestions.innerHTML = `Please select a starting location!`;
}

function destError() {
  destLocationSuggestions.innerHTML = `Please select a destination!`;
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

tripButton.addEventListener("click", function () {
  let startCoord = startLocationSuggestions.getElementsByClassName("selected");
  let destCoord = destLocationSuggestions.getElementsByClassName("selected");
  let ogLong;
  let ogLat;
  let destLong;
  let destLat;

  if (startCoord[0] === undefined) {
    return startError();
  } else {
    ogLong = startCoord[0].attributes[0].value;
    ogLat = startCoord[0].attributes[1].value;
  }

  if (destCoord[0] === undefined) {
    return destError();
  } else {
    destLong = destCoord[0].attributes[0].value;
    destLat = destCoord[0].attributes[1].value;
  }

  tripPlanner(ogLat, ogLong, destLat, destLong);
  clearPage();
});
