const fs = require('fs');

var dataFileName = process.argv[2]+".json";
var pointCount = parseInt(process.argv[3]);
var edgeProbability = parseFloat(process.argv[4]);

var minCoordinate = 15;
var multipluer = 10;

var data = {
    'points': [],
    'edges': []
}

for(let i = 0; i < pointCount; ++i){
    data.points.push({
        'x': minCoordinate + multipluer*Math.random(),
        'y': minCoordinate + multipluer*Math.random(),
    });
    let edgeArray = [];
    for(let ii = 0; ii < pointCount; ++ii)
        edgeArray.push(false)
    data.edges.push(edgeArray);
}

for(let i = 0; i < pointCount; ++i){
    for(let j = 0; j < i; ++j){
        if(Math.random() < edgeProbability)
            data.edges[i][j] = true;
    }
}

for(let i = 0; i < pointCount - 1; ++i){
    for(let j = i + 1; j < pointCount; ++j){
        data.edges[i][j] = data.edges[j][i];
    }
}

var json = JSON.stringify(data);

console.log(`Data: ${data}`);

fs.writeFile(dataFileName, json, 'utf8', ()=>{});

//console.log(`${dataFileName}, ${pointCount}, ${edgeProbability}`);