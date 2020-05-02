const request = require('request');
const mapBoxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/searchText.json?access_token=pk.eyJ1IjoibGVhcm5ub2RlMDEiLCJhIjoiY2s3dzlzMzNnMDI0NjNlbzRseTh0ZGFyYSJ9.7Ff4xwJ4FcwM9Vm2XC1bIg'
const apiGetURL = 'https://api.darksky.net/forecast/85acfaca0693db4d84ad7c06903b2d63/'

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
    console.log(req.place)
    request({
        uri:apiGetURL+req.latitude+','+req.longitude,
        json: true
    }, (error, response) => {
        if(response && response.error)
        callback({error: response.error}, null)
        else if (response && response.body && response.body.currently)
            callback(null, response.body.currently);
    })
}

module.exports = {
    getLongLatFromMapBox : getLongLatFromMapBox,
    myRequestWithJSONResponse : myRequestWithJSONResponse
}