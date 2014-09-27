var Stats = require('../stats.js')

module.exports = stat

function stat(path, cb){
  getEntry(this.entry, path, {create: false}, success, error)

  function success(fileEntry){
    fileEntry.getMetadata(function(meta){
      cb(null, new Stats(fileEntry, meta))
    }, error)
  }

  function error(err){
    err.path = path
    cb(err, null)
  }
}

function getEntry(root, path, opts, success, error){
  root.getFile(path, opts, success, function(){
    root.getDirectory(path, opts, success, error)
  })
}