var bloomjs = require('bloom-js');
var async = require('async');

var bloomClient = new bloomjs.Client();

function buildSearchArray(perfObj, callback) {
    var searchArr = [];
    if (perfObj.name != null) {
        if (perfObj.name[0].last != null && perfObj.name[0].first != null) {
            if (perfObj.address != null) {
                if (perfObj.address[0].zip != null) {
                    searchArr.push({
                        'last_name': {
                            'eq': perfObj.name[0].last
                        },
                        'first_name': {
                            'eq': perfObj.name[0].first
                        },
                        'practice_address.zip': {
                            'prefix': perfObj.address[0].zip
                        }
                    });
                    searchArr.push({
                        'last_name': {
                            'eq': perfObj.name[0].last
                        },
                        'practice_address.zip': {
                            'prefix': perfObj.address[0].zip
                        }
                    });
                }
                searchArr.push({
                    'last_name': {
                        'eq': perfObj.name[0].last
                    },
                    'first_name': {
                        'eq': perfObj.name[0].first
                    }
                });
            }
        }
    }
    console.log(searchArr);
    callback(searchArr);
}

function getNPI(perfObj, callback) {
    //do some stuff

    //add in a check to see if they already have an NPI
    var check = true;
    var bloomRes = [];
    buildSearchArray(perfObj, function(searchArr) {
        async.eachSeries(searchArr, function(searchObj, cb) {
            console.log("search: " + JSON.stringify(searchObj, null, 4));
            if (check) {
                bloomClient.search('usgov.hhs.npi', searchObj, {
                    'offset': 0, //debug
                    'limit': 10 //debug
                }, function(error, response) {
                    if (error) return console.log(error.stack);
                    console.log("response: " + JSON.stringify(response, null, 4));
                    if (response.length > 0) {
                        check = false;
                        bloomRes = response;
                    }
                    cb();
                });
            } else {
                cb();
            }
        }, function(err) {
            if (bloomRes.length > 0) {
                callback(null, bloomRes);
            } else {
                callback("no matches found", perfObj);
            }
        });
    });
}

function getData(perfObj, callback) {
    //add in something to see if there is additional data for provider that already has an NPI
    //if no npi, getNPI
    callback(null, perfObj);
}

module.exports.getNPI = getNPI;
module.exports.getData = getData;

/*
bloomClient.search('usgov.hhs.npi', {
'last_name':{
    'eq':'DENNIS'
},
'first_name':{
    'eq':'HANK'
},
'practice_address.zip':{
    'prefix':'44718'
}
}, {
'offset': 0,
'limit': 10
}, function(error, response) {
if (error) return console.log(error.stack);
console.dir(response);
});

var testObj = {
last_name:'DENNIS',
first_name:'LAURIE'
}

var searchObj = {};

for (var prop in testObj) {
searchObj[prop] = {'eq':testObj[prop]};
}

bloomClient.search('usgov.hhs.npi', searchObj, {
'offset': 0,
'limit': 10
}, function(error, response) {
if (error) return console.log(error.stack);
console.dir(response);
});

bloomClient.search('nucc.hcpt',{
'code': {
    'eq':'207RG0100X'
}
},function(error,response){
if (error) return console.log(error.stack);
console.dir(response);
});
*/
