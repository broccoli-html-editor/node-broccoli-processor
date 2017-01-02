# node-broccoli-processor

## Install

```
$ npm install broccoli-processor --save
```

## Usage

```js
var BroccoliProcessor = require('broccoli-processor');
var Broccoli = require('broccoli-html-editor');

var broccoli = new Broccoli();
broccoli.init(
    {
        /* Any options for broccoli-html-editor */
    },
    function(){
        var broccoliProcessor = new BroccoliProcessor(broccoli, {});
        broccoliProcessor
            .each(function( editor ){
                // APIs
                // - editor.getBroccoli()
                // - editor.getInstancePath()
                // - editor.getInstance()
                // - editor.setInstance(instance)
                // - editor.log(val)
                // - editor.done()
                console.log(editor);
                editor.done();
            })
            .run(function(logs){
                console.log('finished.');
            })
        ;
    }
);
```

## Change log

### broccoli-processor@0.0.1-alpha.2 (2016-xx-xx)

- `editor.getBroccoli()` を追加。

### broccoli-processor@0.0.1-alpha.1 (2016-11-19)

- Initial release.


## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
