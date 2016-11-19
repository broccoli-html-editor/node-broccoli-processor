/**
 * broccoli-processor
 */
module.exports = function(broccoli, options){
	var broccoliProcessor = this;
	var fs = require('fs');
	var Promise = require("es6-promise").Promise;
	var it79 = require('iterate79');
	this.broccoli = broccoli;
	this.options = options;

	this.dataJson = fs.readFileSync(broccoli.realpathDataDir+'/data.json').toString();
	this.dataJson = JSON.parse(this.dataJson);

	var commands = [];

	/**
	 * 再帰処理
	 */
	function instanceProcessRecursive( each, row, idx, callback ){
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
									instanceProcessRecursive(
										each,
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

	/**
	 * すべてのインスタンスを再帰的に処理する
	 */
	this.each = function(each){
		commands.push({
			'method': 'each',
			'content': each
		});
		return this;
	}

	/**
	 * リクエストを実行
	 */
	function executeAll(callback){
		it79.ary(
			commands,
			function( it1, row1, idx1 ){
				switch(row1.method){
					case 'each':
						it79.ary(
							broccoliProcessor.dataJson,
							function( it2, row2, idx2 ){
								it79.ary(
									row2,
									function( it3, row3, idx3 ){
										// console.log(row3, idx3);
										instanceProcessRecursive(
											row1.content,
											row3, idx3,
											function(){
												it3.next();
											}
										);
									},
									function(){
										it2.next();
									}
								);
							},
							function(){
								it1.next();
								return;
							}
						);
						break;
					default:
						console.error('unknown method', row1.method);
						it1.next();
						break;
				}
			},
			function(){
				callback();
				return;
			}
		);
		return;
	}

	/**
	 * 変更した結果を保存してリビルド
	 */
	this.run = function(callback){
		callback = callback || function(){};

		executeAll(function(){
			var jsonString = JSON.stringify(broccoliProcessor.dataJson, null, 1);

			// データを保存してリビルド
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
		});

		return this;
	}

}
