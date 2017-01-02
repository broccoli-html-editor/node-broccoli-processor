/**
 * broccoli-processor/instanceEditor.js
 */
module.exports = function(broccoli, instancePath, resourceMgr, logger, done){
	this.supply = {};
	this.supply.cheerio = require('cheerio');
	this.supply.iterate79 = require('iterate79');

	var instance = {};
	this.resourceMgr = resourceMgr;

	/** broccoli-html-editor インスタンスを取得 */
	this.getBroccoli = function(){
		return broccoli;
	}
	/** インスタンスパスを取得 */
	this.getInstancePath = function(){
		return instancePath;
	}
	/** インスタンスデータを取得 */
	this.getInstance = function(){
		return instance;
	}
	/** インスタンスデータをセット */
	this.setInstance = function(val){
		instance = val;
		return true;
	}
	/** ログを記録 */
	this.log = function(val){
		return logger.log( instancePath, val );
	}
	/** インスタンスの編集終了を宣言する */
	this.done = done;
}
