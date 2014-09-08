var Stats = require('../stats.js')

module.exports = stat

function stat(path, cb){
  this.entry.getFile(path, {create: false}, success, error)

  function success(fileEntry){
    fileEntry.getMetadata(function(meta){
      cb(null, new Stats(fileEntry, meta))
    }, error)
  }

  function error(err){
    cb(err, null)
  }
}