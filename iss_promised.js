const request = require('request-promise-native');


//function to fetch ip
const fetchMyIP = function() {
    return request('https://api.ipify.org?format=json');
};
 
const fetchCoordsByIP = function(body) {
  
    const ip = JSON.parse(body).ip;
    
    return request(`https://ipvigilante.com/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {

    let { latitude, longitude } = JSON.parse(body).data;
    let url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
    return request(url);
};

const nextISSTimesForMyLocation = function() {
    return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
        let {response} = JSON.parse(data);
      
        return response;
    });
}


module.exports = { nextISSTimesForMyLocation}; 
  