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
    {},
    function(){
        var broccoliProcessor = new BroccoliProcessor(broccoli, {});
        broccoliProcessor
            .each(
                function( data, next ){
                    console.log(data);
                    next();
                },
                function(){
                    console.log('finished.');
                    assert.equal(1, 1);
                }
            )
        ;
    }
);

```

## ライセンス - License

MIT License


## 作者 - Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
