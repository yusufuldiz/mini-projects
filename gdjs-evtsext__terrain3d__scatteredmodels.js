
gdjs.evtsExt__Terrain3D__ScatteredModels = gdjs.evtsExt__Terrain3D__ScatteredModels || {};

/**
 * Object generated from Scattered models (forests, rocks...)
 */
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels = class ScatteredModels extends gdjs.CustomRuntimeObject3D {
  constructor(parentInstanceContainer, objectData, instanceData) {
    super(parentInstanceContainer, objectData, instanceData);
    this._parentInstanceContainer = parentInstanceContainer;

    this._objectData = {};
    
    this._objectData.Model = objectData.content.Model !== undefined ? objectData.content.Model : "";
    this._objectData.Size = objectData.content.Size !== undefined ? objectData.content.Size : Number("300") || 0;
    this._objectData.MinScale = objectData.content.MinScale !== undefined ? objectData.content.MinScale : Number("0.8") || 0;
    this._objectData.MaxScale = objectData.content.MaxScale !== undefined ? objectData.content.MaxScale : Number("1.2") || 0;
    this._objectData.RandomRotation = objectData.content.RandomRotation !== undefined ? objectData.content.RandomRotation : true;
    this._objectData.RandomTint = objectData.content.RandomTint !== undefined ? objectData.content.RandomTint : "255;255;255";
    this._objectData.Density = objectData.content.Density !== undefined ? objectData.content.Density : Number("0.3") || 0;
    this._objectData.Seed = objectData.content.Seed !== undefined ? objectData.content.Seed : Number("1") || 0;
    this._objectData.Coverage = objectData.content.Coverage !== undefined ? objectData.content.Coverage : "Everywhere";
    this._objectData.GroundLayer = objectData.content.GroundLayer !== undefined ? objectData.content.GroundLayer : "1";
    this._objectData.MaxSlope = objectData.content.MaxSlope !== undefined ? objectData.content.MaxSlope : Number("30") || 0;
    this._objectData.MinGroundZ = objectData.content.MinGroundZ !== undefined ? objectData.content.MinGroundZ : Number("-100000") || 0;
    this._objectData.MaxGroundZ = objectData.content.MaxGroundZ !== undefined ? objectData.content.MaxGroundZ : Number("100000") || 0;
    this._objectData.TrunkCollisions = objectData.content.TrunkCollisions !== undefined ? objectData.content.TrunkCollisions : false;
    this._objectData.TrunkDiameter = objectData.content.TrunkDiameter !== undefined ? objectData.content.TrunkDiameter : Number("30") || 0;
    this._objectData.DrawDistance = objectData.content.DrawDistance !== undefined ? objectData.content.DrawDistance : Number("8000") || 0;
    this._objectData.CastShadow = objectData.content.CastShadow !== undefined ? objectData.content.CastShadow : true;
    this._objectData.ReceiveShadow = objectData.content.ReceiveShadow !== undefined ? objectData.content.ReceiveShadow : true;
    this._objectData.Edits = objectData.content.Edits !== undefined ? objectData.content.Edits : "";
    this._objectData.PaintData = objectData.content.PaintData !== undefined ? objectData.content.PaintData : "";
    

    // It calls the onCreated super implementation at the end.
    this.onCreated();
  }

  // Hot-reload:
  updateFromObjectData(oldObjectData, newObjectData) {
    super.updateFromObjectData(oldObjectData, newObjectData);
    if (oldObjectData.content.Model !== newObjectData.content.Model)
      this._objectData.Model = newObjectData.content.Model;
    if (oldObjectData.content.Size !== newObjectData.content.Size)
      this._objectData.Size = newObjectData.content.Size;
    if (oldObjectData.content.MinScale !== newObjectData.content.MinScale)
      this._objectData.MinScale = newObjectData.content.MinScale;
    if (oldObjectData.content.MaxScale !== newObjectData.content.MaxScale)
      this._objectData.MaxScale = newObjectData.content.MaxScale;
    if (oldObjectData.content.RandomRotation !== newObjectData.content.RandomRotation)
      this._objectData.RandomRotation = newObjectData.content.RandomRotation;
    if (oldObjectData.content.RandomTint !== newObjectData.content.RandomTint)
      this._objectData.RandomTint = newObjectData.content.RandomTint;
    if (oldObjectData.content.Density !== newObjectData.content.Density)
      this._objectData.Density = newObjectData.content.Density;
    if (oldObjectData.content.Seed !== newObjectData.content.Seed)
      this._objectData.Seed = newObjectData.content.Seed;
    if (oldObjectData.content.Coverage !== newObjectData.content.Coverage)
      this._objectData.Coverage = newObjectData.content.Coverage;
    if (oldObjectData.content.GroundLayer !== newObjectData.content.GroundLayer)
      this._objectData.GroundLayer = newObjectData.content.GroundLayer;
    if (oldObjectData.content.MaxSlope !== newObjectData.content.MaxSlope)
      this._objectData.MaxSlope = newObjectData.content.MaxSlope;
    if (oldObjectData.content.MinGroundZ !== newObjectData.content.MinGroundZ)
      this._objectData.MinGroundZ = newObjectData.content.MinGroundZ;
    if (oldObjectData.content.MaxGroundZ !== newObjectData.content.MaxGroundZ)
      this._objectData.MaxGroundZ = newObjectData.content.MaxGroundZ;
    if (oldObjectData.content.TrunkCollisions !== newObjectData.content.TrunkCollisions)
      this._objectData.TrunkCollisions = newObjectData.content.TrunkCollisions;
    if (oldObjectData.content.TrunkDiameter !== newObjectData.content.TrunkDiameter)
      this._objectData.TrunkDiameter = newObjectData.content.TrunkDiameter;
    if (oldObjectData.content.DrawDistance !== newObjectData.content.DrawDistance)
      this._objectData.DrawDistance = newObjectData.content.DrawDistance;
    if (oldObjectData.content.CastShadow !== newObjectData.content.CastShadow)
      this._objectData.CastShadow = newObjectData.content.CastShadow;
    if (oldObjectData.content.ReceiveShadow !== newObjectData.content.ReceiveShadow)
      this._objectData.ReceiveShadow = newObjectData.content.ReceiveShadow;
    if (oldObjectData.content.Edits !== newObjectData.content.Edits)
      this._objectData.Edits = newObjectData.content.Edits;
    if (oldObjectData.content.PaintData !== newObjectData.content.PaintData)
      this._objectData.PaintData = newObjectData.content.PaintData;

    this.onHotReloading(this._parentInstanceContainer);
    return true;
  }

  // Properties:
  
  _getModel() {
    return this._objectData.Model !== undefined ? this._objectData.Model : "";
  }
  _setModel(newValue) {
    this._objectData.Model = newValue;
  }
  _getSize() {
    return this._objectData.Size !== undefined ? this._objectData.Size : Number("300") || 0;
  }
  _setSize(newValue) {
    this._objectData.Size = newValue;
  }
  _getMinScale() {
    return this._objectData.MinScale !== undefined ? this._objectData.MinScale : Number("0.8") || 0;
  }
  _setMinScale(newValue) {
    this._objectData.MinScale = newValue;
  }
  _getMaxScale() {
    return this._objectData.MaxScale !== undefined ? this._objectData.MaxScale : Number("1.2") || 0;
  }
  _setMaxScale(newValue) {
    this._objectData.MaxScale = newValue;
  }
  _getRandomRotation() {
    return this._objectData.RandomRotation !== undefined ? this._objectData.RandomRotation : true;
  }
  _setRandomRotation(newValue) {
    this._objectData.RandomRotation = newValue;
  }
  _toggleRandomRotation() {
    this._setRandomRotation(!this._getRandomRotation());
  }
  _getRandomTint() {
    return this._objectData.RandomTint !== undefined ? this._objectData.RandomTint : "255;255;255";
  }
  _setRandomTint(newValue) {
    this._objectData.RandomTint = newValue;
  }
  _getDensity() {
    return this._objectData.Density !== undefined ? this._objectData.Density : Number("0.3") || 0;
  }
  _setDensity(newValue) {
    this._objectData.Density = newValue;
  }
  _getSeed() {
    return this._objectData.Seed !== undefined ? this._objectData.Seed : Number("1") || 0;
  }
  _setSeed(newValue) {
    this._objectData.Seed = newValue;
  }
  _getCoverage() {
    return this._objectData.Coverage !== undefined ? this._objectData.Coverage : "Everywhere";
  }
  _setCoverage(newValue) {
    this._objectData.Coverage = newValue;
  }
  _getGroundLayer() {
    return this._objectData.GroundLayer !== undefined ? this._objectData.GroundLayer : "1";
  }
  _setGroundLayer(newValue) {
    this._objectData.GroundLayer = newValue;
  }
  _getMaxSlope() {
    return this._objectData.MaxSlope !== undefined ? this._objectData.MaxSlope : Number("30") || 0;
  }
  _setMaxSlope(newValue) {
    this._objectData.MaxSlope = newValue;
  }
  _getMinGroundZ() {
    return this._objectData.MinGroundZ !== undefined ? this._objectData.MinGroundZ : Number("-100000") || 0;
  }
  _setMinGroundZ(newValue) {
    this._objectData.MinGroundZ = newValue;
  }
  _getMaxGroundZ() {
    return this._objectData.MaxGroundZ !== undefined ? this._objectData.MaxGroundZ : Number("100000") || 0;
  }
  _setMaxGroundZ(newValue) {
    this._objectData.MaxGroundZ = newValue;
  }
  _getTrunkCollisions() {
    return this._objectData.TrunkCollisions !== undefined ? this._objectData.TrunkCollisions : false;
  }
  _setTrunkCollisions(newValue) {
    this._objectData.TrunkCollisions = newValue;
  }
  _toggleTrunkCollisions() {
    this._setTrunkCollisions(!this._getTrunkCollisions());
  }
  _getTrunkDiameter() {
    return this._objectData.TrunkDiameter !== undefined ? this._objectData.TrunkDiameter : Number("30") || 0;
  }
  _setTrunkDiameter(newValue) {
    this._objectData.TrunkDiameter = newValue;
  }
  _getDrawDistance() {
    return this._objectData.DrawDistance !== undefined ? this._objectData.DrawDistance : Number("8000") || 0;
  }
  _setDrawDistance(newValue) {
    this._objectData.DrawDistance = newValue;
  }
  _getCastShadow() {
    return this._objectData.CastShadow !== undefined ? this._objectData.CastShadow : true;
  }
  _setCastShadow(newValue) {
    this._objectData.CastShadow = newValue;
  }
  _toggleCastShadow() {
    this._setCastShadow(!this._getCastShadow());
  }
  _getReceiveShadow() {
    return this._objectData.ReceiveShadow !== undefined ? this._objectData.ReceiveShadow : true;
  }
  _setReceiveShadow(newValue) {
    this._objectData.ReceiveShadow = newValue;
  }
  _toggleReceiveShadow() {
    this._setReceiveShadow(!this._getReceiveShadow());
  }
  _getEdits() {
    return this._objectData.Edits !== undefined ? this._objectData.Edits : "";
  }
  _setEdits(newValue) {
    this._objectData.Edits = newValue;
  }
  _getPaintData() {
    return this._objectData.PaintData !== undefined ? this._objectData.PaintData : "";
  }
  _setPaintData(newValue) {
    this._objectData.PaintData = newValue;
  }

  

  
}

// Methods:
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects2= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects2= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.userFunc0x19b2c40 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
for (const child of object.getChildrenContainer().getAdhocListOfAllInstances()) {
    child.deleteFromScene();
}
if (object.__terrainScatter) object.__terrainScatter.dispose();
object.__terrainScatter = new gdjs.__terrainScatterExtension.Scatter(object);
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtsExt__Terrain3D__DefineHelperClasses.func(runtimeScene, eventsFunctionContext);
}
}

}


{


let isConditionTrue_0 = false;
{
{gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.func(runtimeScene, eventsFunctionContext);
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.userFunc0x19b2c40(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreated = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.CustomRuntimeObject.prototype.onCreated.call(this);

return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.userFunc0x19b2618 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrainScatter.dispose();
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.userFunc0x19b2618(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroy = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.userFunc0x19b2480 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const game = runtimeScene.getGame();
const isInGameEdition = game.isInGameEdition && game.isInGameEdition();
const elapsedTime = isInGameEdition ? 1 / 60 : object.getElapsedTime() / 1000;
const layer = object.getInstanceContainer().getLayer(object.getLayer());
object.__terrainScatter.update(elapsedTime, layer.getRenderer().getThreeCamera());
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.userFunc0x19b2480(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.userFunc0x19b55a0 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrainScatter.onHotReloading();
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.userFunc0x19b55a0(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloading = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.userFunc0x19b4808 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
object.__terrainScatter.addCopies(x, y, radius);
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.userFunc0x19b4808(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopies = function(X, Y, Radius, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
if (argName === "Radius") return Radius;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.AddCopiesContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.userFunc0x19b4808 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
object.__terrainScatter.removeCopies(x, y, radius);
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.userFunc0x19b4808(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopies = function(X, Y, Radius, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
if (argName === "Radius") return Radius;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.EraseCopiesContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.userFunc0x19aae18 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
eventsFunctionContext.returnValue = object.__terrainScatter.getCopyCount();
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.userFunc0x19aae18(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCount = function(parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.CopyCountContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.userFunc0x19b25d8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const copy = object.__terrainScatter.findNearestCopy(x, y);
eventsFunctionContext.returnValue = copy ? copy.x : x;
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.userFunc0x19b25d8(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyX = function(X, Y, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyXContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.userFunc0x19b4c60 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const copy = object.__terrainScatter.findNearestCopy(x, y);
eventsFunctionContext.returnValue = copy ? copy.y : y;
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.userFunc0x19b4c60(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyY = function(X, Y, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyYContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.userFunc0x19b4ec8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const copy = object.__terrainScatter.findNearestCopy(x, y);
eventsFunctionContext.returnValue = copy ? copy.z : object.getZ();
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.userFunc0x19b4ec8(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZ = function(X, Y, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyZContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext = {};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.userFunc0x19b4c50 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const copy = object.__terrainScatter.findNearestCopy(x, y);
eventsFunctionContext.returnValue = copy ? Math.hypot(copy.x - x, copy.y - y) : Number.MAX_VALUE;
};
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.userFunc0x19b4c50(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistance = function(X, Y, parentEventsFunctionContext) {

var that = this;
var runtimeScene = this._instanceContainer;
let scopeInstanceContainer = this._instanceContainer;
var thisObjectList = [this];
var Object = Hashtable.newFrom({Object: thisObjectList});
var thisGDAreaPlaceholderObjectsList = [...runtimeScene.getObjects("AreaPlaceholder")];
var GDAreaPlaceholderObjects = Hashtable.newFrom({"AreaPlaceholder": thisGDAreaPlaceholderObjectsList});
var eventsFunctionContext = {
  _objectsMap: {
"Object": Object
, "AreaPlaceholder": GDAreaPlaceholderObjects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Terrain3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Terrain3D"),
  localVariables: [],
  getObjects: function(objectName) {
    return eventsFunctionContext._objectArraysMap[objectName] || [];
  },
  getObjectsLists: function(objectName) {
    return eventsFunctionContext._objectsMap[objectName] || null;
  },
  getBehaviorName: function(behaviorName) {
    return eventsFunctionContext._behaviorNamesMap[behaviorName] || behaviorName;
  },
  createObject: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    if (objectsList) {
      const object = parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
        parentEventsFunctionContext.createObject(objectsList.firstKey()) :
        runtimeScene.createObject(objectsList.firstKey());
      if (object) {
        objectsList.get(objectsList.firstKey()).push(object);
        if (!(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName))) {
          eventsFunctionContext._objectArraysMap[objectName].push(object);
        }
      }
      return object;
    }
    return null;
  },
  getInstancesCountOnScene: function(objectName) {
    const objectsList = eventsFunctionContext._objectsMap[objectName];
    let count = 0;
    if (objectsList) {
      for(const objectName in objectsList.items)
        count += parentEventsFunctionContext && !(scopeInstanceContainer && scopeInstanceContainer.isObjectRegistered(objectName)) ?
parentEventsFunctionContext.getInstancesCountOnScene(objectName) :
        runtimeScene.getInstancesCountOnScene(objectName);
    }
    return count;
  },
  getLayer: function(layerName) {
    return runtimeScene.getLayer(layerName);
  },
  getArgument: function(argName) {
if (argName === "X") return X;
if (argName === "Y") return Y;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.NearestCopyDistanceContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels.prototype.doStepPreEvents = function() {
  this._instanceContainer.getOnceTriggers().startNewFrame();
};


gdjs.registerObject("Terrain3D::ScatteredModels", gdjs.evtsExt__Terrain3D__ScatteredModels.ScatteredModels);
