var bloomjs = require('bloom-js');
var async = require('async');

var bloomClient = new bloomjs.Client();

function getNPI(perfObj, callback) {
    //do some stuff
    var searchArr = [];
    var bloomObj = {};
    var bloomResults = [];
    async.series([function (cb) {
                if (perfObj.name !== null) {
                    if (perfObj.name[0].last !== null && perfObj.name[0].first !== null) {
                        if (perfObj.address !== null) {
                            if (perfObj.address[0].zip !== null) {
                                searchArr.push({
                                    'last_name': {
                                        'eq': perfObj.name[0].last
                                    },
                                    'first_name': {
                                        'eq': perfObj.name[0].first
                                    },
                                    'zip': {
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
                cb();
            },
            function (cb) {
                console.log('search array:');
                console.dir(searchArr);
                cb();
            },
            function (cb) {
                var check = true;
                if (searchArr.length > 0) {
                    async.each(searchArr, function (searchObj, cb2) {
                        if (check) {
                            bloomClient.search('usgov.hhs.npi', searchObj, {
                                'offset': 0, //debug
                                'limit': 10 //debug
                            }, function (error, response) {
                                if (error) return console.log(error.stack);
                                console.log("Search Object");
                                console.dir(searchObj);
                                console.log("Response length: " + response.length);
                                console.dir(response);
                                console.log("End Response");
                                if (response.length > 0) {
                                    check = false;
                                }
                                cb2();
                            });
                        } else {
                            cb2();
                        }

                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        cb();
                    });
                } else {
                    cb();
                }
            }
        ],
        function (err, results) {
            callback(null, perfObj);
        });
}

module.exports.getNPI = getNPI;

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