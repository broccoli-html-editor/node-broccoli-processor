/**
 * broccoli-processor
 */
module.exports = function(broccoli, options){
	var _this = this;
	var fs = require('fs');
	var Promise = require("es6-promise").Promise;
	var it79 = require('iterate79');
	this.broccoli = broccoli;
	this.options = options;

	/**
	 * すべてのインスタンスを再帰的に処理する
	 */
	this.each = function(each, callback){
		callback = callback || function(){};
		// console.log(this.options);
		var json = fs.readFileSync(this.broccoli.realpathDataDir+'/data.json').toString();
		json = JSON.parse(json);
		console.log(json);

		function instanceProcess( row, idx, callback ){
			console.log(row);
			console.log(idx);

			each(row, function(){

				it79.ary(
					row.fields,
					function( it1, childFields, childsIdx ){
						it79.ary(
							childFields,
							function( it2, childField, childIdx ){

								instanceProcess(
									childField, childIdx,
									function(){
										it2.next();
									}
								);
							},
							function(){
								callback();
							}
						);
					},
					function(){
						callback();
					}
				);
			});

		}

		it79.ary(
			json,
			function( it1, row, idx ){
				it79.ary(
					row,
					function( it2, row2, idx2 ){
						instanceProcess(
							row2, idx2,
							function(){
								it2.next();
							}
						);
					},
					function(){
						callback();
					}
				);
			},
			function(){
				callback();
			}
		);

		return;
	}

}
