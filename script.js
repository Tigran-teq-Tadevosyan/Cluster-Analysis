var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

function getStringTillChar(str, startingIndex, char){
  let subStr = "";
  let innerIndex = startingIndex;
  while(str.charAt(innerIndex) != char){
    subStr += str.charAt(imortIndex++);
  }
  return subStr;
}

var fileList = walkSync("./opensourcephysics");

var fs = require('fs')
, filename = "";

global.classList = [];

imortIndex = 0;

fileList.forEach((filePath)=>{
  filename = filePath;
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    let index = data.search("public class ");

    if(index != -1){
      let className = "";
      let importList = [];
      index += 13;
      while(data.charAt(index) != " "){
        className += data.charAt(index++);
      }

      imortIndex = data.search("import ");

      while(imortIndex != -1){
        let importName = "";
        imortIndex += 7;
        while(data.charAt(imortIndex) != ";"){
          importName += data.charAt(imortIndex++);
        }
        if(importName.substr(0,21) == "org.opensourcephysics"){
          importList.push(importName);
        }
        data = data.substr(imortIndex);
        imortIndex = data.search("import ", imortIndex);
      }
      global.classList.push({
        'className':filename,
        'importList':importList
      });
      // console.log(classList)
    }
  });
});

console.log(global.classList.length)