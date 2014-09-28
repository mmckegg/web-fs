var resolve = require('path').resolve
var watchers = require('./watchers.js')

module.exports = WebFS

function WebFS(rootEntry){
  if (!(this instanceof WebFS)){
    return new WebFS(rootEntry)
  }

  this.listeners = watchers()
  this.entry = rootEntry
}

WebFS.prototype = {
  
  constructor: WebFS,

  createReadStream: require('./instance/create-read-stream.js'),
  createWriteStream: require('./instance/create-write-stream.js'),
  mkdir: require('./instance/mkdir.js'),
  readFile: require('./instance/read-file.js'),
  readdir: require('./instance/readdir.js'),
  rename: require('./instance/rename.js'),
  rmdir: require('./instance/rmdir.js'),
  stat: require('./instance/stat.js'),
  truncate: require('./instance/truncate.js'),
  unlink: require('./instance/unlink.js'),
  writeFile: require('./instance/write-file.js'),
  write: require('./instance/write.js'),

  // watchers

  watch: function watch(path, cb){
    var fs = this
    return fs.listeners.watcher(fs.normalize(path), cb)
  },

  watchFile: function(path, opts, cb) {
    var fs = this
    if (typeof opts === 'function') return fs.watchFile(path, null, opts)
    return fs.listeners.watch(fs.normalize(path), cb)
  },

  unwatchFile: function(path, cb) {
    var fs = this
    fs.listeners.unwatch(fs.normalize(path), cb)
  },

  normalize: function(path){
    return resolve(this.entry.fullPath, path)
  }
}