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

      fiveDayForecast(foundLat, foundLon)
    })
    .catch((error) => console.log(error));
}

function fiveDayForecast(foundLat, foundLon) {

  const apiKey = "d3c11a611952a564411087138723b6e9";
  const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${foundLat}&lon=${foundLon}&units=imperial&appid=${apiKey}`
  fetch(api)
  .then((res) => {
    return res.json();
  })
  .then((response) => {

    console.log(response)

    const element = document.querySelectorAll(".forecastDay")
    
    for (i = 0; i < element.length; i++) {
      element[i].innerHTML = "";

      const index = i * 8 + 4;
      const daily = new Date(response.list[index].dt * 1000);
      const day = daily.getDate();
      const month = daily.getMonth() + 1;
      const year = daily.getFullYear();

      const dateEl = document.createElement("p");
      dateEl.setAttribute("class", "forecast-date");
      dateEl.innerHTML = month + "/" + day + "/" + year;
      element[i].append(dateEl);

      // Icon for current weather
      const imageWrap = document.createElement("figure")
      imageWrap.setAttribute("class", "image is-64x64")
      element[i].append(imageWrap)

      const imgUrl = "https://openweathermap.org/img/wn/" + response.list[index].weather[0].icon + ".png"

      const imageEl = document.createElement("img")
      imageEl.setAttribute("src", imgUrl);
      imageEl.setAttribute("alt", response.list[index].weather[0].description);

      imageWrap.append(imageEl)

      const tempEl = document.createElement("p");
      tempEl.innerHTML = "Day temp: " + response.list[index].main.temp + "\u00B0 F";
      element[i].append(tempEl);

      // const nightEl = document.createElement("p");
      // nightEl.innerHTML = "Night temp: " + response.list[index].main.humidity + "\u00B0 F";
      // element[i].append(nightEl);

      const humidEl = document.createElement("p");
      humidEl.innerHTML = "Humidity: " + response.list[index].main.humidity + "%";
      element[i].append(humidEl);

      const windEl = document.createElement("p");
      windEl.innerHTML = "Wind Speed: " + response.list[index].wind.speed + " MPH";
      element[i].append(windEl);

  }
    
  })
  .catch((error) => console.log(error)
  )}

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
