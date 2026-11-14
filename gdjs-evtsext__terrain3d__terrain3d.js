
gdjs.evtsExt__Terrain3D__Terrain3D = gdjs.evtsExt__Terrain3D__Terrain3D || {};

/**
 * Object generated from 3D terrain
 */
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D = class Terrain3D extends gdjs.CustomRuntimeObject3D {
  constructor(parentInstanceContainer, objectData, instanceData) {
    super(parentInstanceContainer, objectData, instanceData);
    this._parentInstanceContainer = parentInstanceContainer;

    this._objectData = {};
    
    this._objectData.Relief = objectData.content.Relief !== undefined ? objectData.content.Relief : "Hills";
    this._objectData.Seed = objectData.content.Seed !== undefined ? objectData.content.Seed : Number("1") || 0;
    this._objectData.HeightmapImage = objectData.content.HeightmapImage !== undefined ? objectData.content.HeightmapImage : "";
    this._objectData.Edits = objectData.content.Edits !== undefined ? objectData.content.Edits : "";
    this._objectData.Resolution = objectData.content.Resolution !== undefined ? objectData.content.Resolution : "256";
    this._objectData.Layer1Color = objectData.content.Layer1Color !== undefined ? objectData.content.Layer1Color : "96;160;64";
    this._objectData.Layer1Texture = objectData.content.Layer1Texture !== undefined ? objectData.content.Layer1Texture : "";
    this._objectData.Layer1NormalMap = objectData.content.Layer1NormalMap !== undefined ? objectData.content.Layer1NormalMap : "";
    this._objectData.Layer2Color = objectData.content.Layer2Color !== undefined ? objectData.content.Layer2Color : "150;112;72";
    this._objectData.Layer2Texture = objectData.content.Layer2Texture !== undefined ? objectData.content.Layer2Texture : "";
    this._objectData.Layer2NormalMap = objectData.content.Layer2NormalMap !== undefined ? objectData.content.Layer2NormalMap : "";
    this._objectData.Layer3Color = objectData.content.Layer3Color !== undefined ? objectData.content.Layer3Color : "124;118;112";
    this._objectData.Layer3Texture = objectData.content.Layer3Texture !== undefined ? objectData.content.Layer3Texture : "";
    this._objectData.Layer3NormalMap = objectData.content.Layer3NormalMap !== undefined ? objectData.content.Layer3NormalMap : "";
    this._objectData.Layer4Color = objectData.content.Layer4Color !== undefined ? objectData.content.Layer4Color : "224;204;148";
    this._objectData.Layer4Texture = objectData.content.Layer4Texture !== undefined ? objectData.content.Layer4Texture : "";
    this._objectData.Layer4NormalMap = objectData.content.Layer4NormalMap !== undefined ? objectData.content.Layer4NormalMap : "";
    this._objectData.NormalMapStrength = objectData.content.NormalMapStrength !== undefined ? objectData.content.NormalMapStrength : Number("1") || 0;
    this._objectData.TextureSize = objectData.content.TextureSize !== undefined ? objectData.content.TextureSize : Number("256") || 0;
    this._objectData.HeightBlending = objectData.content.HeightBlending !== undefined ? objectData.content.HeightBlending : Number("0.5") || 0;
    this._objectData.TextureVariation = objectData.content.TextureVariation !== undefined ? objectData.content.TextureVariation : Number("0.5") || 0;
    this._objectData.WetShore = objectData.content.WetShore !== undefined ? objectData.content.WetShore : false;
    this._objectData.WetShoreZ = objectData.content.WetShoreZ !== undefined ? objectData.content.WetShoreZ : Number("0") || 0;
    this._objectData.WetShoreFade = objectData.content.WetShoreFade !== undefined ? objectData.content.WetShoreFade : Number("60") || 0;
    this._objectData.CliffLayer = objectData.content.CliffLayer !== undefined ? objectData.content.CliffLayer : "3";
    this._objectData.CliffAngle = objectData.content.CliffAngle !== undefined ? objectData.content.CliffAngle : Number("45") || 0;
    this._objectData.CastShadow = objectData.content.CastShadow !== undefined ? objectData.content.CastShadow : true;
    this._objectData.ReceiveShadow = objectData.content.ReceiveShadow !== undefined ? objectData.content.ReceiveShadow : true;
    this._objectData.SculptData = objectData.content.SculptData !== undefined ? objectData.content.SculptData : "";
    

    // It calls the onCreated super implementation at the end.
    this.onCreated();
  }

  // Hot-reload:
  updateFromObjectData(oldObjectData, newObjectData) {
    super.updateFromObjectData(oldObjectData, newObjectData);
    if (oldObjectData.content.Relief !== newObjectData.content.Relief)
      this._objectData.Relief = newObjectData.content.Relief;
    if (oldObjectData.content.Seed !== newObjectData.content.Seed)
      this._objectData.Seed = newObjectData.content.Seed;
    if (oldObjectData.content.HeightmapImage !== newObjectData.content.HeightmapImage)
      this._objectData.HeightmapImage = newObjectData.content.HeightmapImage;
    if (oldObjectData.content.Edits !== newObjectData.content.Edits)
      this._objectData.Edits = newObjectData.content.Edits;
    if (oldObjectData.content.Resolution !== newObjectData.content.Resolution)
      this._objectData.Resolution = newObjectData.content.Resolution;
    if (oldObjectData.content.Layer1Color !== newObjectData.content.Layer1Color)
      this._objectData.Layer1Color = newObjectData.content.Layer1Color;
    if (oldObjectData.content.Layer1Texture !== newObjectData.content.Layer1Texture)
      this._objectData.Layer1Texture = newObjectData.content.Layer1Texture;
    if (oldObjectData.content.Layer1NormalMap !== newObjectData.content.Layer1NormalMap)
      this._objectData.Layer1NormalMap = newObjectData.content.Layer1NormalMap;
    if (oldObjectData.content.Layer2Color !== newObjectData.content.Layer2Color)
      this._objectData.Layer2Color = newObjectData.content.Layer2Color;
    if (oldObjectData.content.Layer2Texture !== newObjectData.content.Layer2Texture)
      this._objectData.Layer2Texture = newObjectData.content.Layer2Texture;
    if (oldObjectData.content.Layer2NormalMap !== newObjectData.content.Layer2NormalMap)
      this._objectData.Layer2NormalMap = newObjectData.content.Layer2NormalMap;
    if (oldObjectData.content.Layer3Color !== newObjectData.content.Layer3Color)
      this._objectData.Layer3Color = newObjectData.content.Layer3Color;
    if (oldObjectData.content.Layer3Texture !== newObjectData.content.Layer3Texture)
      this._objectData.Layer3Texture = newObjectData.content.Layer3Texture;
    if (oldObjectData.content.Layer3NormalMap !== newObjectData.content.Layer3NormalMap)
      this._objectData.Layer3NormalMap = newObjectData.content.Layer3NormalMap;
    if (oldObjectData.content.Layer4Color !== newObjectData.content.Layer4Color)
      this._objectData.Layer4Color = newObjectData.content.Layer4Color;
    if (oldObjectData.content.Layer4Texture !== newObjectData.content.Layer4Texture)
      this._objectData.Layer4Texture = newObjectData.content.Layer4Texture;
    if (oldObjectData.content.Layer4NormalMap !== newObjectData.content.Layer4NormalMap)
      this._objectData.Layer4NormalMap = newObjectData.content.Layer4NormalMap;
    if (oldObjectData.content.NormalMapStrength !== newObjectData.content.NormalMapStrength)
      this._objectData.NormalMapStrength = newObjectData.content.NormalMapStrength;
    if (oldObjectData.content.TextureSize !== newObjectData.content.TextureSize)
      this._objectData.TextureSize = newObjectData.content.TextureSize;
    if (oldObjectData.content.HeightBlending !== newObjectData.content.HeightBlending)
      this._objectData.HeightBlending = newObjectData.content.HeightBlending;
    if (oldObjectData.content.TextureVariation !== newObjectData.content.TextureVariation)
      this._objectData.TextureVariation = newObjectData.content.TextureVariation;
    if (oldObjectData.content.WetShore !== newObjectData.content.WetShore)
      this._objectData.WetShore = newObjectData.content.WetShore;
    if (oldObjectData.content.WetShoreZ !== newObjectData.content.WetShoreZ)
      this._objectData.WetShoreZ = newObjectData.content.WetShoreZ;
    if (oldObjectData.content.WetShoreFade !== newObjectData.content.WetShoreFade)
      this._objectData.WetShoreFade = newObjectData.content.WetShoreFade;
    if (oldObjectData.content.CliffLayer !== newObjectData.content.CliffLayer)
      this._objectData.CliffLayer = newObjectData.content.CliffLayer;
    if (oldObjectData.content.CliffAngle !== newObjectData.content.CliffAngle)
      this._objectData.CliffAngle = newObjectData.content.CliffAngle;
    if (oldObjectData.content.CastShadow !== newObjectData.content.CastShadow)
      this._objectData.CastShadow = newObjectData.content.CastShadow;
    if (oldObjectData.content.ReceiveShadow !== newObjectData.content.ReceiveShadow)
      this._objectData.ReceiveShadow = newObjectData.content.ReceiveShadow;
    if (oldObjectData.content.SculptData !== newObjectData.content.SculptData)
      this._objectData.SculptData = newObjectData.content.SculptData;

    this.onHotReloading(this._parentInstanceContainer);
    return true;
  }

  // Properties:
  
  _getRelief() {
    return this._objectData.Relief !== undefined ? this._objectData.Relief : "Hills";
  }
  _setRelief(newValue) {
    this._objectData.Relief = newValue;
  }
  _getSeed() {
    return this._objectData.Seed !== undefined ? this._objectData.Seed : Number("1") || 0;
  }
  _setSeed(newValue) {
    this._objectData.Seed = newValue;
  }
  _getHeightmapImage() {
    return this._objectData.HeightmapImage !== undefined ? this._objectData.HeightmapImage : "";
  }
  _setHeightmapImage(newValue) {
    this._objectData.HeightmapImage = newValue;
  }
  _getEdits() {
    return this._objectData.Edits !== undefined ? this._objectData.Edits : "";
  }
  _setEdits(newValue) {
    this._objectData.Edits = newValue;
  }
  _getResolution() {
    return this._objectData.Resolution !== undefined ? this._objectData.Resolution : "256";
  }
  _setResolution(newValue) {
    this._objectData.Resolution = newValue;
  }
  _getLayer1Color() {
    return this._objectData.Layer1Color !== undefined ? this._objectData.Layer1Color : "96;160;64";
  }
  _setLayer1Color(newValue) {
    this._objectData.Layer1Color = newValue;
  }
  _getLayer1Texture() {
    return this._objectData.Layer1Texture !== undefined ? this._objectData.Layer1Texture : "";
  }
  _setLayer1Texture(newValue) {
    this._objectData.Layer1Texture = newValue;
  }
  _getLayer1NormalMap() {
    return this._objectData.Layer1NormalMap !== undefined ? this._objectData.Layer1NormalMap : "";
  }
  _setLayer1NormalMap(newValue) {
    this._objectData.Layer1NormalMap = newValue;
  }
  _getLayer2Color() {
    return this._objectData.Layer2Color !== undefined ? this._objectData.Layer2Color : "150;112;72";
  }
  _setLayer2Color(newValue) {
    this._objectData.Layer2Color = newValue;
  }
  _getLayer2Texture() {
    return this._objectData.Layer2Texture !== undefined ? this._objectData.Layer2Texture : "";
  }
  _setLayer2Texture(newValue) {
    this._objectData.Layer2Texture = newValue;
  }
  _getLayer2NormalMap() {
    return this._objectData.Layer2NormalMap !== undefined ? this._objectData.Layer2NormalMap : "";
  }
  _setLayer2NormalMap(newValue) {
    this._objectData.Layer2NormalMap = newValue;
  }
  _getLayer3Color() {
    return this._objectData.Layer3Color !== undefined ? this._objectData.Layer3Color : "124;118;112";
  }
  _setLayer3Color(newValue) {
    this._objectData.Layer3Color = newValue;
  }
  _getLayer3Texture() {
    return this._objectData.Layer3Texture !== undefined ? this._objectData.Layer3Texture : "";
  }
  _setLayer3Texture(newValue) {
    this._objectData.Layer3Texture = newValue;
  }
  _getLayer3NormalMap() {
    return this._objectData.Layer3NormalMap !== undefined ? this._objectData.Layer3NormalMap : "";
  }
  _setLayer3NormalMap(newValue) {
    this._objectData.Layer3NormalMap = newValue;
  }
  _getLayer4Color() {
    return this._objectData.Layer4Color !== undefined ? this._objectData.Layer4Color : "224;204;148";
  }
  _setLayer4Color(newValue) {
    this._objectData.Layer4Color = newValue;
  }
  _getLayer4Texture() {
    return this._objectData.Layer4Texture !== undefined ? this._objectData.Layer4Texture : "";
  }
  _setLayer4Texture(newValue) {
    this._objectData.Layer4Texture = newValue;
  }
  _getLayer4NormalMap() {
    return this._objectData.Layer4NormalMap !== undefined ? this._objectData.Layer4NormalMap : "";
  }
  _setLayer4NormalMap(newValue) {
    this._objectData.Layer4NormalMap = newValue;
  }
  _getNormalMapStrength() {
    return this._objectData.NormalMapStrength !== undefined ? this._objectData.NormalMapStrength : Number("1") || 0;
  }
  _setNormalMapStrength(newValue) {
    this._objectData.NormalMapStrength = newValue;
  }
  _getTextureSize() {
    return this._objectData.TextureSize !== undefined ? this._objectData.TextureSize : Number("256") || 0;
  }
  _setTextureSize(newValue) {
    this._objectData.TextureSize = newValue;
  }
  _getHeightBlending() {
    return this._objectData.HeightBlending !== undefined ? this._objectData.HeightBlending : Number("0.5") || 0;
  }
  _setHeightBlending(newValue) {
    this._objectData.HeightBlending = newValue;
  }
  _getTextureVariation() {
    return this._objectData.TextureVariation !== undefined ? this._objectData.TextureVariation : Number("0.5") || 0;
  }
  _setTextureVariation(newValue) {
    this._objectData.TextureVariation = newValue;
  }
  _getWetShore() {
    return this._objectData.WetShore !== undefined ? this._objectData.WetShore : false;
  }
  _setWetShore(newValue) {
    this._objectData.WetShore = newValue;
  }
  _toggleWetShore() {
    this._setWetShore(!this._getWetShore());
  }
  _getWetShoreZ() {
    return this._objectData.WetShoreZ !== undefined ? this._objectData.WetShoreZ : Number("0") || 0;
  }
  _setWetShoreZ(newValue) {
    this._objectData.WetShoreZ = newValue;
  }
  _getWetShoreFade() {
    return this._objectData.WetShoreFade !== undefined ? this._objectData.WetShoreFade : Number("60") || 0;
  }
  _setWetShoreFade(newValue) {
    this._objectData.WetShoreFade = newValue;
  }
  _getCliffLayer() {
    return this._objectData.CliffLayer !== undefined ? this._objectData.CliffLayer : "3";
  }
  _setCliffLayer(newValue) {
    this._objectData.CliffLayer = newValue;
  }
  _getCliffAngle() {
    return this._objectData.CliffAngle !== undefined ? this._objectData.CliffAngle : Number("45") || 0;
  }
  _setCliffAngle(newValue) {
    this._objectData.CliffAngle = newValue;
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
  _getSculptData() {
    return this._objectData.SculptData !== undefined ? this._objectData.SculptData : "";
  }
  _setSculptData(newValue) {
    this._objectData.SculptData = newValue;
  }

  

  
}

// Methods:
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects2= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects2= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.userFunc0x196f318 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
for (const child of object.getChildrenContainer().getAdhocListOfAllInstances()) {
    child.deleteFromScene();
}
if (object.__terrain3D) object.__terrain3D.dispose();
object.__terrain3D = new gdjs.__terrain3DExtension.Terrain(object);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


let isConditionTrue_0 = false;
{
{gdjs.evtsExt__Terrain3D__DefineHelperClasses.func(runtimeScene, eventsFunctionContext);
}
}

}


{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.userFunc0x196f318(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreated = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDObjectObjects2.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onCreatedContext.GDAreaPlaceholderObjects2.length = 0;

gdjs.CustomRuntimeObject.prototype.onCreated.call(this);

return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.userFunc0x196e438 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrain3D.dispose();
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.userFunc0x196e438(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroy = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onDestroyContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.userFunc0x196e9d8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrain3D.update();
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.userFunc0x196e9d8(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEvents = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPostEventsContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.userFunc0x1968e28 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrain3D.onHotReloading();
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.userFunc0x1968e28(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloading = function(parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.onHotReloadingContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.userFunc0x196d1e0 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const height = eventsFunctionContext.getArgument("Height");
object.__terrain3D.raise(x, y, x, y, radius, height);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.userFunc0x196d1e0(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGround = function(X, Y, Radius, Height, parentEventsFunctionContext) {

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
if (argName === "Height") return Height;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.userFunc0x196d838 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x1 = eventsFunctionContext.getArgument("X1");
const y1 = eventsFunctionContext.getArgument("Y1");
const x2 = eventsFunctionContext.getArgument("X2");
const y2 = eventsFunctionContext.getArgument("Y2");
const radius = eventsFunctionContext.getArgument("Radius");
const height = eventsFunctionContext.getArgument("Height");
object.__terrain3D.raise(x1, y1, x2, y2, radius, height);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.userFunc0x196d838(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLine = function(X1, Y1, X2, Y2, Radius, Height, parentEventsFunctionContext) {

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
if (argName === "X1") return X1;
if (argName === "Y1") return Y1;
if (argName === "X2") return X2;
if (argName === "Y2") return Y2;
if (argName === "Radius") return Radius;
if (argName === "Height") return Height;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.RaiseGroundAlongLineContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.userFunc0x1980ad0 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const z = eventsFunctionContext.getArgument("Z");
object.__terrain3D.flatten(x, y, x, y, radius, z, 1);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.userFunc0x1980ad0(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGround = function(X, Y, Radius, Z, parentEventsFunctionContext) {

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
if (argName === "Z") return Z;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FlattenGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.userFunc0x1984f98 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const strength = eventsFunctionContext.getArgument("Strength");
object.__terrain3D.smooth(x, y, x, y, radius, strength);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.userFunc0x1984f98(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGround = function(X, Y, Radius, Strength, parentEventsFunctionContext) {

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
if (argName === "Strength") return Strength;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.SmoothGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.userFunc0x1986b38 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const layer = eventsFunctionContext.getArgument("Layer");
object.__terrain3D.paint(x, y, x, y, radius, layer, 1);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.userFunc0x1986b38(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayer = function(X, Y, Radius, Layer, parentEventsFunctionContext) {

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
if (argName === "Layer") return Layer;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.userFunc0x19887c8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x1 = eventsFunctionContext.getArgument("X1");
const y1 = eventsFunctionContext.getArgument("Y1");
const x2 = eventsFunctionContext.getArgument("X2");
const y2 = eventsFunctionContext.getArgument("Y2");
const radius = eventsFunctionContext.getArgument("Radius");
const layer = eventsFunctionContext.getArgument("Layer");
object.__terrain3D.paint(x1, y1, x2, y2, radius, layer, 1);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.userFunc0x19887c8(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLine = function(X1, Y1, X2, Y2, Radius, Layer, parentEventsFunctionContext) {

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
if (argName === "X1") return X1;
if (argName === "Y1") return Y1;
if (argName === "X2") return X2;
if (argName === "Y2") return Y2;
if (argName === "Radius") return Radius;
if (argName === "Layer") return Layer;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PaintLayerAlongLineContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.userFunc0x198a368 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const color = gdjs.rgbOrHexToRGBColor(eventsFunctionContext.getArgument("Color"));
object.__terrain3D.tint(x, y, x, y, radius, color, 1);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.userFunc0x198a368(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGround = function(X, Y, Radius, Color, parentEventsFunctionContext) {

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
if (argName === "Color") return Color;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.TintGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.userFunc0x198bf08 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const wetness = eventsFunctionContext.getArgument("Wetness");
object.__terrain3D.wet(x, y, x, y, radius, wetness, 1);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.userFunc0x198bf08(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGround = function(X, Y, Radius, Wetness, parentEventsFunctionContext) {

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
if (argName === "Wetness") return Wetness;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.WetGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.userFunc0x198da70 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.getWetnessAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.userFunc0x198da70(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetness = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundWetnessContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.userFunc0x198f5b8 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.getTintAt(x, y).join(";");
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.userFunc0x198f5b8(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTint = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundTintContext.GDAreaPlaceholderObjects1.length = 0;


return "" + eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.userFunc0x1991138 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
object.__terrain3D.makeHole(x, y, x, y, radius);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.userFunc0x1991138(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHole = function(X, Y, Radius, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.MakeHoleContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.userFunc0x1992c78 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
object.__terrain3D.fillHoles(x, y, x, y, radius);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.userFunc0x1992c78(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHoles = function(X, Y, Radius, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.FillHolesContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.userFunc0x1994988 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const radius = eventsFunctionContext.getArgument("Radius");
const angle = eventsFunctionContext.getArgument("Angle");
const floorZ = eventsFunctionContext.getArgument("FloorZ");
const length = eventsFunctionContext.getArgument("Length");
object.__terrain3D.carveEntrance(x, y, radius, angle, floorZ, length);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.userFunc0x1994988(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntrance = function(X, Y, Radius, Angle, FloorZ, Length, parentEventsFunctionContext) {

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
if (argName === "Angle") return Angle;
if (argName === "FloorZ") return FloorZ;
if (argName === "Length") return Length;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.CarveEntranceContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.userFunc0x1983830 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.isHoleAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.userFunc0x1983830(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHole = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.IsHoleContext.GDAreaPlaceholderObjects1.length = 0;


return !!eventsFunctionContext.returnValue;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.userFunc0x1986f68 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
const terrain = object.__terrain3D;
eventsFunctionContext.returnValue = terrain.isHoleAt(x, y) ? eventsFunctionContext.getArgument("ZInHoles") : terrain.getHeightAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.userFunc0x1986f68(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHoles = function(X, Y, ZInHoles, parentEventsFunctionContext) {

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
if (argName === "ZInHoles") return ZInHoles;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZWithHolesContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.userFunc0x198c380 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const relief = eventsFunctionContext.getArgument("Relief");
const seed = eventsFunctionContext.getArgument("Seed");
object.__terrain3D.generate(relief, seed);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.userFunc0x198c380(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateRelief = function(Relief, Seed, parentEventsFunctionContext) {

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
if (argName === "Relief") return Relief;
if (argName === "Seed") return Seed;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GenerateReliefContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.userFunc0x19930f0 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const image = eventsFunctionContext.getArgument("Image");
object.__terrain3D.loadHeightmap(image);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.userFunc0x19930f0(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmap = function(Image, parentEventsFunctionContext) {

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
if (argName === "Image") return Image;
    return "";
  },
  getOnceTriggers: function() { return runtimeScene.getOnceTriggers(); }
};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.LoadHeightmapContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectsObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.userFunc0x198deb0 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
object.__terrain3D.placeOnGround(eventsFunctionContext.getObjects("Objects"));
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.userFunc0x198deb0(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGround = function(Objects, parentEventsFunctionContext) {

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
, "Objects": Objects
},
  _objectArraysMap: {
"Object": thisObjectList
, "AreaPlaceholder": thisGDAreaPlaceholderObjectsList
, "Objects": gdjs.objectsListsToArray(Objects)
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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectsObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDObjectsObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.PutOnGroundContext.GDAreaPlaceholderObjects1.length = 0;


return;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.userFunc0x198fa08 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.getHeightAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.userFunc0x198fa08(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZ = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundZContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.userFunc0x196e650 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.getSlopeAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.userFunc0x196e650(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlope = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundSlopeContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext = {};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.idToCallbackMap = new Map();
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDObjectObjects1= [];
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDAreaPlaceholderObjects1= [];


gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.userFunc0x196e650 = function GDJSInlineCode(runtimeScene, objects, eventsFunctionContext) {
"use strict";
/** @type {gdjs.CustomRuntimeObject3D} */
const object = objects[0];
const x = eventsFunctionContext.getArgument("X");
const y = eventsFunctionContext.getArgument("Y");
eventsFunctionContext.returnValue = object.__terrain3D.getLayerAt(x, y);
};
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{

gdjs.copyArray(eventsFunctionContext.getObjects("Object"), gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDObjectObjects1);

const objects = gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDObjectObjects1;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.userFunc0x196e650(runtimeScene, objects, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayer = function(X, Y, parentEventsFunctionContext) {

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

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDAreaPlaceholderObjects1.length = 0;

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.eventsList0(runtimeScene, eventsFunctionContext);
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDObjectObjects1.length = 0;
gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.GroundLayerContext.GDAreaPlaceholderObjects1.length = 0;


return Number(eventsFunctionContext.returnValue) || 0;
}

gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D.prototype.doStepPreEvents = function() {
  this._instanceContainer.getOnceTriggers().startNewFrame();
};


gdjs.registerObject("Terrain3D::Terrain3D", gdjs.evtsExt__Terrain3D__Terrain3D.Terrain3D);
