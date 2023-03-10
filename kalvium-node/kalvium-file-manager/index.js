
//Include the fs module
const fs = require('fs');
Object.defineProperty(global, '__stack', {
get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
get: function() {
        return __stack[1].getLineNumber();
    }
});

Object.defineProperty(global, '__function', {
get: function() {
        return __stack[1].getFunctionName();
    }
});


var dataAsync = "";
var dataSync = "";

function readFileSync(filePath) {
  const data = fs.readFileSync(filePath,{encoding:'utf8', flag:'r'});
  console.log("Data read syncrhonously completed", data);
  return data;
}

function readFileAysncPromiseWrapped(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, {encoding:'utf8', flag:'r'}, function(err, data){
      if(err) {
        console.error("[Internal] Error while reading the data");
        reject(err);
      } else {
        console.info("[Internal] Data readAsyncrhonously completed", data);
        resolve(data);
      }
    });
  })
}

function readFileAsync(filePath) {
  fs.readFile(filePath, {encoding:'utf8', flag:'r'}, function(err, data){
    if(err) {
      console.error("[Internal] Error while reading the data");
    } else {
      console.info("[Internal] Data readAsyncrhonously completed", data);
      dataAsync = data;
    }
  });
}

function writeFileSync(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, {encoding:'utf8', flag:'w'});
    console.info("[Internal] Synchronous write to the file completed");
  } catch (err) {
    console.error("[Internal] Failed while writing the file sync", toString(err));
  }
}

function writeFileAsync(filePath, data) {
  fs.writeFile(filePath, data, {encoding:'utf8', flag:'w'}, function(err, data) {
    if(err) {
      console.error("[Internal] Failed while writing to the file async", toString(err));
    } else {
      console.info("[Internal] Asynchronous write to the file completed");
    }
  })
}

function readWriteSync() {
  console.log("-------------------------------------- Starting read write sync --------------------------------------");
  dataSync = readFileSync("./KFM-source/input.txt");
  writeFileSync("./KFM-destination/output.txt", dataSync);
  console.log("-------------------------------------- Finishing read write sync --------------------------------------");
}

function readSyncWriteAsync() {
  console.log("-------------------------------------- Starting read sync write async --------------------------------------");
  dataSync = readFileSync("./KFM-source/input.txt");
  writeFileAsync("./KFM-destination/output2.txt", dataAsync);
  console.log("-------------------------------------- Finishing read sync write async --------------------------------------");
}

function readWriteAsync() {
  console.log("-------------------------------------- Starting read write async --------------------------------------");
  readFileAysncPromiseWrapped("./KFM-source/input.txt").then(dataAsync => {
    writeFileAsync("./KFM-destination/output2.txt", dataAsync);
  }).catch(err => {
    console.log("Failed while reading async");
  });
  console.log("-------------------------------------- Finishing read write async --------------------------------------");
}

function readAsyncWriteSync() {
  console.log("-------------------------------------- Starting read async write sync --------------------------------------");
  readFileAysncPromiseWrapped("./KFM-source/input.txt").then(dataAsync => {
    writeFileSync("./KFM-destination/output.txt", dataAsync);
  }).catch(err => {
    console.log("Failed while reading async");
  });
  console.log("-------------------------------------- Finishing read async write sync --------------------------------------");
}

//------------------------------------------------------------------------
// Combinations
readWriteSync();
readSyncWriteAsync();
readWriteAsync();
readAsyncWriteSync();

//------------------------------------------------------------------------
// Combinations end here

// //Individual calls
// readFileAsync("./KFM-source/input2.txt");
// dataSync = readFileSync("./KFM-source/input.txt");

// writeFileSync("./KFM-destination/output.txt", dataSync);
// writeFileAsync("./KFM-destination/output2.txt", dataAsync);