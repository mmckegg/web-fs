module.exports = mkdir

function mkdir(path, cb){
  this.entry.getDirectory(path, {create: true}, success, error);

  function success(dir){
    cb(null, dir)
  }

  function error(err){
    cb(err, null)
  } 
}