web-fs
===

Node's [fs](http://nodejs.org/api/fs.html) interface for [Web File System API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) and [Chrome Packaged Apps](https://developer.chrome.com/apps/fileSystem). 

Based on [johnnyscript's nota-bene](https://github.com/NHQ/nbfs) but allows specifying root entry.

## Install via [npm](https://npmjs.org/package/web-fs)

```bash
$ npm install web-fs
```

Use with [browserify](http://browserify.org)!

## API

```js
var WebFS = require('web-fs')
```

### `var fs = WebFS(entry)`

Create an instance of `WebFS` with a root directory specified by `entry` ([DirectoryEntry](https://developer.mozilla.org/en-US/docs/Web/API/DirectoryEntry)).

[Web File System API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) example:

```js
var fs = null
navigator.webkitPersistentStorage.requestQuota(1024*1024, function(grantedBytes) {
  window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(result){
    fs = WebFS(result.root)
  })
})
```

[Chrome Packaged App File System](https://developer.chrome.com/apps/fileSystem) example:

```js
var fs = null

// browse for root directory
chrome.fileSystem.chooseEntry({type: 'openDirectory'}, function(entry){
  fs = WebFS(entry)
})
```

### Instance methods

  - `fs.createReadStream`
  - `fs.createWriteStream`
  - `fs.mkdir`
  - `fs.readFile`
  - `fs.readdir`
  - `fs.rename`
  - `fs.rmdir`
  - `fs.stat`
  - `fs.truncate`
  - `fs.unlink`
  - `fs.writeFile`
  - `fs.write`
  - `fs.watchFile`
  - `fs.unwatchFile`
  - `fs.watch`