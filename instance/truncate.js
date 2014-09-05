module.exports = truncate

function truncate(path, len, cb){
  this.entry.getFile(path, {create: false}, success, error)

  function success(fileEntry){
    fileEntry.createWriter(function(writer){
      writer.truncate(len)
      cb&&cb(null)
    }, error)
  }

  function error(err){
    cb&&cb(err)
  }
}