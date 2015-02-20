module.exports = writeFile

var createFlags = ['w', 'w+', 'a', 'a+']

function writeFile(path, data, opts, cb){
  var fs = this

  if (typeof opts == 'function'){
    cb = opts
    opts = null
  }

  this.entry.getFile(path, {create: true}, next, error)

  opts = opts || {}
  opts.flags = opts.flags || 'w'

  var create = !!~createFlags.indexOf(opts.flags)
  var append = !!~opts.flags.indexOf('a')
  var truncate = !!~opts.flags.indexOf('w')

  function next(fileEntry){
    fileEntry.createWriter(function(fileWriter){
      
      var blob = new Blob([data])
      var length = blob.size

      if (append){
        length += fileWriter.length
        fileWriter.seek(fileWriter.length)
      }

      if (opts.start != null){
        length += opts.start
        fileWriter.seek(opts.start)
      }


      fileWriter.onwriteend = function(){
        if (truncate){
          fileWriter.onwriteend = success
          fileWriter.truncate(length)
        } else {
          success()
        }
      }

      fileWriter.onerror = error
      fileWriter.write(blob)

    }, error)
  }

  function success(){
    cb&&cb(null)
    fs.listeners.change(fs.normalize(path))
  }

  function error(err){
    cb&&cb(err)
    console.log(err)
  }
}