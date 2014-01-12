var Through = require('through')

module.exports = {
  createWriteStream: function(filePathOrEntry, options){
    var options = options || {}
    var stream = Through()
    stream.pause()

    function onError(err){ stream.emit('error', err) }

    getFile(filePathOrEntry, function(err, fileEntry){
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

        fileWriter.onwriteend = function(){
          stream.resume()
        }

        stream.on('data', function(data){
          stream.pause()
          if (!(data instanceof Blob)){
            data = new Blob([data])
          }
          fileWriter.write(data);
        })

        stream.resume()
      }, onError)

    }, onError)

    return stream
  },

  stat: function(filePathOrEntry, cb){
    getFile(filePathOrEntry, function(err, fileEntry){
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

function getFile(filePathOrEntry, cb){
  if (typeof filePathOrEntry === 'string'){
    getFileSystem(function(err, fs){
      if(err)return cb&&cb(err)

      fs.root.getFile(filePathOrEntry, {create: true}, function(fileEntry) {
        cb(null, fileEntry)
      }, cb)
    }, cb)
  } else {
    cb(null, filePathOrEntry)
  }

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