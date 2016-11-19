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
			// console.log(broccoli.options.documentRoot);
			// console.log(broccoli.realpathHtml);
			// console.log(broccoli.paths_module_template);

			var broccoliProcessor = new BroccoliProcessor(broccoli, {});
			broccoliProcessor.each(
				function( data, next ){
					// console.log(data);
					if(data.modId == 'PlainHTMLElements:PlainHTML/HTML'){
						data.fields.main += '<p>replace test</p>';
					}
					next();
				},
				function(result){
					assert.ok(result);

					broccoliProcessor.save(function(result){
						assert.ok(result);
						console.log('finished.');
						done();
					});
					return;
				}
			);
			return;
		} );
		return;

	});
});
