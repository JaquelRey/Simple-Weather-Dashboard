// using moment.js for the date
let dateObject = moment().format("dddd, MM / DD / YYYY");
console.log(dateObject);

const cityDisplay = document.getElementById("#cityDisplay");
const cityName = document.getElementById("#city");
const fiveDay = document.getElementById("#fiveDayDisplay");

const searchBtn = document.getElementById("#searchBtn");

const searchHistory = [];
const savedSearchHistory = [];

let uviDisp = document.querySelector("#uvi");
let uvDesc = document.querySelector("#uvDesc");

//gets the latitude and longitude of a given location to pass into the call for forecast data

function getLatLon(userInput) {
  let api = `https://geocode.maps.co/search?q=${userInput}`;
  fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(
        userInput +
          "'s found lat and lon is: lat: " +
          data[0].lat +
          " lon: " +
          data[0].lon +
          " using geocode.maps.co"
      );

      let foundLat = data[0].lat;
      let foundLon = data[0].lon;

      retrieveData(foundLat, foundLon, userInput);
    })
    .catch((error) => console.log(error));
}

function retrieveData(foundLat, foundLon, userInput) {
  const apiKey = "d3c11a611952a564411087138723b6e9";
  const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${foundLat}&lon=${foundLon}&units=imperial&appid=${apiKey}`;
  fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      //using moment to get the date of the requested city, accurate to it's timezone

      let dateTimezoneConverted = moment()
        .utcOffset(data.timezone_offset / 60)
        .format("dddd, MM / DD / YYYY");
      console.log("City's date on forecast " + dateTimezoneConverted);

      //passing uv index data to display

      const uvIndex = data.daily[0].uvi;
      uviDisplay(uvIndex);

      $("#city").text(userInput);
      $("#currentDate").text(dateTimezoneConverted);
      $("#weatherType").text(
        "Current weather: " + data.current.weather[0].description
      );

      $("#tempIs").text("Temp: " + data.current.temp + "\u00B0 F");
      $("#humidity").text("Humidity: " + data.current.humidity + "%");
      $("#windspeed").text("Windspeed: " + data.current.wind_speed + " MPH");
      $("#uvi").text("Today's peak UV index: " + uvIndex);

      const iconUrl =
        "http://openweathermap.org/img/w/" +
        data.current.weather[0].icon +
        ".png";
      $("#cityweatherIcon").attr("src", iconUrl);

      fiveDayForecast(data, dateTimezoneConverted);
    })
    .catch((error) => console.log(error));
}
/* TO DO..........
    HOME STRETCH EDITION: 

    -make a variable for the day in the daily array
    -make a loop that will increment the variable 5 times
    -have that variable passed into a display template 5x, and push that returned
    to an array
    -access each object in the array and display them to the page

    -weep with joy

    -realize you have to increment the date to be relevant too, and weep with sorrow
    -recover and pass that into the same template too, like a boss B)

    -purge the html from index.html and generate it here instead
      -doing that with the UV might be a stretch goal, see how much trouble it is vs worth rn
    
    -do away with all the (element).text bullcrap
      -youre going to generate those elements & plug the
        data in at the same time

    -clean up code FOR THE LAST TIME

    -sit back in awe at your creation, it was a long time coming but you learned a lot,
     and did it without code snips.

    -make a readme baby B)
    -submit and keep going! you're going to get through this! you can catch up!
      -remember that rome didn't got built in a day
      -remember that in the future, everything is made out of chrome
    -BREATHE
    */

function fiveDayForecast(data, dateTimezoneConverted) {
  $(".forecast-date").text(dateTimezoneConverted);

  const iconUrl2 =
    "http://openweathermap.org/img/w/" + data.daily[1].weather[0].icon + ".png";

  $("#cityweatherIcon2").attr("src", iconUrl2);

  $(".forecast-desc").text(
    "Predicted: " + data.daily[1].weather[0].description
  );
  

  $(".forecast-day-temp").text("Day temp: " + data.daily[1].temp.day + "\u00B0 F");
  $(".forecast-night-temp").text("Night temp: " + data.daily[1].temp.night + "\u00B0 F");
  $(".forecast-humidity").text("Humidity: " + data.daily[1].humidity + "%");
  $(".forecast-windspeed").text("Windspeed: " + data.daily[1].wind_speed + " MPH");
  console.log("here here" + data.daily[1].wind_speed)
}

// Chain of if else statements was determined to perform better than a switch for this purpose

function uviDisplay(uvIndex) {
  if (uvIndex < 3) {
    uviDisp.className = "has-background-success mb-0";
    uvDesc.textContent = "Danger low, no protection required.";
    console.log("UV index = Low, no protection required.");
  } else if (uvIndex >= 3 && uvIndex < 6) {
    uviDisp.className = "has-text-light has-background-success-dark mb-0";
    uvDesc.textContent = "Danger moderate, some protection required.";
    console.log("UV index = Moderate, some protection required.");
  } else if (uvIndex >= 6 && uvIndex < 8) {
    uviDisp.className = "has-background-warning mb-0";
    uvDesc.textContent = "Danger high, protecton is essential.";
    console.log("UV index = High, protecton is essential.");
  } else if (uvIndex >= 8 && uvIndex < 11) {
    uviDisp.className = "has-text-light has-background-danger mb-0";
    uvDesc.textContent = "Danger very high, extra protection is needed.";
    console.log("UV index = Very high, extra protection is needed.");
  } else if (uvIndex >= 11) {
    uviDisp.className = "has-text-light has-background-danger-dark mb-0";
    uvDesc.textContent =
      "Danger extreme, stay indoors from 11am - 3pm if possible.";
    console.log(
      "UV index = Extreme, stay indoors from 11am - 3pm if possible."
    );
  }
}

// if the search is new, push that city name to a generated button, with an onclick listener
// that will call the search onclick function
// neat todo: add a condition that non-city values (query values that don't return data)

function queryEvent() {
  let userInput = $(":input").val();
  let makeBtn = document.createElement("button");

  let cityInput = document.getElementsByName(userInput)[0];

  searchHistory.push(userInput);
  getLatLon(userInput);

  if (cityInput != null) {
    return;
  } else if (!userInput) {
    return;
  } else {
    makeBtn.classList.add("button", "is-fullwidth");
    makeBtn.setAttribute("name", userInput);
    makeBtn.textContent = userInput;
    makeBtn.onclick = searchAgain;
    cityHistory.append(makeBtn);
    $(":input").val("");
  }
}

function searchAgain() {
  $(":input").val(this.name);
  queryEvent();
  $(":input").val("");
}

console.log(searchHistory);

// display searched data to window on click
