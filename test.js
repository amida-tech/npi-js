var npi = require('./index');

var testObj = {
  'name':[
    {
      'last':'DENNIS',
      'first':'HARRY'
    }
  ],
  'address':[
    {
      'zip':'940406203'
    }
  ]
};

npi.find.getNPI(testObj,function(err, results) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(results, null, 4));
  }
  npi.find.getData(1073624029, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log(JSON.stringify(results, null, 4));
    }
  });
});
