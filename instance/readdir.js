module.exports = readdir

function readdir(path, cb){
  this.entry.getDirectory(path, {create: false}, success, error)

  function success(dir){
    var reader = dir.createReader();
    var result = []

    read()

    function read(){
      reader.readEntries(function(results){
        if (results && results.length){
          result = result.concat(results.map(getName))
          read()
        } else {
          cb(null, result)
        }
      }, error)
    }
  }

  function error(err){
    cb(err, null)
  }
}

function getName(entry){
  return entry.name
}