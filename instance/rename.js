var path = require('path')
module.exports = rename

function rename(from, to, cb){
  var fs = this

  fs.stat(from, function(err, stats){
    if (err) return cb&&cb(err)
    if (stats.isDirectory()){
      fs.entry.getDirectory(from, {create: true}, success, error)
    } else {
      fs.entry.getFile(from, {create: true}, success, error)
    }
  })

  function success(fileEntry){
    fs.entry.getDirectory(path.dirname(to), {create: true}, function(toDirectory){
      fileEntry.moveTo(toDirectory, path.basename(to), function(){
        fs.listeners.change(fs.normalize(from))
        fs.listeners.change(fs.normalize(to))
        cb&&cb(null)
      }, error)
    }, error)
  }

  function error(err){
    cb&&cb(err)
  }
}