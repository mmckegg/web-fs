var Readable = require('stream').Readable
var Buffer = require('buffer').Buffer
var inherits = require('util').inherits

module.exports = createReadStream

function createReadStream(path, opts){
  return new ReadStream(this, path, opts)
}

function ReadStream(fs, filePath, encoding){
  if (!(this instanceof ReadStream)){
    return new ReadStream(fs, filePath, opts)
  }

  var self = this
  self._reading = false
  self.encoding = encoding || 'buffer';
  self.filePath = filePath
  self.fs = fs

  var streamOptions = {}
  if (self.encoding !== 'buffer'){
    streamOptions.objectMode = true
  }

  Readable.call(this, streamOptions)
}

inherits(ReadStream, Readable)

ReadStream.prototype._read = function(){ //TODO: handle back pressure
  var self = this

  if (!self._reading){
    self._reading = true

    var readType = 'readAsText';
    var type = {type: ''};

    getEntry(self.fs, self.filePath, function(err, fileEntry){

      self.url = fileEntry.toURL()

      fileEntry.file(function(file){

        switch(self.encoding){
          case 'base64':
          case 'base-64':
            type.type = 'application/base64'
            break;
          case 'utf8':
          case 'utf-8':
            type.type = 'text/plain;charset=UTF-8'
            break;
          case 'arraybuffer':
          case 'buffer':
            readType = 'readAsArrayBuffer'
            break;
        }

        var reader = new FileReader()
        var loaded = 0
        var fileSize = 0

        reader.onloadstart = function(evt){
          if(evt.lengthComputable) fileSize = evt.total
          self.emit('open')
        }

        reader.onprogress = function(evt){
          var chunkSize = evt.loaded - loaded;
          var chunk = this.result.slice(loaded, loaded + chunkSize)
          if (self.encoding === 'buffer'){
            chunk = toBuffer(chunk)
          }

          loaded += evt.loaded;
          self.push(chunk)
        }

        reader.onloadend = function(evt){
          self.push(null)
        }

        reader[readType](file, type)
      })
    })
  }
}

function getEntry(fs, filePath, cb){
  fs.entry.getFile(filePath, {create: false}, function(entry){
    cb(null, entry)
  }, cb)
}

function toBuffer(source){
  if (source instanceof ArrayBuffer){
    var array = new Uint8Array(source)
    return new Buffer(array)
  } else {
    return new Buffer(source)
  }
}