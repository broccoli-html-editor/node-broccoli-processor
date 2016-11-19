/**
 * broccoli-processor/resourceMgr.js
 */
module.exports = function(broccoli){
	var _dataJsonPath = require('path').resolve( broccoli.realpathDataDir, 'data.json' );
	var _resourcesDirPath = require('path').resolve(broccoli.realpathDataDir, 'resources/')+'/';
	var _resourcesPublishDirPath = broccoli.realpathResourceDir;
	var _resourceDb = {};
	var fs = require('fs');
	var Promise = require('es6-promise').Promise;
	var utils79 = require('utils79');

	if(utils79.is_dir(_resourcesDirPath)){
		var list = fs.readdirSync( _resourcesDirPath );
		for( var idx in list ){
			var resKey = list[idx];
			if( !utils79.is_dir( _resourcesDirPath+'/'+resKey ) ){ continue; }
			_resourceDb[resKey] = {};
			if( utils79.is_file( _resourcesDirPath+'/'+resKey+'/res.json' ) ){
				var jsonStr = fs.readFileSync( _resourcesDirPath+'/'+resKey+'/res.json' );
				try {
					_resourceDb[resKey] = JSON.parse( jsonStr );
				} catch (e) {
					_resourceDb[resKey] = {};
				}
			}
		}
	}

	/** リソースデータ全体を取得 */
	this.getResourceDb = function(){
		return _resourceDb;
	}

	/** リソースデータを取得 */
	this.getResourceInfo = function(resKey){
		if( !_resourceDb[resKey] ){ return false; }
		return _resourceDb[resKey];
	}

	/** リソースデータを更新 */
	this.setResourceInfo = function(resKey, resourceInfo){
		_resourceDb[resKey] = resourceInfo;
		return true;
	}

}
