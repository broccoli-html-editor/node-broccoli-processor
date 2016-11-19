/**
 * broccoli-processor/instanceEditor.js
 */
module.exports = function(instancePath, resourceMgr, done){
	var instance = {};
	this.resourceMgr = resourceMgr;

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
	this.done = done;
}
