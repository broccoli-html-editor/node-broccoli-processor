/**
 * makeBroccoli.js
 */
module.exports = function( options, callback ){
	callback = callback || function(){};
	options = options || {};
	options.page_path = options.page_path || '/test1/test1.html';
	options.paths_module_template = options.paths_module_template || {
		'PlainHTMLElements': require('path').resolve(__dirname, '../testdata/app/PlainHTMLElements/') ,
		'testMod1': require('path').resolve(__dirname, '../testdata/app/modules1/') ,
		'testMod2': require('path').resolve(__dirname, '../testdata/app/modules2/')
	};

	var page_path_trimext = options.page_path.replace(/\.[a-zA-Z0-9]+$/, '');


	var Broccoli = require('broccoli-html-editor');
	var broccoli = new Broccoli();

	// 初期化を実行してください。
	broccoli.init(
		{
			'appMode': 'web', // 'web' or 'desktop'. default to 'web'
			'paths_module_template':  options.paths_module_template,
			'documentRoot': require('path').resolve(__dirname, '../testdata/htdocs/'), // realpath
			'pathHtml': options.page_path,
			'pathResourceDir': page_path_trimext+'_files/resources/',
			'realpathDataDir':  require('path').resolve(__dirname, '../testdata/htdocs'+page_path_trimext+'_files/guieditor.ignore/'),
			'customFields': {
				'custom1': function(broccoli){
					// カスタムフィールドを実装します。
					// この関数は、fieldBase.js を基底クラスとして継承します。
					// customFields オブジェクトのキー(ここでは custom1)が、フィールドの名称になります。
				}
			} ,
			'bindTemplate': function(htmls, callback){
				var fin = '';
				fin += '<!DOCTYPE html>'+"\n";
				fin += '<html>'+"\n";
				fin += '	<head>'+"\n";
				fin += '		<title>sample page</title>'+"\n";
				fin += '		<style>img{max-width: 100%;}</style>'+"\n";
				fin += '	</head>'+"\n";
				fin += '	<body>'+"\n";
				fin += '		<div style="background-color: #f9f9f9; padding: 5px 30px; font-size: 11px; margin: 1em 0; text-align:center;">main</div>'+"\n";
				fin += '		<div data-contents="main">'+"\n";
				fin += htmls['main']+"\n";
				fin += '		</div><!-- /main -->'+"\n";
				fin += '		<div style="background-color: #f9f9f9; padding: 5px 30px; font-size: 11px; margin: 1em 0; text-align:center;">secondly</div>'+"\n";
				fin += '		<div data-contents="secondly">'+"\n";
				fin += htmls['secondly']+"\n";
				fin += '		</div><!-- /secondly -->'+"\n";
				fin += '	</body>'+"\n";
				fin += '</html>';
				fin += '<script data-broccoli-receive-message="yes">'+"\n";
				fin += 'window.addEventListener(\'message\',(function() {'+"\n";
				fin += 'return function f(event) {'+"\n";
				fin += 'if(event.origin!=\'http://127.0.0.1:8080\'){return;}// <- check your own server\'s origin.'+"\n";
				fin += 'var s=document.createElement(\'script\');'+"\n";
				fin += 'document.querySelector(\'body\').appendChild(s);s.src=event.data.scriptUrl;'+"\n";
				fin += 'window.removeEventListener(\'message\', f, false);'+"\n";
				fin += '}'+"\n";
				fin += '})(),false);'+"\n";
				fin += '</script>'+"\n";

				callback(fin);
				return;
			},
			'log': function(msg){
			}
		},
		function(){
			callback(broccoli);
		}
	);
	return;

}
