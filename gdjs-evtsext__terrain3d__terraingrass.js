
gdjs.evtsExt__Terrain3D__TerrainGrass = gdjs.evtsExt__Terrain3D__TerrainGrass || {};

/**
 * Object generated from Terrain grass
 */
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass = class TerrainGrass extends gdjs.CustomRuntimeObject3D {
  constructor(parentInstanceContainer, objectData, instanceData) {
    super(parentInstanceContainer, objectData, instanceData);
    this._parentInstanceContainer = parentInstanceContainer;

    this._objectData = {};
    
    this._objectData.Density = objectData.content.Density !== undefined ? objectData.content.Density : Number("60") || 0;
    this._objectData.BladeHeight = objectData.content.BladeHeight !== undefined ? objectData.content.BladeHeight : Number("36") || 0;
    this._objectData.BladeWidth = objectData.content.BladeWidth !== undefined ? objectData.content.BladeWidth : Number("5") || 0;
    this._objectData.BaseColor = objectData.content.BaseColor !== undefined ? objectData.content.BaseColor : "52;104;36";
    this._objectData.TipColor = objectData.content.TipColor !== undefined ? objectData.content.TipColor : "150;196;82";
    this._objectData.Seed = objectData.content.Seed !== undefined ? objectData.content.Seed : Number("1") || 0;
    this._objectData.GroundLayer = objectData.content.GroundLayer !== undefined ? objectData.content.GroundLayer : "1";
    this._objectData.MaxSlope = objectData.content.MaxSlope !== undefined ? objectData.content.MaxSlope : Number("40") || 0;
    this._objectData.WindStrength = objectData.content.WindStrength !== undefined ? objectData.content.WindStrength : Number("1") || 0;
    this._objectData.WindSpeed = objectData.content.WindSpeed !== undefined ? objectData.content.WindSpeed : Number("2") || 0;
    this._objectData.BendingObject = objectData.content.BendingObject !== undefined ? objectData.content.BendingObject : "";
    this._objectData.FadeDistance = objectData.content.FadeDistance !== undefined ? objectData.content.FadeDistance : Number("2500") || 0;
    

    // It calls the onCreated super implementation at the end.
    this.onCreated();
  }

  // Hot-reload:
  updateFromObjectData(oldObjectData, newObjectData) {
    super.updateFromObjectData(oldObjectData, newObjectData);
    if (oldObjectData.content.Density !== newObjectData.content.Density)
      this._objectData.Density = newObjectData.content.Density;
    if (oldObjectData.content.BladeHeight !== newObjectData.content.BladeHeight)
      this._objectData.BladeHeight = newObjectData.content.BladeHeight;
    if (oldObjectData.content.BladeWidth !== newObjectData.content.BladeWidth)
      this._objectData.BladeWidth = newObjectData.content.BladeWidth;
    if (oldObjectData.content.BaseColor !== newObjectData.content.BaseColor)
      this._objectData.BaseColor = newObjectData.content.BaseColor;
    if (oldObjectData.content.TipColor !== newObjectData.content.TipColor)
      this._objectData.TipColor = newObjectData.content.TipColor;
    if (oldObjectData.content.Seed !== newObjectData.content.Seed)
      this._objectData.Seed = newObjectData.content.Seed;
    if (oldObjectData.content.GroundLayer !== newObjectData.content.GroundLayer)
      this._objectData.GroundLayer = newObjectData.content.GroundLayer;
    if (oldObjectData.content.MaxSlope !== newObjectData.content.MaxSlope)
      this._objectData.MaxSlope = newObjectData.content.MaxSlope;
    if (oldObjectData.content.WindStrength !== newObjectData.content.WindStrength)
      this._objectData.WindStrength = newObjectData.content.WindStrength;
    if (oldObjectData.content.WindSpeed !== newObjectData.content.WindSpeed)
      this._objectData.WindSpeed = newObjectData.content.WindSpeed;
    if (oldObjectData.content.BendingObject !== newObjectData.content.BendingObject)
      this._objectData.BendingObject = newObjectData.content.BendingObject;
    if (oldObjectData.content.FadeDistance !== newObjectData.content.FadeDistance)
      this._objectData.FadeDistance = newObjectData.content.FadeDistance;

    this.onHotReloading(this._parentInstanceContainer);
    return true;
  }

  // Properties:
  
  _getDensity() {
    return this._objectData.Density !== undefined ? this._objectData.Density : Number("60") || 0;
  }
  _setDensity(newValue) {
    this._objectData.Density = newValue;
  }
  _getBladeHeight() {
    return this._objectData.BladeHeight !== undefined ? this._objectData.BladeHeight : Number("36") || 0;
  }
  _setBladeHeight(newValue) {
    this._objectData.BladeHeight = newValue;
  }
  _getBladeWidth() {
    return this._objectData.BladeWidth !== undefined ? this._objectData.BladeWidth : Number("5") || 0;
  }
  _setBladeWidth(newValue) {
    this._objectData.BladeWidth = newValue;
  }
  _getBaseColor() {
    return this._objectData.BaseColor !== undefined ? this._objectData.BaseColor : "52;104;36";
  }
  _setBaseColor(newValue) {
    this._objectData.BaseColor = newValue;
  }
  _getTipColor() {
    return this._objectData.TipColor !== undefined ? this._objectData.TipColor : "150;196;82";
  }
  _setTipColor(newValue) {
    this._objectData.TipColor = newValue;
  }
  _getSeed() {
    return this._objectData.Seed !== undefined ? this._objectData.Seed : Number("1") || 0;
  }
  _setSeed(newValue) {
    this._objectData.Seed = newValue;
  }
  _getGroundLayer() {
    return this._objectData.GroundLayer !== undefined ? this._objectData.GroundLayer : "1";
  }
  _setGroundLayer(newValue) {
    this._objectData.GroundLayer = newValue;
  }
  _getMaxSlope() {
    return this._objectData.MaxSlope !== undefined ? this._objectData.MaxSlope : Number("40") || 0;
  }
  _setMaxSlope(newValue) {
    this._objectData.MaxSlope = newValue;
  }
  _getWindStrength() {
    return this._objectData.WindStrength !== undefined ? this._objectData.WindStrength : Number("1") || 0;
  }
  _setWindStrength(newValue) {
    this._objectData.WindStrength = newValue;
  }
  _getWindSpeed() {
    return this._objectData.WindSpeed !== undefined ? this._objectData.WindSpeed : Number("2") || 0;
  }
  _setWindSpeed(newValue) {
    this._objectData.WindSpeed = newValue;
  }
  _getBendingObject() {
    return this._objectData.BendingObject !== undefined ? this._objectData.BendingObject : "";
  }
  _setBendingObject(newValue) {
    this._objectData.BendingObject = newValue;
  }
  _getFadeDistance() {
    return this._objectData.FadeDistance !== undefined ? this._objectData.FadeDistance : Number("2500") || 0;
  }
  _setFadeDistance(newValue) {
    this._objectData.FadeDistance = newValue;
  }

  

  
}

// Methods:
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext = {};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects2= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects1= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects2= [];


gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.userFunc0x1968298 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
for (const child of object.getChildrenContainer().getAdhocListOfAllInstances()) {
    child.deleteFromScene();
}
if (object.__terrainGrass) object.__terrainGrass.dispose();
object.__terrainGrass = new gdjs.__terrainGrassExtension.Grass(object);
};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

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
{gdjs.evtsExt__Terrain3D__DefineGrassHelperClasses.func(runtimeScene, eventsFunctionContext);
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.userFunc0x1968298(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreated = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.CustomRuntimeObject.prototype.onCreated.call(this);

return;
}
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext = {};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.userFunc0x1966e40 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrainGrass.dispose();
};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.userFunc0x1966e40(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroy = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.userFunc0x1966b50 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const game = runtimeScene.getGame();
// Time doesn't pass in the scene editor: real time is used to show the wind.
const isInGameEdition = game.isInGameEdition && game.isInGameEdition();
const elapsedTime = isInGameEdition ? 1 / 60 : object.getElapsedTime() / 1000;
const time = isInGameEdition
    ? performance.now() / 1000
    : object.getRuntimeScene().getTimeManager().getTimeFromStart() / 1000;
const layer = object.getInstanceContainer().getLayer(object.getLayer());
object.__terrainGrass.update(elapsedTime, time, layer.getRenderer().getThreeCamera());
};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.userFunc0x1966b50(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext = {};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.userFunc0x1966b50 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrainGrass.updateFromProperties();
};
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.userFunc0x1966b50(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloading = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;


return;
}

gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass.prototype.doStepPreEvents = function() {
  this._instanceContainer.getOnceTriggers().startNewFrame();
};


gdjs.registerObject("Terrain3D::TerrainGrass", gdjs.evtsExt__Terrain3D__TerrainGrass.TerrainGrass);
