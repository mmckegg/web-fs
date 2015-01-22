module.exports = unlink

function unlink(path, cb){
  var fs = this
  this.entry.getFile(path, {create: false}, function(fileEntry){
    fileEntry.remove(function(){
      cb&&cb(null)
      fs.listeners.change(fs.normalize(path))
    }, cb, error)
  }, error)

  function error(err){
    cb&&cb(err)
  }
}