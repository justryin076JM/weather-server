console.log('Testing javascript')


const weatherForm = document.querySelector('form'); //provides access to first match, in this case first form
const errorPara = document.getElementById('errorPara');

function toCelcius(kelvin) {
    return Math.round((kelvin - 273.15) * 100) / 100;
}

function toFahrenheit(kelvin) {
    return Math.round(((kelvin - 273.15) * 1.8000 + 32.00) * 100) / 100;
}

function degToCompass(num) {
    val = Math.round(num / 22.5)
    arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    return arr[(val % 16)];
}

function patchCurrent(current) {
    document.getElementById('current').style.display = 'flex';
    const dayImageId = current.weather ? (current.weather.length ? (current.weather[0] ? (current.weather[0].icon) : null) : null) : null;
    if (dayImageId)
        document.getElementById('currentImage').src = "https://openweathermap.org/img/wn/" + dayImageId + "@2x.png";
    document.getElementById('currentDate').textContent = (new Date(current.dt * 1000)).toDateString();
    document.getElementById('sunrise').textContent = (new Date(current.sunrise * 1000)).toLocaleTimeString();
    document.getElementById('sunset').textContent = (new Date(current.sunset * 1000)).toLocaleTimeString();
    document.getElementById('temp').innerHTML = "<span style='color:red;font-weight:bolder'>" + toFahrenheit(current.temp)
        + "</span>&#8457; / <span style='color:green;font-weight:bolder'>" + toCelcius(current.temp) + "</span>&#8451;";
    document.getElementById('feels').innerHTML = "<span style='color:red;font-weight:bolder'>" + toFahrenheit(current.feels_like)
        + "</span>&#8457; / <span style='color:green;font-weight:bolder'>" + toCelcius(current.feels_like) + "</span>&#8451;";
    document.getElementById('pressure').textContent = current.pressure;
    document.getElementById('humidity').textContent = current.humidity;
    document.getElementById('clouds').textContent = current.clouds;
    document.getElementById('winds').textContent = current.wind_speed + ' m/s ' + degToCompass(current.wind_deg);
}

function patchHour(item, pos) {
    document.getElementById('hour' + pos + 'details').innerHTML ="<p> " + (new Date(item.dt*1000)).toLocaleDateString() + ", " + (new Date(item.dt*1000)).toLocaleTimeString()
    + " </p><p> Temp: <span style='color:#FF9933'>" + toFahrenheit(item.temp) + "</span>&#8457; / <span style='color:#138808'>" + toCelcius(item.temp)
    + "</span>&#8451;</p><p> Feels: <span style='color:#FF9933'>" + toFahrenheit(item.temp) + "</span>&#8457; / <span style='color:#138808'>" + toCelcius(item.temp)
    + "</span>&#8451;</p><p> Clouds: " + item.clouds + " %  </p><p> Humidity: " + item.humidity + " % </p><p> Wind: "
    +  item.wind_speed + " m/s " + degToCompass(item.wind_deg) + "</p>"
}

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const search = document.querySelector('input').value;
    fetch("/weather?address=" + search).then(res => {
        res.json().then((data) => {
            if (data.current)
                patchCurrent(data.current);
            if (data.hourly && Array.isArray(data.hourly) && data.hourly.length)
                data.hourly.forEach((item, index) => patchHour(item, index+1));
            if (data.daily && Array.isArray(data.daily) && data.daily.length) {
                document.getElementById('dailyCards').style.display = 'flex';
                for (let i = 1; i <= 8; i++) {
                    document.getElementById('dayCard' + i).style.display = 'none';
                }
                data.daily.forEach((item, index) => {
                    const number = index + 1;
                    document.getElementById('dayCard' + number).style.display = 'block';
                    document.getElementById('dayTitle' + number).textContent = (new Date(item.dt * 1000)).toDateString();
                    const imgid = item.weather ? (item.weather.length ? (item.weather[0] ? (item.weather[0].icon) : null) : null) : null;
                    if (imgid)
                        document.getElementById('dayImage' + number).src = "https://openweathermap.org/img/wn/" + imgid + "@2x.png";
                    document.getElementById('dayText' + number).innerHTML = "<p> Day: " + toFahrenheit(item.temp.day) + "&#8457; / " + toCelcius(item.temp.day)
                        + "&#8451;</p><p> Eve: " + toFahrenheit(item.temp.eve) + "&#8457; / " + toCelcius(item.temp.eve)
                        + "&#8451;</p><p> Max: " + toFahrenheit(item.temp.max) + "&#8457; / " + toCelcius(item.temp.max)
                        + "&#8451;</p><p> Min: " + toFahrenheit(item.temp.min) + "&#8457; / " + toCelcius(item.temp.min)
                        + "&#8451;</p><p> Morn: " + toFahrenheit(item.temp.morn) + "&#8457; / " + toCelcius(item.temp.morn)
                        + "&#8451;</p><p> Night: " + toFahrenheit(item.temp.night) + "&#8457; / " + toCelcius(item.temp.night) + "&#8451;</p>"
                });
            }
            if (data.error) {
                errorPara.innerHTML = data.error;
                document.getElementById('errorDiv').style.display = 'block';                
                document.getElementById('dailyCards').style.display = 'none';
                document.getElementById('current').style.display = 'none';
            }
            else{
                document.getElementById('errorDiv').style.display = 'none';  
            }
        })
    })
})