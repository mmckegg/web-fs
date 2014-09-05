module.exports = WebFS

function WebFS(rootEntry){
  if (!(this instanceof WebFS)){
    return new WebFS(rootEntry)
  }

  this.entry = rootEntry
}

WebFS.prototype = {
  
  constructor: WebFS,

  createReadStream: require('./instance/create-read-stream.js'),
  createWriteStream: require('./instance/create-write-stream.js'),
  mkdir: require('./instance/mkdir.js'),
  readFile: require('./instance/read-file.js'),
  readdir: require('./instance/readdir.js'),
  rename: require('./instance/rename.js'),
  rmdir: require('./instance/rmdir.js'),
  stat: require('./instance/stat.js'),
  truncate: require('./instance/truncate.js'),
  unlink: require('./instance/unlink.js'),
  writeFile: require('./instance/write-file.js'),
  write: require('./instance/write.js')
}