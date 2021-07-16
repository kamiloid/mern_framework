const {db_config, serve_config} = require('./conf/config.js');
const {db} = require('./conf/dbconnector.js');
const express = require('express');
var md5 = require('md5');
const app = express();


app.use(express.json());
app.use(express.urlencoded());

app.listen(serve_config._port, () => {
  console.log(`Serve app listening at http://localhost:${serve_config._port}`);
});

db.setup(db_config);
db.connect(()=>
{
	console.log('DB connected!!');
});





app.use('/api', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
 });




app.post('/api', function(req, res)
	{
		if(!db.is_connected()) return;
		let input = req.body;
		if(input.addon == null || input.addon == undefined) return;
		if(input.cmd == null || input.cmd == undefined) return;

		const addon = {};
		addon[input.addon] = require('./addons/'+input.addon+'.js');
		let mod = addon[input.addon][input.addon];
		if(mod[input.cmd] == null || mod[input.cmd] == undefined) return;
		const args = {
			i: input.args,
			o: {},
			db: db.public(),
			md5: md5
		};
		mod[input.cmd](args).then(output=>
			{
				res.send(output);
			});
	});
