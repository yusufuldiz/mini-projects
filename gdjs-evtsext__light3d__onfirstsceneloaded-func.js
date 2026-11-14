
if (typeof gdjs.evtsExt__Light3D__onFirstSceneLoaded !== "undefined") {
  gdjs.evtsExt__Light3D__onFirstSceneLoaded.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Light3D__onFirstSceneLoaded = {};
gdjs.evtsExt__Light3D__onFirstSceneLoaded.idToCallbackMap = new Map();


gdjs.evtsExt__Light3D__onFirstSceneLoaded.userFunc0x983a38 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
// Before Three.js r165, GDevelop rendered with "legacy lights": point and spot
// lights faded linearly up to their range and every light color was
// multiplied by PI. Recent GDevelop versions use the physically based falloff
// of Three.js r185 instead, which is what the light properties are tuned for.
// Use the same falloff with older GDevelop versions so that lights look the
// same with every version:
// - distances are divided by 100 because recent GDevelop versions render 3D
//   with a default world scale of 100 pixels per unit, while older versions
//   work in pixels,
// - the attenuation is divided by PI as the legacy light colors are multiplied by PI.
// It must be patched before any shader using lights is compiled, as Three.js
// caches compiled shaders.
const lightsParsBegin = THREE.ShaderChunk.lights_pars_begin;
if (!lightsParsBegin.includes('#if defined ( LEGACY_LIGHTS )')) {
    return;
}
THREE.ShaderChunk.lights_pars_begin = lightsParsBegin.replace(
    /#if defined \( LEGACY_LIGHTS \)[\s\S]*?#else/,
    [
        '#if defined ( LEGACY_LIGHTS )',
        '\t\tfloat distanceFalloff = 1.0 / max( pow( lightDistance * 0.01, decayExponent ), 0.01 );',
        '\t\tif ( cutoffDistance > 0.0 ) {',
        '\t\t\tdistanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );',
        '\t\t}',
        '\t\treturn distanceFalloff * RECIPROCAL_PI;',
        '\t#else',
    ].join('\n')
);
};
gdjs.evtsExt__Light3D__onFirstSceneLoaded.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Light3D__onFirstSceneLoaded.userFunc0x983a38(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__Light3D__onFirstSceneLoaded.func = function(runtimeScene, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
},
  _behaviorNamesMap: {
},
  globalVariablesForExtension: runtimeScene.getGame().getVariablesForExtension("Light3D"),
  sceneVariablesForExtension: runtimeScene.getScene().getVariablesForExtension("Light3D"),
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


gdjs.evtsExt__Light3D__onFirstSceneLoaded.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__Light3D__onFirstSceneLoaded.registeredGdjsCallbacks = [];
gdjs.evtsExt__Light3D__onFirstSceneLoaded.registeredGdjsCallbacks.push((runtimeScene) => {
    gdjs.evtsExt__Light3D__onFirstSceneLoaded.func(runtimeScene, runtimeScene);
})
gdjs.registerFirstRuntimeSceneLoadedCallback(gdjs.evtsExt__Light3D__onFirstSceneLoaded.registeredGdjsCallbacks[gdjs.evtsExt__Light3D__onFirstSceneLoaded.registeredGdjsCallbacks.length - 1]);
