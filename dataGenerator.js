const fs = require('fs');

var dataFileName = process.argv[2]+".json"; // Getting the name of the data file as an argument

var data = new Map(), // The map containing all the elements the cluster must be generated from
    points = [], // The output points arr
    edges = []; // The 2d array of the edges containing booleans

// Filling in the data map

data.set("AbstractSimulation_setControl",{
    'label':"AbstractSimulation_setControl",
    'connections':[
        "SimulationControl_createApp",
        "AbstractSimulation_resetAnimation",
        "ShadowControl_ShadowControl",
        "ShadowControl_setLockValues"
    ]
});

data.set("AbstractSimulation_startRunning",{
    'label':"AbstractSimulation_startRunning",
    'connections':[
        "AbstractSimulation_startAnimation",
        "AbstractSimulation_stepAnimation"
    ]
});

data.set("AbstractSimulation_stopRunning",{
    'label':"AbstractSimulation_stopRunning",
    'connections':[
        "AbstractSimulation_stopAnimation",
        "AbstractSimulation_stepAnimation"
    ]
});

data.set("AbstractSimulation_startAnimation",{
    'label':"AbstractSimulation_startAnimation",
    'connections':[
        "AbstractSimulation_startRunning",
        "AbstractSimulation_startSimulation",
        "AbstractSimulation_start",
        "ClusterParticlesApp_startRunning"
    ]
});

data.set("AbstractSimulation_startSimulation",{
    'label':"AbstractSimulation_startSimulation",
    'connections':[
        "AbstractSimulation_startAnimation"
    ]
});

data.set("AbstractSimulation_start",{
    'label':"AbstractSimulation_start",
    'connections':[
        "AbstractSimulation_startAnimation"
    ]
});

data.set("AbstractSimulation_stopAnimation",{
    'label':"AbstractSimulation_stopAnimation",
    'connections':[
        "AbstractSimulation_stopRunning",
        "AbstractSimulation_stopSimulation",
        "AbstractSimulation_stop"
    ]
});

data.set("AbstractSimulation_stopSimulation",{
    'label':"AbstractSimulation_stopSimulation",
    'connections':[
        "AbstractSimulation_stopAnimation"
    ]
});

data.set("AbstractSimulation_stop",{
    'label':"AbstractSimulation_stop",
    'connections':[
        "AbstractSimulation_stopAnimation"
    ]
});

data.set("AbstractSimulation_stepAnimation",{
    'label':"AbstractSimulation_stepAnimation",
    'connections':[
        "AbstractSimulation_startRunning",
        "AbstractSimulation_stopRunning",
        "GUIUtils_repaintAnimatedFrames",
        "ClusterParticlesApp_startRunning"
    ]
});

data.set("AbstractSimulation_initializeAnimation",{
    'label':"AbstractSimulation_initializeAnimation",
    'connections':[
        "AbstractSimulation_initialize"
    ]
});

data.set("AbstractSimulation_initialize",{
    'label':"AbstractSimulation_initialize",
    'connections':[
        "AbstractSimulation_initializeAnimation"
    ]
});

data.set("AbstractSimulation_resetAnimation",{
    'label':"AbstractSimulation_resetAnimation",
    'connections':[
        "AbstractSimulation_setControl",
        "AbstractSimulation_reset",
        "ShadowControl_setAdjustableValue"
    ]
});

data.set("AbstractSimulation_enableStepsPerDisplay",{
    'label':"AbstractSimulation_enableStepsPerDisplay",
    'connections':[
        "SimulationControlLoader_loadObject",
        "ShadowControl_setAdjustableValue",
        "ShadowControl_removeParameter"
    ]
});

data.set("AbstractSimulation_setStepsPerDisplay",{
    'label':"AbstractSimulation_setStepsPerDisplay",
    'connections':[
        "SimulationControlLoader_loadObject",
        "ShadowControl_setAdjustableValue"
    ]
});

data.set("AbstractSimulation_reset",{
    'label':"AbstractSimulation_reset",
    'connections':[
        "AbstractSimulation_resetAnimation"
    ]
});

data.set("AbstractSimulation_run",{
    'label':"AbstractSimulation_run",
    'connections':[
        "GUIUtils_setAnimatedFrameIgnoreRepaint",
        "GUIUtils_renderAnimatedFrames",
        "ClusterParticlesApp_doStep"
    ]
});

data.set("ShadowControl_ShadowControl",{
    'label':"ShadowControl_ShadowControl",
    'connections':[
        "AbstractSimulation_setControl"
    ]
});

data.set("ShadowControl_setAdjustableValue",{
    'label':"ShadowControl_setAdjustableValue",
    'connections':[
        "AbstractSimulation_resetAnimation",
        "AbstractSimulation_enableStepsPerDisplay",
        "AbstractSimulation_setStepsPerDisplay"
    ]
});

data.set("ShadowControl_removeParameter",{
    'label':"ShadowControl_removeParameter",
    'connections':[
        "AbstractSimulation_enableStepsPerDisplay"
    ]
});

data.set("ShadowControl_setLockValues",{
    'label':"ShadowControl_setLockValues",
    'connections':[
        "AbstractSimulation_setControl"
    ]
});

data.set("ShadowControl_setValue",{
    'label':"ShadowControl_setValue",
    'connections':[
        "ClusterParticlesApp_reset"
    ]
});

data.set("ShadowControl_getInt",{
    'label':"ShadowControl_getInt",
    'connections':[
        "ClusterParticlesApp_initialize"
    ]
});

data.set("ShadowControl_getDouble",{
    'label':"ShadowControl_getDouble",
    'connections':[
        "ClusterParticlesApp_initialize"
    ]
});

data.set("ShadowControl_getObject",{
    'label':"ShadowControl_getObject",
    'connections':[
        "SimulationControlLoader_loadObject"
    ]
});

data.set("ShadowControl_getString",{
    'label':"ShadowControl_getString",
    'connections':[
        "SimulationControlLoader_loadObject"
    ]
});

data.set("SimulationControl_SimulationControl",{
    'label':"SimulationControl_SimulationControl",
    'connections':[
        "SimulationControl_createApp",
        "SimulationControlLoader_createObject"
    ]
});

data.set("SimulationControl_setAdjustableValue",{
    'label':"SimulationControl_setAdjustableValue",
    'connections':[
        "ClusterParticlesApp_reset",
        "SimulationControl_setValue"
    ]
});

data.set("SimulationControl_setValue",{
    'label':"SimulationControl_setValue",
    'connections':[
        "SimulationControl_setAdjustableValue",
        "ClusterParticlesApp_reset"
    ]
});

data.set("SimulationControl_createApp",{
    'label':"SimulationControl_createApp",
    'connections':[
        "AbstractSimulation_setControl",
        "SimulationControl_SimulationControl",
        "ClusterParticlesApp_main"
    ]
});

data.set("SimulationControlLoader_createObject",{
    'label':"SimulationControlLoader_createObject",
    'connections':[
        "SimulationControl_SimulationControl"
    ]
});

data.set("SimulationControlLoader_loadObject",{
    'label':"SimulationControlLoader_loadObject",
    'connections':[
        "AbstractSimulation_enableStepsPerDisplay",
        "AbstractSimulation_setStepsPerDisplay",
        "ShadowControl_getObject",
        "ShadowControl_getString"
    ]
});

data.set("GUIUtils_clearDrawingFrameData",{
    'label':"GUIUtils_clearDrawingFrameData",
    'connections':[
        "ClusterParticlesApp_resetData"
    ]
});

data.set("GUIUtils_repaintAnimatedFrames",{
    'label':"GUIUtils_repaintAnimatedFrames",
    'connections':[
        "AbstractSimulation_stepAnimation"
    ]
});

data.set("GUIUtils_setAnimatedFrameIgnoreRepaint",{
    'label':"GUIUtils_setAnimatedFrameIgnoreRepaint",
    'connections':[
        "AbstractSimulation_run"
    ]
});

data.set("GUIUtils_renderAnimatedFrames",{
    'label':"GUIUtils_renderAnimatedFrames",
    'connections':[
        "AbstractSimulation_run"
    ]
});

data.set("ClusterParticlesApp_initialize",{
    'label':"ClusterParticlesApp_initialize",
    'connections':[
        "ShadowControl_getInt",
        "ShadowControl_getDouble",
        "ClusterParticles_initialize"
    ]
});

data.set("ClusterParticlesApp_doStep",{
    'label':"ClusterParticlesApp_doStep",
    'connections':[
        "AbstractSimulation_run",
        "ClusterParticles_step",
        "ClusterParticles_calculateClusters"
    ]
});

data.set("ClusterParticlesApp_startRunning",{
    'label':"ClusterParticlesApp_startRunning",
    'connections':[
        "AbstractSimulation_startAnimation",
        "AbstractSimulation_stepAnimation",
        "ClusterParticlesApp_reset"
    ]
});

data.set("ClusterParticlesApp_reset",{
    'label':"ClusterParticlesApp_reset",
    'connections':[
        "ShadowControl_setValue",
        "SimulationControl_setAdjustableValue",
        "SimulationControl_setValue",
        "ClusterParticlesApp_startRunning"
    ]
});

data.set("ClusterParticlesApp_resetData",{
    'label':"ClusterParticlesApp_resetData",
    'connections':[
        "GUIUtils_clearDrawingFrameData"
    ]
});

data.set("ClusterParticlesApp_importInitialData",{
    'label':"ClusterParticlesApp_importInitialData",
    'connections':[
        "ClusterParticles_setDataFromJSON"
    ]
});

data.set("ClusterParticlesApp_main",{
    'label':"ClusterParticlesApp_main",
    'connections':[
        "SimulationControl_createApp"
    ]
});

data.set("DrawingPanel_xToPix",{
    'label':"DrawingPanel_xToPix",
    'connections':[
        "ClusterParticles_draw"
    ]
});

data.set("DrawingPanel_yToPix",{
    'label':"DrawingPanel_yToPix",
    'connections':[
        "ClusterParticles_draw"
    ]
});

data.set("Verlet_step",{
    'label':"Verlet_step",
    'connections':[
        "ClusterParticles_step",
        "Verlet_initialize",
        "ClusterParticles_getState",
        "ClusterParticles_getRate"
    ]
});

data.set("Verlet_getRateCounter",{
    'label':"Verlet_getRateCounter",
    'connections':[
        "ClusterParticles_getRate"
    ]
});

data.set("Verlet_initialize",{
    'label':"Verlet_initialize",
    'connections':[
        "Verlet_step"
    ]
});

data.set("ClusterParticles_initialize",{
    'label':"ClusterParticles_initialize",
    'connections':[
        "ClusterParticlesApp_initialize",
        "ClusterParticles_setVelocities",
        "ClusterParticles_setRandomEdges",
        "ClusterParticles_setRandomPositions",
        "ClusterParticles_computeAcceleration",
        "ClusterParticles_resetSteps"
    ]
});

data.set("ClusterParticles_setVelocities",{
    'label':"ClusterParticles_setVelocities",
    'connections':[
        "ClusterParticles_initialize"
    ]
});

data.set("ClusterParticles_setRandomEdges",{
    'label':"ClusterParticles_setRandomEdges",
    'connections':[
        "ClusterParticles_initialize"
    ]
});

data.set("ClusterParticles_setDataFromJSON",{
    'label':"ClusterParticles_setDataFromJSON",
    'connections':[
        "ClusterParticlesApp_importInitialData",
        "ClusterParticles_resetSteps"
    ]
});

data.set("ClusterParticles_setRandomPositions",{
    'label':"ClusterParticles_setRandomPositions",
    'connections':[
        "ClusterParticles_initialize"
    ]
});

data.set("ClusterParticles_computeAcceleration",{
    'label':"ClusterParticles_computeAcceleration",
    'connections':[
        "ClusterParticles_initialize",
        "ClusterParticles_getRate"
    ]
});

data.set("ClusterParticles_resetSteps",{
    'label':"ClusterParticles_resetSteps",
    'connections':[
        "ClusterParticles_initialize",
        "ClusterParticles_setDataFromJSON"
    ]
});

data.set("ClusterParticles_step",{
    'label':"ClusterParticles_step",
    'connections':[
        "Verlet_step",
        "ClusterParticles_setDataFromJSON"
    ]
});

data.set("ClusterParticles_draw",{
    'label':"ClusterParticles_draw",
    'connections':[
        "DrawingPanel_xToPix",
        "DrawingPanel_yToPix"
    ]
});

data.set("ClusterParticles_getState",{
    'label':"ClusterParticles_getState",
    'connections':[
        "Verlet_step"
    ]
});

data.set("ClusterParticles_getRate",{
    'label':"ClusterParticles_getRate",
    'connections':[
        "Verlet_getRateCounter",
        "ClusterParticles_computeAcceleration",
        "Verlet_step"
    ]
});

data.set("ClusterParticles_calculateClusters",{
    'label':"ClusterParticles_calculateClusters",
    'connections':[
        "ClusterParticlesApp_doStep",
        "ClusterParticles_addClusterPoints",
        "ClusterParticles_pointDistance",
        "ClusterParticles_log2",
        "ClusterParticles_getRandomColor"
    ]
});

data.set("ClusterParticles_addClusterPoints",{
    'label':"ClusterParticles_addClusterPoints",
    'connections':[
        "ClusterParticles_calculateClusters",
        "ClusterParticles_pointDistance"
    ]
});

data.set("ClusterParticles_pointDistance",{
    'label':"ClusterParticles_pointDistance",
    'connections':[
        "ClusterParticles_calculateClusters",
        "ClusterParticles_addClusterPoints"
    ]
});

data.set("ClusterParticles_log2",{
    'label':"ClusterParticles_log2",
    'connections':[
        "ClusterParticles_calculateClusters"
    ]
});

data.set("ClusterParticles_getRandomColor",{
    'label':"ClusterParticles_getRandomColor",
    'connections':[
        "ClusterParticles_calculateClusters"
    ]
});

const data_size = data.size;
const minCoordinate = 35,
      multipluer = 30;

//Filling in the points with random initial position
var _index = 0;
for (let [key, value] of data) {
    points[_index] = {
                        "x": minCoordinate + multipluer*Math.random(),
                        "y": minCoordinate + multipluer*Math.random(),
                        "label": value.label
                    };
    value.index = _index
    ++_index;
}

//Filling initial state of edge matrix
for(let row = 0; row < data_size; ++row){
    edges[row] = []
    for(let col = 0; col < data_size; ++col){
        edges[row][col] = false;
    }
}

//Filling in the values of the edge matrix
for (let [key, value] of data) {
    value.connections.forEach(element => {
        edges[value.index][data.get(element).index] = true;
    });
}

//Stringifing the data obtained
var jsonString = JSON.stringify({
    'points': points,
    'edges': edges
});

//Writing the data into data file
fs.writeFile(dataFileName, jsonString, 'utf8', ()=>{});