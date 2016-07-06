var assert = require('assert');
var path = require('path');
var fs = require('fs');
var Promise = require("es6-promise").Promise;

var BroccoliProcessor = require("../libs/main.js");

describe('再帰検索のテスト', function() {

	it("再帰的に検索する", function(done) {
		this.timeout(60*1000);

		var broccoliProcessor = new BroccoliProcessor({
			'paths_module_template': {},
			'documentRoot': path.resolve(__dirname, 'testdata/page1/')+'/',
			'pathHtml': '/page1.html',
			'pathResourceDir': '/page1_files/resources/',
			'realpathDataDir': path.resolve(__dirname, 'testdata/page1/page1_files/guieditor.ignore/')+'/'
		});
		broccoliProcessor.each(
			function( data, next ){
				console.log(data);
				next();
			},
			function(){
				console.log('finished.');
				assert.equal(1, 1);
			}
		);

		done();
	});
});
