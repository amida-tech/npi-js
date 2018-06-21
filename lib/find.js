var async = require('async');
var request = require('request');

var npiBaseUrl = 'https://npiregistry.cms.hhs.gov/api/resultsDemo2/';

function hhsNpiQuery(query, callback) {
    request.get(npiBaseUrl, {
        json: true,
        qs: query
    }, function (err, response, body) {
        if (err) return callback(err);
        return callback(null, body.results);
    });
}

function buildSearchArray(perfObj, callback) {
    var searchArr = [];
    async.series([function(cb) {
        if (perfObj.name != null) {
            if (perfObj.name[0].last != null) {
                if (perfObj.address != null) {
                    if (perfObj.address[0].zip != null) {
                        if (perfObj.name[0].first != null) {
                            if (perfObj.address[0].state) {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first,
                                    'postal_code': perfObj.address[0].zip,
                                    'state': perfObj.address[0].state
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first,
                                    'postal_code': perfObj.address[0].zip
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first,
                                    'state': perfObj.address[0].state
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first
                                });
                                cb();
                            } else {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first,
                                    'postal_code': perfObj.address[0].zip
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first
                                });
                                cb();
                            }
                        } else {
                            if (perfObj.address[0].state) {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'postal_code': perfObj.address[0].zip,
                                    'state': perfObj.address[0].state
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'postal_code': perfObj.address[0].zip
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'state': perfObj.address[0].state
                                });
                                cb();
                            } else {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'postal_code': perfObj.address[0].zip
                                });
                                cb();
                            }
                        }
                    } else {
                        if (perfObj.name[0].first != null) {
                            if (perfObj.address[0].state) {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first,
                                    'state': perfObj.address[0].state
                                });
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first
                                });
                                cb();
                            } else {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'first_name': perfObj.name[0].first
                                });
                                cb();
                            }
                        } else {
                            if (perfObj.address[0].state) {
                                searchArr.push({
                                    'last_name': perfObj.name[0].last,
                                    'state': perfObj.address[0].state
                                });
                                cb();
                            } else {
                                cb();
                            }
                        }
                    }
                } else {
                    if (perfObj.name[0].first != null) {
                        searchArr.push({
                            'last_name': perfObj.name[0].last,
                            'first_name': perfObj.name[0].first
                        });
                        cb();
                    } else {
                        cb();
                    }
                }
            } else {
                cb();
            }
        } else {
            cb();
        }
    }, function(cb) {
        cb();
    }], function(err, results) {
        callback(searchArr);
    });
}

function getNPI(perfObj, callback) {
    //do some stuff

    //add in a check to see if they already have an NPI
    var check = true;
    var res = [];
    buildSearchArray(perfObj, function(searchArr) {
        async.eachSeries(searchArr, function(searchObj, cb) {
            if (check) {
                hhsNpiQuery(searchObj, function(error, response) {
                    if (error) return console.log(error);
                    if (response.length > 0) {
                        check = false;
                        res = response;
                    }
                    cb();
                });
            } else {
                cb();
            }
        }, function(err) {
            if (res.length > 0) {
                callback(null, res);
            } else {
                callback("no matches found", perfObj);
            }
        });
    });
}

function getPagedNPI(perfObj, limit, offset, callback) {
    if (callback === null) {
        callback = offset;
        offset = 0;
    }

    //add in a check to see if they already have an NPI
    var check = true;
    var res = [];
    buildSearchArray(perfObj, function(searchArr) {
        async.eachSeries(searchArr, function(searchObj, cb) {
            if (check) {
                hhsNpiQuery(Object.assign({}, searchObj, { limit, offset }), function(error, response) {
                    if (error) return console.log(error);
                    if (response.length > 0) {
                        check = false;
                        res = response;
                    }
                    cb();
                });
            } else {
                cb();
            }
        }, function(err) {
            if (res.length > 0) {
                callback(null, res);
            } else {
                callback("no matches found", perfObj);
            }
        });
    });
}

function getData(npi, callback) {
  return hhsNpiQuery({ number: npi }, callback);
}

module.exports.getNPI = getNPI;
module.exports.getPagedNPI = getPagedNPI;
module.exports.getData = getData;
