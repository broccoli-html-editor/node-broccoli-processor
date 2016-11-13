/**
 * broccoli.js
 */
module.exports = function(){
	var makeBroccoli = require('../../../../helper/makeBroccoli.js');

	return function(req, res, next){
		console.log(req.body);
		var page_path = req.body.page_path;
		var page_path_trimext = page_path.replace(/\.[a-zA-Z0-9]+$/, '');
		// console.log(page_path);
		// console.log(page_path_trimext);

		makeBroccoli(
			{
				"page_path": page_path
			},
			function(broccoli){
				broccoli.gpi(
					JSON.parse(req.body.api),
					JSON.parse(req.body.options),
					function(value){
						res
							.status(200)
							.set('Content-Type', 'text/json')
							.send( JSON.stringify(value) )
							.end();
					}
				);
			}
		);

		return;
	}

}
