var Through = require('through')

module.exports = {
  createWriteStream: function(filePath, options){
    var options = options || {}
    var stream = Through()
    stream.pause()

    function onError(err){ stream.emit('error', err) }

    getFile(filePath, function(err, fileEntry){
      if(err)return onError(err)

      stream.url = fileEntry.toURL()
      stream.emit('open')

      fileEntry.createWriter(function(fileWriter) {

        stream.on('end', function(){
          process.nextTick(function(){
            if (fileWriter.readyState !== fileWriter.DONE){
              fileWriter.onwriteend = function(){
                stream.emit('close')
              }
            } else {
              stream.emit('close')
            }
          })
        })

        if (options.start){
          fileWriter.seek(options.start)
        } else if (options.flags == 'r+') {
          fileWriter.seek(fileWriter.length)
        }

        stream.on('data', function(data){
          var blob = new Blob([data])
          fileWriter.write(blob);
        })

        stream.resume()
      }, onError)

    }, onError)

    return stream
  },

  stat: function(filePath, cb){
    getFile(filePath, function(err, fileEntry){
      if(err)return cb&&cb(err)

      fileEntry.getMetadata(function(meta){
        cb(null, {
          size: meta.size,
          mtime: meta.modificationTime
        })
      }, cb)
    })
  }

}

function getFile(filePath, cb){
  getFileSystem(function(err, fs){
    if(err)return cb&&cb(err)

    fs.root.getFile(filePath, {create: true}, function(fileEntry) {
      cb(null, fileEntry)
    }, cb)
  }, cb)
}

var fileSystem = null
function getFileSystem(cb){
  if (fileSystem){
    cb(null, fileSystem)
  } else {
    window.webkitRequestFileSystem(window.PERSISTENT, 1024*1024*1024, function(fs){
      fileSystem = fs
      cb(null, fileSystem)
    })
  }
}

