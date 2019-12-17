const fs = require('fs');

function getSubDirPaths(dir, filelist, fileNameList){
    var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
    filelist = filelist || [];
    fileNameList = fileNameList || [];
    files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = getSubDirPaths(dir + '/' + file, filelist, fileNameList);
    }
    else {
        filelist.push(dir + '/' + file);
        fileNameList.push(file.split(".")[0]);
    }
    });
    return filelist;
}

function getImportsList(filePath){
    importList = [];

    data = fs.readFileSync(filePath, 'utf8')
    var imortIndex = data.search("import ");

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

    return importList;
}

var classNames = []
var classFilePathList = []; 
getSubDirPaths("./opensourcephysics",classFilePathList, classNames);
var classMap = new Map();


var indexMap = new Map();

for(let index = 0; index < 36; ++index){
    indexMap.set(ClassNamesNewSet[index], index);
}

var pointsArr = []

for(let x = 0; x < 6; ++x){
    for(let y = 0; y < 6; ++y){
        let i = x * 6 + y;
        // console.log( i );
        pointsArr.push({
            "label":ClassNamesNewSet[i],
            "x": x,
            "y": y
        });
        let importList = [];
        importList = getImportsList(ClassFilePathNewSet[i]);
        for(importStr of importList){
            let importStrArr = importStr.split('.');
            let importClassName = importStrArr[importStrArr.length - 1];
            console.log(indexMap.get(importClassName));
        }
        // console.log(importList);
    }
}

// console.log(pointsArr);