const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const startItems = document.querySelectorAll(".origins li");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const destItems = document.querySelectorAll(".destinations li");
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
}

// function tripPlanner(startLat, startLong, destLat, destLong) {
//   let startCoord = startLat + "," + startLong;
//   let destCoord = destLat + "," + destLong;
//   let finalBusAPIURL =
//     busAPIURL + busAPIorigin + startCoord + busAPIdest + destCoord;
//   fetch(finalBusAPIURL)
//     .then((response) => response.json())
//     .then((trips) => tripResultLogic(trips))
//     .catch(function () {
//       alert("API Key not working, please refresh the page");
//     });
// }

const tripResults = (callback) => {
  const request = new XMLHttpRequest();

  request.addEventListener('readystatechange', () => {
    if(request.readyState === 4 && request.status === 200){
      callback(undefined, JSON.parse(request.responseText));
    } else if(request.readyState === 4){
      callback('Error!', undefined);
    }
  })

  request.open('GET', 'js/data/trip-planner.json');
  request.send(); 
}

tripResults((error, data) => {
  if(error){
    console.log(error);
  } else{
    tripResultLogic(data);
  }
});

function tripResultLogic(trips) {
  // console.log(trips[0].plans)
  if (trips[0].plans[0].length === 0) {
    console.log("There are no results!");
  }

  let recommendedTrip = trips[0].plans.shift();
  let altTrips = trips[0].plans;

  // console.log(recommendedTrip.segments);
  let recTripArr = [];
  recommendedTrip.segments.forEach((directions) => {
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
      recTripArr.push(allWalk)
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

  // console.log(recTripArr);

  console.log(altTrips);
  altTrips.forEach((altTripResults) => console.log(altTripResults))
}

// tripPlanner(49.8638714, -97.1848822, 49.868044, -97.1799357);
// clearPage();

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

for (let i = 0; i < startItems.length; i++) {
  startItems[i].addEventListener("click", function () {
    if (startLocationSuggestions.querySelector(".selected")) {
      startLocationSuggestions
        .querySelector(".selected")
        .classList.remove("selected");
    }
    startItems[i].classList.add("selected");
  });
}

for (let i = 0; i < destItems.length; i++) {
  destItems[i].addEventListener("click", function () {
    if (destLocationSuggestions.querySelector(".selected")) {
      destLocationSuggestions
        .querySelector(".selected")
        .classList.remove("selected");
    }
    destItems[i].classList.add("selected");
  });
}
