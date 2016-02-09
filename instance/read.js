module.exports = read

function read(path, buffer, offset, length, position, cb){
  this.entry.getFile(path, {create: "true"}, success, error)

  function success(fileEntry){
    fileEntry.file(function (file) {
      var reader = new FileReader()
      reader.onloadend = function (evt) {
        if (evt.target.readyState === FileReader.DONE) {
          var result = Buffer.concat([
            buffer.slice(0, offset), 
            new Buffer(new Uint8Array(evt.target.result)),
            buffer.slice(length, buffer.length)
          ])
          cb(null, evt.target.result.byteLength, result)
        } else {
          cb("Failed to read file", null)
        }
      }
      reader.readAsArrayBuffer(file.slice(position, position + length))
    })
  }

  function error(err){
    cb(err, null)
  }

}
