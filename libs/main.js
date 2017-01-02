/**
 * broccoli-processor
 */
module.exports = function(broccoli, options){
	var broccoliProcessor = this;
	var fs = require('fs');
	var Promise = require("es6-promise").Promise;
	var it79 = require('iterate79');
	var resourceMgr = new (require('./resourceMgr.js'))(broccoli);
	var InstanceEditor = require('./instanceEditor.js');
	var logger = new(require('./logger.js'))();
	this.broccoli = broccoli;
	this.options = options;

	this.dataJson = fs.readFileSync(broccoli.realpathDataDir+'/data.json').toString();
	this.dataJson = JSON.parse(this.dataJson);

	var commands = [];

	/**
	 * 再帰処理
	 */
	function instanceProcessRecursive( instancePath, each, row, idx, callback ){
		callback = callback || function(){console.error('callback was not given.');};

		var modId = row.modId;
		var subModName = row.subModName;

		var instanceEditor = new InstanceEditor(
			broccoli ,
			instancePath ,
			resourceMgr ,
			logger ,
			function(){
				row = instanceEditor.getInstance();

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
										instancePath+'/fields.'+childsIdx+'@'+childIdx,
										each,
										childField, childIdx,
										function(result){
											childField = result;
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
						callback(row);
					}
				);
			}
		);
		instanceEditor.setInstance(row);

		each(instanceEditor);
		return;
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
											'/bowl.'+idx3,
											row1.content,
											row3, idx3,
											function(result){
												row3 = result;
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
				commands = []; // reset
				callback();
				return;
			}
		);
		return;
	}

	/**
	 * 変更を実行するが、保存はしない
	 */
	this.dryrun = function(callback){
		callback = callback || function(){};

		executeAll(function(){
			callback( logger.getAll() );
		});

		return this;
	}

	/**
	 * 変更を実行し、結果を保存してリビルド
	 */
	this.run = function(callback){
		callback = callback || function(){};

		this.dryrun(function( logs ){

			// 加工されたデータを保存してリビルド
			var jsonString = JSON.stringify(broccoliProcessor.dataJson, null, 1);
			fs.writeFile(
				broccoli.realpathDataDir+'/data.json' ,
				jsonString ,
				function(){
					var resourceDb = resourceMgr.getResourceDb();
					broccoli.resourceMgr.save(
						resourceDb ,
						function(result){
							broccoli.updateContents(function(result){
								callback( logger.getAll() );
								return;
							});
						}
					);
				}
			);

		});

		return this;
	}

}
