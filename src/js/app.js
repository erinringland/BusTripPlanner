const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const startItems = document.querySelectorAll(".origins li");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const destItems = document.querySelectorAll(".destinations li");
const tripButton = document.querySelector(".plan-trip");
const tripResult = document.querySelector(".bus-container");

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
  tripResult.innerHTML = "";
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
    })
    .catch(function () {
      alert("API Failed, please refresh the page and try again");
    });
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
    })
    .catch(function () {
      alert("API Failed, please refresh the page and try again");
    });
}

function displayStartResults(startResults) {
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
    .catch(function () {
      alert("Please enter a location inside Winnipeg!");
    });
}

function recTripLogic(recTrip) {
  let recTripArr = [];
  recTrip.segments.forEach((directions) => {
    if (directions.type === "walk") {
      let recWalkOne = [];
      let recWalkTwo = [];
      recWalkOne.push({
        title: directions.type,
        duration: directions.times.durations.total,
        icon: "fa-walking",
      });
      if (directions.to.stop) {
        recWalkTwo.push({
          nextStopKey: directions.to.stop.key,
          nextStopName: directions.to.stop.name,
        });
      }
      let allWalk = recWalkOne.concat(recWalkTwo);
      recTripArr.push(allWalk);
    }
    if (directions.type === "transfer") {
      recTripArr.push({
        title: directions.type,
        transferKey: directions.from.stop.key,
        transferStopName: directions.from.stop.name,
        newKey: directions.to.stop.key,
        newStopName: directions.to.stop.name,
        icon: "fa-ticket-alt",
      });
    }
    if (directions.type === "ride") {
      recTripArr.push({
        title: directions.type,
        rideRoute: directions.route.name,
        rideDuration: directions.times.durations.total,
        icon: "fa-bus",
      });
    }
  });
  displayRecTripResults(recTripArr);
}

function altTripLogic(altTrips) {
  let altTripsArr = [];
  altTrips.forEach((altTripResults) => {
    let altSingleTripArr = [];
    altTripResults.segments.forEach((altTripResultItems) => {
      if (altTripResultItems.type === "walk") {
        let recWalkOne = [];
        let recWalkTwo = [];
        recWalkOne.push({
          title: altTripResultItems.type,
          duration: altTripResultItems.times.durations.total,
          icon: "fa-walking",
        });
        if (altTripResultItems.to.stop) {
          recWalkTwo.push({
            nextStopKey: altTripResultItems.to.stop.key,
            nextStopName: altTripResultItems.to.stop.name,
          });
        }
        let allWalk = recWalkOne.concat(recWalkTwo);
        altSingleTripArr.push(allWalk);
      }
      if (altTripResultItems.type === "transfer") {
        altSingleTripArr.push({
          title: altTripResultItems.type,
          transferKey: altTripResultItems.from.stop.key,
          transferStopName: altTripResultItems.from.stop.name,
          newKey: altTripResultItems.to.stop.key,
          newStopName: altTripResultItems.to.stop.name,
          icon: "fa-ticket-alt",
        });
      }
      if (altTripResultItems.type === "ride") {
        altSingleTripArr.push({
          title: altTripResultItems.type,
          rideRoute: altTripResultItems.route.name,
          rideDuration: altTripResultItems.times.durations.total,
          icon: "fa-bus",
        });
      }
    });
    altTripsArr.push(altSingleTripArr);
  });
  // console.log(altTripsArr);
}

function displayRecTripResults(recTripResults) {
  console.log(recTripResults);
  for (let i = 0; i < recTripResults.length; i++) {
    console.log(recTripResults[i]);
  }
  // recTripResults.forEach((result) => {
  //   console.log(result)
  // })
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
  // console.log(startItems)
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
    console.log("Select an origin");
  } else {
    ogLong = startCoord[0].attributes[0].value;
    ogLat = startCoord[0].attributes[1].value;
  }

  if (destCoord[0] === undefined) {
    console.log("Select a destination");
  } else {
    destLong = destCoord[0].attributes[0].value;
    destLat = destCoord[0].attributes[1].value;
  }

  tripPlanner(ogLat, ogLong, destLat, destLong);
  startLocationSuggestions.innerHTML = ``;
  destLocationSuggestions.innerHTML = ``;
});
