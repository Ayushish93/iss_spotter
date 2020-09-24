const request = require('request');

//function to fetch ip address
const fetchMyIP = function(callback) {

// use request to fetch IP address from JSON API
request('https://api.ipify.org?format=json',(error,response,body) => {
        
if (error) {
    return callback(error, null);
}
// if non-200 status, assume server error
if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(msg, null);
    return;
}

let data = JSON.parse(body).ip;        // fetching Ip from body object
       
return callback(null,data);

});

}

// fetching geo coordinates
const fetchCoordsByIP = function(ip,callback) {
    
    request(`https://ipvigilante.com/${ip}`,(error,response,body) => {

        if(error) return callback(error,null);
        if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching coordinates for IP Response: ${body}`;
            
            return callback(msg, null);
        }

        let data = JSON.parse(body);
        let latitude = data['data']['latitude'];
        let longitude = data['data']['longitude'];
        let obj = {latitude,longitude};
        return callback(null,obj);
        
    })
}

// function to fetch flyovertime
const fetchISSFlyOverTimes = function(coords, callback) {
    
    let lat = coords['latitude'];
    let lon = coords['longitude'];
    request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`,(error,response,body) => {

    if(error) return callback(error,null);
    if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching coordinates for  Response: ${body}`;
        return callback(msg, null);
    }

    let data = JSON.parse(body).response;
    return callback(null,data);


    });
  };
// calling all functions in this function
  const nextISSTimesForMyLocation = function(callback) {
    
    fetchMyIP((error, ip) => {
        if (error) {
          return callback(error, null);
        }
    
        fetchCoordsByIP(ip, (error, loc) => {
          if (error) {
            return callback(error, null);
          }
    
            fetchISSFlyOverTimes(loc, (error, nextPasses) => {
                if (error) {
                    return callback(error, null);
                }
    
            callback(null, nextPasses);
          });
        });
      });
    };


  
  module.exports = { nextISSTimesForMyLocation};