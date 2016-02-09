module.exports = write

function write(path, data, offset, length, pos, cb){
  switch ('function'){
    case typeof data:
      throw new Error('Buffer must be a string or array')
      break;
    case typeof offset:
      cb = offset
      offset = 0
      length = null
      pos = null
      break;
    case typeof length:
      cb = length;
      length = null
      pos = null
      break;
    case typeof pos:
      cb = pos;
      pos = null;
      break;
  }

  cb = checkCallback(cb);

  this.entry.getFile(path, {create: true}, success, error)

  function success(fileEntry){
    fileEntry.createWriter(function(writer){
      positionWriter(writer, pos, function() {
        var blob = new Blob([data])

        if(offset || length) {
          blob = blob.slice(offset, offset + length)
        }

        writer.onwriteend = function(){
          cb(null, blob.size)
        }

        writer.onerror = cb
        writer.write(blob)
      })
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

function positionWriter(writer, pos, cb) {
  if (pos) writer.seek(pos)
  if (pos && writer.position < pos) { 
    // pos is greater than file size, adjust file size to accommodate
    writer.truncate(pos)
    writer.onwriteend = function() {
      writer.seek(pos)
      cb()
    }
  } else {
    cb()
  }
}
