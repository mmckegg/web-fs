module.exports = truncate

function truncate(path, len, cb){
  var fs = this

  this.entry.getFile(path, {create: false}, success, error)

  function success(fileEntry){
    fileEntry.createWriter(function(writer){
      writer.truncate(len)
      cb&&cb(null)
      fs.listeners.change(fs.normalize(path))
    }, error)
  }

  function error(err){
    cb&&cb(err)
  }
}