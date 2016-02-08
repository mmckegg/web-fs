module.exports = exists

function exists(path, cb){
  var fs = this
  fs.stat(path, function(err) {
    if (err) return cb(false)
    cb(true)
  })
}

