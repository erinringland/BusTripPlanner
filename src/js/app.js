const startLocation = document.querySelector(".origin-form");
const startLocationSuggestions = document.querySelector(".origins");
const destLocation = document.querySelector(".destination-form");
const destLocationSuggestions = document.querySelector(".destinations");
const tripResult = document.querySelector(".bus-container");

function clearPage() {
  startLocationSuggestions.innerHTML = "";
  destLocationSuggestions.innerHTML = "";
  tripResult.innerHTML = "";
}

clearPage();

startLocation.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(startLocation[0].value);
  startLocation[0].value = "";
});

destLocation.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(destLocation[0].value);
  destLocation[0].value = "";
});
