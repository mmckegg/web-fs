function watch(path, cb){
  var fs = this
  return fs.listeners.watcher(fs.normalize(path), cb)
}