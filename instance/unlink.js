module.exports = unlink

function unlink(path, cb){
  this.entry.getFile(path, {create: false}, function(fileEntry){
    fileEntry.remove(function(){
      cb&&cb(null)
    }, cb)
    function error(err){
      cb&&cb(err)
    }
  })
}