module.exports = Stats

function Stats(entry, meta){
  this.mtime = meta.modificationTime
  this.size = meta.size
  this.entry = entry
  this.fullPath = entry.fullPath
  this.name = entry.name
}

Stats.prototype = {
  constructor: Stats,
  
  isDirectory: function(){
    return this.entry.isDirectory
  },

  isFile: function(){
    return this.entry.isFile
  },

  isSocket: function(){
    return false
  },

  isSymbolicLink: function(){
    return false
  }
}