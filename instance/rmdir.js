module.exports = rmdir

function rmdir(path, cb){
  var fs = this
  this.entry.getDirectory(path, {create: false}, success, error);

  function success(dir){    
    dir.remove(function(){
      cb&&cb(null)

      // watchers
      fs.listeners.change(fs.normalize(path))

    }, error)
  }

  function error(err){
    cb&&cb(err, null)
  }
}