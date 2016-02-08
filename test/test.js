var WebFS = require('../');
var test = require('tape')

test(function(t){

  t.plan(13)

  getFs(function(fs){

    // from https://github.com/NHQ/nbfs/blob/master/test.js

    // 2 tests
    fs.writeFile('tempethx', 'a string is the thing', function(err){
      if(err) throw err
      fs.readFile('tempethx', 'utf8', function(err, data){
        t.equal(data, 'a string is the thing')
        fs.unlink('tempethx', function(err){
          t.equal(err, null)
        })
      })
    })

    // 3 test
    fs.writeFile('partial-read', 'a string is the thing', function(err){
      if(err) throw err 
      fs.read('partial-read', new Buffer(0), 0, 6, 9, function(err, read, buffer){
        var rawData = buffer.toString()
        t.equal(read, 6)
        t.equal(rawData, 'is the')
        fs.unlink('partial-read', function(err){
          t.equal(err, null)
        })  
      })  
    })  

    var buf = new Float32Array(1024 * 1024);
    for(var x = 0; x < buf.length; x++){
      buf[x] = Math.sin((x / 1024 * 1024) * Math.PI * 2)
    }

    // 1 test
    var ws = fs.createWriteStream('tempeth3')
    ws.on('error', function(err){ throw err })
    ws.on('finish', function(){
      t.ok(true, 'finish event')
    })
    for(var y = 0; y < 5; y++){
      ws.write(new Buffer(buf))
    }
    ws.end()

    // 1 test
    fs.mkdir('/tmp', function(err){
      if(err) throw err
      fs.writeFile('/tmp/pipeTest', buf, function(err){
        if(err) throw err

        fs.stat('/tmp/pipeTest', function(err, stats){
          if(err) throw err
          t.equal(stats.size, 4194304)
        })

        var ws = fs.createWriteStream('/tmp/pip')
        var rs = fs.createReadStream('/tmp/pipeTest')
        rs.pipe(ws)
        ws.on('finish', function(){
          fs.stat('/tmp/pip', function(err, stats){
            if(err) throw err
            t.equal(stats.size, 4194304)
          })
        })
      })    
    })

    // 2 tests
    fs.write('testbed', 'a string is the thing', 0, 8, null, function(err){
      if(err) throw err
      fs.readFile('testbed', 'utf8', function(err, file){
        t.equal(file, 'a string') // truncated
        fs.rename("testbed", '/tmp/test.txt', function(err){
          if(err) throw err
          fs.readFile('/tmp/test.txt', 'utf8', function(err, file){
            if(err) throw err
            t.equal(file, 'a string')
          })
        })
      })
    })

    // 1 test
    fs.writeFile('test-write-truncate', 'a string is the thing', function(err){
      if(err) throw err
      fs.writeFile('test-write-truncate', 'shorter value', function(err){
        if(err) throw err
        fs.readFile('test-write-truncate', 'utf8', function(err, file){
          if(err) throw err
          t.equal(file, 'shorter value')
        })
      })
    })

    // 2 tests
    fs.writeFile('testbed2', 'a string is the thing', function(err){
      if(err) throw err
      fs.readFile('testbed2', 'utf8', function(err, file){
        t.equal(file, 'a string is the thing')
        fs.unlink('testbed2', function(err){
          fs.readFile('testbed2', 'utf8', function(err, file){
            // throws
            t.notEqual(err, null)
          })
        })
      })
    })
  })
})

test('rename directory', function(t){
 t.plan(3);
 getFs(function(fs){

  fs.mkdir('/tmp/cooltest', function(err){
    fs.rename('/tmp/cooltest','/tmp/coolertest', function(err){
      t.equal(err, null)
      fs.readdir('/tmp', function(err, files){
        t.notOk(~files.indexOf('cooltest'))
        t.ok(~files.indexOf('coolertest'))
      })
    })
  })

 })
})

test('watchFile', function(t) {

  t.plan(3)

  getFs(function(fs){
    fs.watchFile('/test', function() {
      t.ok(true);
    })

    fs.writeFile('/test', new Buffer(1), function() {
      fs.truncate('/test', 10000, function(err) {
        fs.unlink('/test');
      })
    })
  })

})

function getFs(cb){
  navigator.webkitTemporaryStorage.requestQuota(1024*1024, function(grantedBytes) {
    window.webkitRequestFileSystem(TEMPORARY, grantedBytes, function(result){
      cb(WebFS(result.root))
    })
  })
}
