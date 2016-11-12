/**
 * GETパラメータをパースする
 */
function cont_parseUriParam(url){
	var paramsArray = [];
	parameters = url.split("?");
	if( parameters.length > 1 ) {
		var params = parameters[1].split("&");
		for ( var i = 0; i < params.length; i++ ) {
			var paramItem = params[i].split("=");
			for( var i2 in paramItem ){
				paramItem[i2] = decodeURIComponent( paramItem[i2] );
			}
			paramsArray.push( paramItem[0] );
			paramsArray[paramItem[0]] = paramItem[1];
		}
	}
	return paramsArray;
}

$(window).on('load', function(){

	var param = cont_parseUriParam( window.location.href );
	param.page_path = param.page_path || '/test1/test1.html';
	console.log(param);

	$('select[name=page_path]')
		.val(param.page_path)
		.on('change', function(){
			var $this = $(this);
			window.location.href = '?page_path='+$this.val();
		})
	;
	$('#canvas').attr({
		'data-broccoli-preview': 'http://127.0.0.1:8081'+param.page_path
	});


	var broccoli = new Broccoli();
	broccoli.init(
		{
			'elmCanvas': document.getElementById('canvas'),
			'elmModulePalette': document.getElementById('palette'),
			'elmInstanceTreeView': document.getElementById('instanceTreeView'),
			'elmInstancePathView': document.getElementById('instancePathView'),
			'contents_area_selector': '[data-contents]',
				// ↑編集可能領域を探すためのクエリを設定します。
				// 　この例では、data-contents属性が付いている要素が編集可能領域として認識されます。
			'contents_bowl_name_by': 'data-contents',
				// ↑bowlの名称を、data-contents属性値から取得します。
			'customFields': {
				'custom1': function(broccoli){
					// カスタムフィールドを実装します。
					// この関数は、fieldBase.js を基底クラスとして継承します。
					// customFields オブジェクトのキー(ここでは custom1)が、フィールドの名称になります。
				}
			},
			'gpiBridge': function(api, options, callback){
				// GPI(General Purpose Interface) Bridge
				// broccoliは、バックグラウンドで様々なデータ通信を行います。
				// GPIは、これらのデータ通信を行うための汎用的なAPIです。
				$.ajax({
					"url": "/apis/broccoli",
					"type": 'post',
					'data': {
						'page_path': param.page_path,
						'api': JSON.stringify(api) ,
						'options': JSON.stringify(options)
					},
					"success": function(data){
						// console.log(data);
						callback(data);
					}
				});
				return;
			},
			'onClickContentsLink': function( uri, data ){
				alert(uri + ' へ移動');
				console.log(data);
				return false;
			},
			'onMessage': function( message ){
				// ユーザーへ知らせるメッセージを表示する
				console.info('message: '+message);
			}
		} ,
		function(){
			// 初期化が完了すると呼びだされるコールバック関数です。

			$(window).on('resize', function(){
				// このメソッドは、canvasの再描画を行います。
				// ウィンドウサイズが変更された際に、UIを再描画するよう命令しています。
				broccoli.redraw();
			});

		}
	);
});
