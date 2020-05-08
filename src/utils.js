const request = require('request');
const mapBoxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/searchText.json?access_token=pk.eyJ1IjoibGVhcm5ub2RlMDEiLCJhIjoiY2s3dzlzMzNnMDI0NjNlbzRseTh0ZGFyYSJ9.7Ff4xwJ4FcwM9Vm2XC1bIg'
const apiGetURL = 'https://api.darksky.net/forecast/85acfaca0693db4d84ad7c06903b2d63/'
//const resp = require('./response.json');

const tokens = ['4c5372a165f9a1b01f9373d13ad0fa7f','f65ec03113049ccd01b5bf1ff067ac65',
                'ee43d6103b27888de297c5d3b606942b'];
const getLongLatFromMapBox = (locationString, callback) => {
    request({
        uri: mapBoxURL.replace('searchText', encodeURIComponent(locationString)), //use encodeURIComponent instead 
        json: true
    }, (error, {body}) => {
        if(error){
            callback({error: 'Unable to retrieve information, check your connection and try again'}, null)
        }
        else if(body && body.features){
         if(body.features.length && body.features[0])
         callback(null,{
            latitude : body.features[0].center[1],
            longitude : body.features[0].center[0],
            place : body.features[0].place_name
         });
         else
            callback({error:'Please check the location, there is a chance that there is no location'}, null);
    }
    })
}

const myRequestWithJSONResponse = (req, callback) => {
    const lat = req.latitude;
    const long = req.longitude;
    const token = tokens[Math.floor(Math.random() * (tokens.length))];
    const uri = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${token}`;
    request({
        uri:uri,
        json: true
    }, (error, response) => {
        if(error)
        callback({error: error}, null)
        else if (response && response.statusCode=== 200)
            callback(null, response.body);
    })
}

module.exports = {
    getLongLatFromMapBox : getLongLatFromMapBox,
    myRequestWithJSONResponse : myRequestWithJSONResponse
}