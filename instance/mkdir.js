module.exports = mkdir

function mkdir(path, cb){
  var fs = this

  this.entry.getDirectory(path, {create: true}, success, error);

  function success(dir){
    cb(null)

    // watchers
    fs.listeners.change(fs.normalize(path))
  }

  function error(err){
    cb(err, null)
  } 
}