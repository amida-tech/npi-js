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

npi.find.getNPI(testObj,function(err,perfObj,results) {
	if (err) {
		console.log(err);
	} else {
		console.log("Here" + JSON.stringify(results,null,4));
	}
});