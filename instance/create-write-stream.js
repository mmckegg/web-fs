var Writable = require('stream').Writable
var inherits = require('util').inherits

var createFlags = ['w', 'w+', 'a', 'a+']

module.exports = createWriteStream

function createWriteStream(filePath, opts){
  return new WriteStream(this, filePath, opts)
}

function WriteStream(fs, filePath, opts){
  if (!(this instanceof WriteStream)){
    return new WriteStream(fs, filePath, opts)
  }

  var self = this

  Writable.call(this)

  opts = opts || {}
  opts.flags = opts.flags || 'w'

  var create = !!~createFlags.indexOf(opts.flags)
  var append = !!~opts.flags.indexOf('a')
  var truncate = !!~opts.flags.indexOf('w')

  fs.entry.getFile(filePath, {create: create}, success, error)

  // watchers
  self.on('finish', function(){
    fs.listeners.change(fs.normalize(filePath))
  })

  function error(err){ self.emit('error', err) }

  function success(fileEntry){
    
    self.url = fileEntry.toURL()
    self.emit('open')

    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onerror = function(err){
        self.emit('error', err)
      }

      if (append){
        fileWriter.seek(fileWriter.length)
      }

      if (opts.start != null){
        fileWriter.seek(opts.start)
      }

      if (truncate){
        start(self, fileWriter)
      } else {
        fileWriter.onwriteend = function(){
          start(self, fileWriter)
        }
        fileWriter.truncate(0)
      }

    }, error)
  }

}

function start(self, fileWriter){
  fileWriter.onwriteend = function(){
    if (self._pendingCb){
      var cb = self._pendingCb
      self._pendingCb = null
      cb(null)
    }
  }

  self._fileWriter = fileWriter

  // flush
  if (self._pendingWrite){
    fileWriter.write(self._pendingWrite);
    self._pendingWrite = null
  }
}

inherits(WriteStream, Writable)

Writable.prototype._write = function(data, enc, cb){
  var blob = new Blob([data])

  if (this._fileWriter){
    this._fileWriter.write(blob);
  } else {
    this._pendingWrite = blob
  }

  this._pendingCb = cb
}