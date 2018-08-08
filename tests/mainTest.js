var assert = require('assert');
var path = require('path');
var fs = require('fs');
var Promise = require("es6-promise").Promise;

var BroccoliProcessor = require("../libs/main.js");
var makeBroccoli = require('./helper/makeBroccoli.js');

describe('data.json 構造の再帰検索', function() {

	it("broccoli インスタンス初期化", function(done) {
		this.timeout(10*1000);

		makeBroccoli( {}, function(broccoli){
			// console.log(broccoli.options.documentRoot);
			// console.log(broccoli.realpathHtml);
			// console.log(broccoli.paths_module_template);

			assert.equal(typeof(broccoli.paths_module_template), typeof({}));
			assert.equal(broccoli.paths_module_template.testMod1, path.resolve(__dirname,'testdata/app/modules1/')+'/');
			assert.equal(broccoli.paths_module_template.testMod2, path.resolve(__dirname,'testdata/app/modules2/')+'/');

			done();
		} );
	});

	it("data.json 構造を再帰的に検索する", function(done) {
		this.timeout(10*1000);

		makeBroccoli( {}, function(broccoli){

			var broccoliProcessor = new BroccoliProcessor(broccoli, {});
			broccoliProcessor
				.each(function( editor ){
					// console.log(editor);
					// console.log(editor.resourceMgr);
					var instancePath = editor.getInstancePath();
					// console.log(instancePath);
					var data = editor.getInstance();
					if(data.modId == 'PlainHTMLElements:PlainHTML/HTML'){
						data.fields.main += '<p>replace test</p>';
						var res = editor.resourceMgr.getResourceInfo('d9c95348405663cc16751eddc37d4f37');
						res.fieldNote.test = 1;
						editor.resourceMgr.setResourceInfo('d9c95348405663cc16751eddc37d4f37', res);
					}
					editor.setInstance(data);

					var broccoli = editor.getBroccoli();
					assert.equal(typeof(broccoli), typeof({}));
					var mod = broccoli.getModule('PlainHTMLElements:PlainHTML/HTML');
					assert.equal(typeof(mod), typeof({}));

					editor.log(instancePath);
					editor.log(data);
					editor.log(editor.resourceMgr);
					editor.log([1,2,3]);
					editor.log(120);
					editor.log(false);
					editor.log(null);
					editor.log(undefined);
					editor.done();
				})
				.run(function(logs){
					// console.log(logs);
					assert.ok(logs);
					done();
				})
			;
			return;
		} );
		return;

	});

	it("rebuild option", function(done) {
		this.timeout(10*1000);

		makeBroccoli( {}, function(broccoli){

			var callCount = 0;
			var broccoliProcessor = new BroccoliProcessor(broccoli, {
				// "jsonIndentSize": 4,
				"rebuild": function(callback){
					callCount ++;
					callback(true);
				}
			});
			broccoliProcessor
				.each(function( editor ){
					editor.done();
				})
				.run(function(logs){
					// console.log(logs);
					assert.ok(logs);
					assert.equal(callCount, 1);
					done();
				})
			;
			return;
		} );
		return;

	});

});
