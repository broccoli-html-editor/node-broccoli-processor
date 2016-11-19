/**
 * broccoli-processor/instanceEditor.js
 */
module.exports = function(resourceMgr, done){
	var instance = {};
	this.resourceMgr = resourceMgr;

	/** インスタンスデータを取得 */
	this.getInstance = function(){
		return instance;
	}
	/** インスタンスデータをセット */
	this.setInstance = function(val){
		instance = val;
		return true;
	}
	this.done = done;
}
