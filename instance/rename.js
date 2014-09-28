var path = require('path')
module.exports = rename

function rename(from, to, cb){
  var fs = this
  var fileEntry = null
  
  fs.entry.getFile(from, {create: true}, function(entry){
    fileEntry = entry
    fs.entry.getDirectory(path.dirname(to), {create: true}, success, error)
  }, error)

  function success(toDirectory){
    fileEntry.moveTo(toDirectory, path.basename(to), function(){
      fs.listeners.change(fs.normalize(from))
      fs.listeners.change(fs.normalize(to))
      cb&&cb(null)
    }, error)
  }

  function error(err){
    cb&&cb(err)
  }
}