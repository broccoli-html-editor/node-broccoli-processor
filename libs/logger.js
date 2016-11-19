/**
 * broccoli-processor/logger.js
 */
module.exports = function(){
	var logs = {};

	function toString(val, depth){
		depth = depth || 1;
		switch( typeof(val) ){
			case typeof(''):
				return val;break;
			case typeof(true):
			case typeof(0):
				return ''+val;break;
			case typeof(function(){}):
				return '[Function]';break;
			case typeof({}):
				return JSON.stringify(val);break;
			default:
				return ''+val;break;
		}
		return val;
	}

	/** メッセージを記録する */
	this.log = function( instancePath, message ){
		if( !logs[instancePath] ){
			logs[instancePath] = [];
		}
		logs[instancePath].push(toString(message));
		return true;
	}

	/** すべての記録を取得する */
	this.getAll = function(){
		return logs;
	}
}
