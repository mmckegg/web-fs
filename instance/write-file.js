module.exports = writeFile

function writeFile(path, data, opts, cb){
  var fs = this

  var encoding = 'utf8';
  if (typeof opts == 'string'){
    encoding = String(opts).toLowerCase();
    opts = Object.create(null)
  }
  if (typeof opts == 'function'){
    cb = opts;
    opts = Object.create(null);
    encoding = 'utf8';
  }

  cb = cb || function noop(){}

  fs.write(path, data, 0, null, null, function(err, len){
    if (err) return cb(err)
    fs.truncate(path, len, cb)
  })
}