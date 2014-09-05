module.exports = rmdir

function rmdir(path, cb){
  this.entry.getDirectory(path, {create: false}, success, error);

  function success(dir){
    dir.remove(function(){
      cb(null)
    }, error)
  }

  function error(err){
    cb(err, null)
  }
}