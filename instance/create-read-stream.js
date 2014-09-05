var through = require('through')
var Buffer = require('buffer').Buffer

module.exports = createReadStream

function createReadStream(path, opts){
  
  var encoding = null;
  if(typeof opts == 'string'){
    encoding = String(opts).toLowerCase();
    opts = Object.create(null)
  }
  
  opts = opts || Object.create(null)
  
  var stream = through()
  stream.pause()

  this.entry.getFile(path, {create: opts.create || false}, success, error)
  
  function success(fileEntry){
    stream.url = fileEntry.toURL()

    var readType = 'readAsText';
    var type = {type: ''};
  
    fileEntry.file(function(file){
      switch(encoding){
        case 'base64':
        case 'base-64':
          type.type = 'application/base64'
          break;
        case 'utf8':
        case 'utf-8':
          type.type = 'text/plain;charset=UTF-8'
          break;
        case null:
        case 'arraybuffer':
        case 'buffer':
          readType = 'readAsArrayBuffer'
          break;
      }

      var reader = new FileReader();
      var loaded = 0;
      var fileSize = 0;
      reader.onloadstart = function(evt){
        if(evt.lengthComputable) fileSize = evt.total;
        stream.emit('loadstart')
        stream.emit('open')
      }
      reader.onprogress = function(evt){
        var chunkSize = evt.loaded - loaded;
        if (!encoding || encoding === 'buffer'){
          stream.emit('data', toBuffer(this.result.slice(loaded, loaded + chunkSize)))
        } else {
          stream.emit('data', this.result.slice(loaded, loaded + chunkSize))
        }
        loaded += evt.loaded;
      }
      reader.onloadend = function(evt){
        stream.emit('end')
      }
      reader[readType](file, type)
    })
  }

  function error(err){
    stream.emit('error', err)
  }

  return stream
}

function toBuffer(source){
  if (source instanceof ArrayBuffer){
    var array = new Uint8Array(source)
    return new Buffer(array)
  } else {
    return new Buffer(source)
  }
}