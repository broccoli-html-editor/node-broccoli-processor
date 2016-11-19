/**
 * broccoli-processor/instanceEditor.js
 */
module.exports = function(options){
	var instance = options.instance;

	/** インスタンスデータを取得 */
	this.getInstance = function(){
		return instance;
	}
	/** インスタンスデータをセット */
	this.setInstance = function(val){
		instance = val;
		return true;
	}
	this.done = options.done;
}
