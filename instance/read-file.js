var Buffer = require('buffer').Buffer

module.exports = readFile

function readFile(path, opts, cb){
  var encoding = 'buffer';
  if(typeof opts == 'string'){
    encoding = String(opts).toLowerCase();
    opts = Object.create(null)
  }
  if(typeof opts == 'function'){
    cb = opts;
    opts = Object.create(null);
    encoding = 'buffer';
  }
  cb = checkCallback(cb)
  opts = opts || Object.create(null)

  this.entry.getFile(path, {create: opts.create || false}, success, error)

  function success(fileEntry){
    fileEntry.file(function(file){
      var reader = new FileReader();
      var readType = 'readAsText';
      var type = {type: ''};
    
      switch(encoding){
        case 'base64':
        case 'base-64':
          type.type = 'application/base64'
          break;
        case 'utf8':
        case 'utf-8':
          type.type = 'text/plain;charset=UTF-8'
          break;
        case 'uri':
        case 'url':
          readType = 'readAsDataURL'
          break;
        case null:
        case 'arraybuffer':
        case 'buffer':
          readType = 'readAsArrayBuffer'
          break;
      }
      reader.onloadend = function(evt){   
        if (encoding === 'buffer'){
          cb(null, toBuffer(this.result))
        } else {
          cb(null, this.result)
        } 
      }
      reader[readType](file)
    }, error)
  }

  function error(err){
    cb(err, null)
  }

}

function checkCallback(cb) {
  if (typeof cb !== 'function'){
    throw 'Callback is required'
  }
  return cb
}

function toBuffer(source){
  if (source instanceof ArrayBuffer){
    var array = new Uint8Array(source)
    return new Buffer(array)
  } else {
    return new Buffer(source)
  }
}