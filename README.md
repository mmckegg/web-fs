web-fs
===

Currently only implements `fs.createReadStream` (sort of) and `fs.stat`

## Install

```bash
$ npm install web-fs
```

## Example

```js
var fs = require('web-fs')

fs.createWriteStream('/test.txt', function(err, stream){
  stream.write('testing 123')
  stream.end()
})

fs.stat('/test.txt', function(err, stat){
  // stat => { size: 11, mtime: Date }
})
```