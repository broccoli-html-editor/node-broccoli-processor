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

	this.dataJson = fs.readFileSync(broccoli.realpathDataDir+'/data.json').toString();
	this.dataJson = JSON.parse(this.dataJson);

	/**
	 * すべてのインスタンスを再帰的に処理する
	 */
	this.each = function(each, callback){
		callback = callback || function(){console.error('callback was not given.');};
		// console.log(this.options);

		function instanceProcess( row, idx, callback ){
			callback = callback || function(){console.error('callback was not given.');};

			var modId = row.modId;
			var subModName = row.subModName;
			broccoli.getModule( modId, subModName, function(mod){
				// console.log(mod);
				each(row, function(){

					it79.ary(
						row.fields,
						function( it1, childFields, childsIdx ){
							// console.log(childsIdx);
							// console.log(childFields, childsIdx);
							it79.ary(
								childFields,
								function( it2, childField, childIdx ){
									// console.log(childField);
									// console.log(childField, childIdx);
									// console.log(childField.modId);
									// console.log(childIdx);
									if( childField.modId !== undefined && childField.fields !== undefined ){
										instanceProcess(
											childField, childIdx,
											function(){
												it2.next();
											}
										);
										return;
									}
									it2.next();
								},
								function(){
									it1.next();
								}
							);
						},
						function(){
							callback();
						}
					);
				});

			} );
		}

		it79.ary(
			this.dataJson,
			function( it1, row, idx ){
				it79.ary(
					row,
					function( it2, row2, idx2 ){
						// console.log(row2, idx2);
						instanceProcess(
							row2, idx2,
							function(){
								it2.next();
							}
						);
					},
					function(){
						it1.next();
					}
				);
			},
			function(){
				callback(true);
				return;
			}
		);

		return;
	}


	/**
	 * 変更した結果を保存してリビルド
	 */
	this.save = function(callback){
		callback = callback || function(){};
		var jsonString = JSON.stringify(this.dataJson, null, 1);

		fs.writeFile(
			broccoli.realpathDataDir+'/data.json' ,
			jsonString ,
			function(){
				broccoli.updateContents(function(result){
					callback(result);
					return;
				});
			}
		);

		return;
	}

}
