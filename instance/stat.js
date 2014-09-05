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

function Stats(entry, meta){
  this.mtime = meta.modificationTime
  this.size = meta.size
  this.entry = entry
  this.fullPath = entry.fullPath
}

Stats.prototype = {
  constructor: Stats,
  
  isDirectory: function(){
    return this.entry.isDirectory
  },

  isFile: function(){
    return this.entry.isFile
  }
}