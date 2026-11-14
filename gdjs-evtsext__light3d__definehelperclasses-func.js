
if (typeof gdjs.evtsExt__Light3D__DefineHelperClasses !== "undefined") {
  gdjs.evtsExt__Light3D__DefineHelperClasses.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Light3D__DefineHelperClasses = {};
gdjs.evtsExt__Light3D__DefineHelperClasses.idToCallbackMap = new Map();


gdjs.evtsExt__Light3D__DefineHelperClasses.userFunc0xad17a0 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
//@ts-ignore
if (gdjs.__light3DExtension) {
    //@ts-ignore
    return;
}

/**
 * @typedef {gdjs.CustomRuntimeObject3D & {__light3D: THREE.SpotLight | THREE.PointLight, _getIsCastingShadow: () => boolean}} LightRuntimeObject
 */

const game = runtimeScene.getGame();
const isInGameEdition = game.isInGameEdition && game.isInGameEdition();
const logger = new gdjs.Logger('3D lights');


class Light3DRenderer extends gdjs.CustomRuntimeObject3DRenderer {

    constructor(
        object,
        instanceContainer,
        parent
    ) {
        super(object, instanceContainer, parent);
    }

    _updateThreeGroup() {
        /** @type {LightRuntimeObject} */
        //@ts-ignore
        const object = this._object;
        const threeObject3D = this.get3DRendererObject();

        threeObject3D.rotation.set(
            gdjs.toRad(object.getRotationX()),
            gdjs.toRad(object.getRotationY()),
            gdjs.toRad(object.angle)
        );

        threeObject3D.position.set(
            object.getX(),
            object.getY(),
            object.getZ()
        );

        // Force the scale to 1 because the light doesn't really has a size.
        threeObject3D.scale.set(
            object.isFlippedX() ? -1 : 1,
            object.isFlippedY() ? -1 : 1,
            object.isFlippedZ() ? -1 : 1
        );

        threeObject3D.visible = !this._object.hidden;

        const spotLight = object.__light3D;

        const editor = game.getInGameEditor ? game.getInGameEditor() : null;

        spotLight.castShadow = false;
        spotLight.visible = false;

        // Instances hidden at start stay visible in the editor, but their light must not shine.
        const isHiddenAtStartInEditor =
            !!editor && !!editor.isInstanceHiddenAtStart && editor.isInstanceHiddenAtStart(object);

        if (!object.isHidden() && !isHiddenAtStartInEditor) {
            let isSelected = false;
            if (editor) {
                const selectedObject = editor._selection.getLastSelectedObject();
                let parentObject = object;
                isSelected = parentObject === selectedObject;
                while (!isSelected && parentObject.getInstanceContainer()
                    //@ts-ignore
                    .getOwner) {
                    parentObject = parentObject.getInstanceContainer()
                        //@ts-ignore
                        .getOwner();
                    isSelected = parentObject === selectedObject;
                }
            }
            if (!editor || !editor.areEffectsHidden() || isSelected) {
                let rootObject = object;
                while (rootObject.getInstanceContainer()
                    //@ts-ignore
                    .getOwner) {
                    rootObject = rootObject.getInstanceContainer()
                        //@ts-ignore
                        .getOwner();
                }
                const runtimeScene = rootObject.getRuntimeScene();
                let distanceSq = 0;
                if (!isSelected) {
                    const layerName = rootObject.getLayer();
                    const cameraX = gdjs.evtTools.camera.getCameraX(runtimeScene, layerName, 0);
                    const cameraY = gdjs.evtTools.camera.getCameraY(runtimeScene, layerName, 0);
                    const cameraZ = gdjs.scene3d.camera.getCameraZ(runtimeScene, layerName, 0);
                    const deltaX = rootObject.getX() - cameraX;
                    const deltaY = rootObject.getY() - cameraY;
                    const deltaZ = rootObject.getZ() - cameraZ;
                    distanceSq = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
                }
                getLightManager(
                    //@ts-ignore
                    runtimeScene
                ).applyVisibilityAndShadow(object, distanceSq);
            }
        }

        // Force the visibility to be checked every frame
        this._isContainerDirty = true;
    }
}

const editorLightCountMax = {
    value: 20
};

const lightCountMax = {
    value: 20
};

const editorLightShadowCountMax = {
    value: 4
};

const lightShadowCountMax = {
    value: 4
};

gdjs.registerRuntimeScenePreEventsCallback(
    runtimeScene => {
        getLightManager(
            //@ts-ignore
            runtimeScene.getScene()
        ).clear();
    });
if (gdjs.registerInGameEditorPostStepCallback) {
    gdjs.registerInGameEditorPostStepCallback(
        inGameEditor => {
            getLightManager(
                //@ts-ignore
                inGameEditor.getEditedInstanceContainer().getScene()
            ).clear();
        });
}

/**
 * How many lights of each kind this device can take.
 *
 * These are hard limits rather than performance trade-offs. three.js binds one
 * texture unit per shadow map and one more for a spot light's projected
 * texture, and spends a varying on every shadow casting light. Going over what
 * the driver allows does not make the scene slower - the shader fails to link
 * and everything using that material renders black. Only 16 fragment texture
 * units and 15 varyings are guaranteed across devices, and materials need most
 * of those, so the budget is read from the device instead of being fixed.
 *
 * The budget is shared between the light kinds a scene uses, so it is given
 * how many of them there are rather than assuming all of them: a scene lit by
 * point lights alone would otherwise have three quarters of its texture units
 * held back for kinds that never show up.
 *
 * @param {THREE.WebGLRenderer | null} threeRenderer
 * @param {number} kindCount How many light kinds the scene uses, at least one.
 * @returns {{shadowCount: number, mapCount: number, count: number}}
 */
function computeDeviceLightBudget(threeRenderer, kindCount) {
    // When the renderer cannot be reached, assume the guaranteed minimums
    // rather than the device this happens to be running on.
    const capabilities = (threeRenderer && threeRenderer.capabilities) || {};
    const maxTextures = capabilities.maxTextures || 16;
    const maxVaryings = capabilities.maxVaryings || 15;
    const maxFragmentUniforms = capabilities.maxFragmentUniforms || 224;

    // Left for the material itself: colour, normal, roughness, metalness,
    // emissive, ambient occlusion and the environment map.
    const textureUnitsForMaterials = 8;
    // Varyings already spent on positions, normals, uvs and fog.
    const varyingsForGeometry = 12;
    // Uniform vectors already spent on matrices, material properties and the
    // uv transforms of a material's own textures.
    const uniformVectorsForMaterials = 64;
    // Measured on a MeshStandardMaterial: a point light costs 4 uniform
    // vectors, a spot light 7, and casting a shadow adds around 11 more on
    // top of either. Take the dearest of them, since a kind count says how
    // many kinds a scene uses but not which ones.
    const uniformVectorsPerLight = 8;
    const uniformVectorsPerShadow = 12;

    const availableTextureUnits = Math.max(
        kindCount, maxTextures - textureUnitsForMaterials);
    const availableVaryings = Math.max(
        kindCount, maxVaryings - varyingsForGeometry);
    const availableUniformVectors = Math.max(
        16, maxFragmentUniforms - uniformVectorsForMaterials);

    // Every shadow caster costs a texture unit and a varying, whichever kind
    // it is. Keep a share of the texture units back for projected textures.
    const shadowCount = Math.max(0, Math.min(
        Math.floor(availableTextureUnits / (kindCount + 1)),
        Math.floor(availableVaryings / kindCount)
    ));
    // What is left bounds how many spot lights can project a texture. Lights
    // that neither cast a shadow nor project a texture cost no texture unit.
    const mapCount = Math.max(0,
        availableTextureUnits - shadowCount * kindCount);
    // Shadow casters are paid for first, then the uniform vectors left over
    // decide how many lights of each kind can be lit at all.
    const uniformVectorsForShadows =
        shadowCount * kindCount * uniformVectorsPerShadow;
    const count = Math.max(1, Math.floor(
        Math.max(uniformVectorsPerLight * kindCount,
            availableUniformVectors - uniformVectorsForShadows)
        / (uniformVectorsPerLight * kindCount)));

    return { shadowCount, mapCount, count };
}

/**
 * A capacity that never goes past what the device can take, however high the
 * game sets its own maximum. Both sides are read through getters, so that
 * changing the game's maximum at runtime still takes effect, and so that a
 * device budget recomputed for more light kinds is picked up as well.
 *
 * @param {{value: number}} requested
 * @param {() => number} getDeviceMax
 * @returns {{value: number}}
 */
function makeDeviceCappedCapacity(requested, getDeviceMax) {
    return {
        get value() {
            return Math.min(requested.value, getDeviceMax());
        }
    };
}

/**
 * Get the light manager of a scene.
 * @param {gdjs.RuntimeScene & {__lightManager: LightManager}} runtimeScene
 */
function getLightManager(runtimeScene) {
    if (!runtimeScene.__lightManager) {
        // Create the shared manager if necessary.
        const requestedCount = isInGameEdition
            ? editorLightCountMax : lightCountMax;
        const requestedShadowCount = isInGameEdition
            ? editorLightShadowCountMax : lightShadowCountMax;

        // The renderer is read anew on every recomputation: it may not
        // exist yet when the manager is created on the first frame.
        runtimeScene.__lightManager = new LightManager(
            requestedCount, requestedShadowCount,
            kindCount => computeDeviceLightBudget(
                runtimeScene.getGame().getRenderer().getThreeRenderer(),
                kindCount));
    }
    return runtimeScene.__lightManager;
}

/**
 * Lights kept sorted by their distance to the camera, capped to a fixed
 * number of entries.
 *
 * The cap is a *count* and not a weighted cost, on purpose: three.js compiles
 * the number of lights of each type into its shaders, so a list whose length
 * changes from one frame to the next forces a shader recompilation every time
 * a new length is seen. A count based cap keeps the length pinned to
 * `capacity` for as long as enough lights are candidates.
 */
class CappedLightList {
    /** @type {Array<{object: LightRuntimeObject, sortDistance: number}>} */
    objects = [];
    /** @type {{value: number}} */
    capacity;
    /** @type {(object: LightRuntimeObject) => void} */
    onInsertion;
    /** @type {(object: LightRuntimeObject) => void} */
    onDeletion;

    /**
     * @param {{value: number}} capacity
     * @param {(object: LightRuntimeObject) => void} onInsertion
     * @param {(object: LightRuntimeObject) => void} onDeletion
     */
    constructor(capacity, onInsertion, onDeletion) {
        this.capacity = capacity;
        this.onInsertion = onInsertion;
        this.onDeletion = onDeletion;
    }

    clear() {
        this.objects.length = 0;
    }

    /** Drop the farthest lights until the list fits its capacity again. */
    trimToCapacity() {
        while (this.objects.length > this.capacity.value) {
            this.onDeletion(this.objects.pop().object);
        }
    }

    /**
     * @param object {LightRuntimeObject}
     * @param sortDistance {number} The squared distance to the camera.
     */
    insertByDistance(object, sortDistance) {
        // A render can happen without a game step in between (the editor
        // and the gameplay test harness render a paused game), so a light
        // can be offered again before the lists were cleared. Keep it once,
        // or the duplicates would evict the other lights - but apply its
        // state again, as the renderer reset it before offering the light.
        for (const pair of this.objects) {
            if (pair.object === object) {
                this.onInsertion(object);
                return;
            }
        }
        let insertionIndex = 0;
        for (let index = this.objects.length - 1; index >= 0; index--) {
            if (sortDistance >= this.objects[index].sortDistance) {
                insertionIndex = index + 1;
                break;
            }
        }
        if (insertionIndex >= this.capacity.value) {
            // Farther away than every light already filling the list.
            return;
        }

        // Make room first, reusing an evicted pair to avoid allocating one
        // on every frame.
        let pair = null;
        while (this.objects.length >= this.capacity.value) {
            pair = this.objects.pop();
            this.onDeletion(pair.object);
        }
        if (pair) {
            pair.object = object;
            pair.sortDistance = sortDistance;
        }
        else {
            pair = { object, sortDistance };
        }
        this.objects.splice(insertionIndex, 0, pair);
        this.onInsertion(object);
    }
}

/** @param object {LightRuntimeObject} */
const showLight = (object) => { object.__light3D.visible = true; };
/** @param object {LightRuntimeObject} */
const hideLight = (object) => { object.__light3D.visible = false; };
/** @param object {LightRuntimeObject} */
const enableShadow = (object) => { object.__light3D.castShadow = true; };
/** @param object {LightRuntimeObject} */
const disableShadow = (object) => { object.__light3D.castShadow = false; };

/**
 * The lights of a scene, budgeted so that the numbers three.js compiles into
 * its shaders stay put.
 *
 * three.js keys its shader programs on how many lights of each kind it can
 * see - NUM_POINT_LIGHTS, NUM_SPOT_LIGHTS, NUM_SPOT_LIGHT_MAPS and the
 * matching shadow counts. A single budget shared by every kind keeps the
 * *total* pinned to the cap but lets the mix drift as the camera moves, and
 * each mix that has not been seen before costs a shader compilation - a
 * stutter the player feels. So each kind gets its own budget instead, which
 * pins each of those numbers individually.
 */
class LightManager {
    /** @type {Map<string, CappedLightList>} Visible lights, by light kind. */
    visibleLists = new Map();
    /** @type {Map<string, CappedLightList>} Shadow casters, by light kind. */
    shadowLists = new Map();
    /** @type {Map<string, {value: number}>} Lit light capacity, by light kind. */
    maxCountByKind;
    /** @type {Map<string, {value: number}>} Shadow caster capacity, by light kind. */
    shadowCountByKind;
    /** @type {Set<string>} The light kinds this scene has actually used. */
    usedKinds = new Set();
    /** @type {{shadowCount: number, mapCount: number, count: number}} */
    deviceBudget;
    /** @type {(kindCount: number) => {shadowCount: number, mapCount: number, count: number}} */
    _computeDeviceBudget;
    /** @type {{value: number}} */
    _requestedCount;
    /** @type {{value: number}} */
    _requestedShadowCount;

    /**
     * @param maxCount {{value: number}} The maximum number of lit lights, for
     * each light kind, as the game asked for it.
     * @param shadowCount {{value: number}} The maximum number of shadow
     * casting lights, for each light kind, as the game asked for it.
     * @param computeDeviceBudget {(kindCount: number) => {shadowCount: number, mapCount: number, count: number}}
     * What the device can take, for a given number of light kinds.
     */
    constructor(maxCount, shadowCount, computeDeviceBudget) {
        this._computeDeviceBudget = computeDeviceBudget;
        this._requestedCount = maxCount;
        this._requestedShadowCount = shadowCount;
        // A scene that uses lights at all uses at least one kind of them.
        this.deviceBudget = computeDeviceBudget(1);

        // Spot lights that project a texture already spend a texture unit on
        // that texture, so they get the tighter of the two budgets.
        this.maxCountByKind = new Map([
            ['point', makeDeviceCappedCapacity(
                maxCount, () => this.deviceBudget.count)],
            ['spot', makeDeviceCappedCapacity(
                maxCount, () => this.deviceBudget.count)],
            ['spotWithMap', makeDeviceCappedCapacity(maxCount, () => Math.min(
                this.deviceBudget.count, this.deviceBudget.mapCount))],
        ]);
        this.shadowCountByKind = new Map([
            ['point', makeDeviceCappedCapacity(
                shadowCount, () => this.deviceBudget.shadowCount)],
            ['spot', makeDeviceCappedCapacity(
                shadowCount, () => this.deviceBudget.shadowCount)],
            ['spotWithMap', makeDeviceCappedCapacity(
                shadowCount, () => this.deviceBudget.shadowCount)],
        ]);
    }

    /**
     * Take note that the scene uses lights of this kind, sharing the device
     * budget between one more kind if it had not been seen before.
     *
     * A kind can only ever be added, never dropped: a light that goes away for
     * a while must not give the others a wider budget, or the numbers three.js
     * compiles into its shaders would move again.
     *
     * @param kind {string}
     */
    _useKind(kind) {
        if (this.usedKinds.has(kind)) {
            return;
        }
        this.usedKinds.add(kind);
        this.deviceBudget = this._computeDeviceBudget(this.usedKinds.size);

        // The budget just shrank: evict the lights that no longer fit, so
        // that even this frame stays within what the device can take.
        for (const list of this.visibleLists.values()) {
            list.trimToCapacity();
        }
        for (const list of this.shadowLists.values()) {
            list.trimToCapacity();
        }

        if (this.deviceBudget.count < this._requestedCount.value
            || this.deviceBudget.shadowCount
                < this._requestedShadowCount.value) {
            logger.info(
                'This device limits 3D lights to ' + this.deviceBudget.count
                + ' per kind (' + this.deviceBudget.shadowCount
                + ' casting a shadow, ' + this.deviceBudget.mapCount
                + ' projecting a texture), now that ' + this.usedKinds.size
                + ' kind(s) of light share its budget. Going over what it '
                + 'reports would stop the shaders from linking.'
            );
        }
    }

    clear() {
        for (const list of this.visibleLists.values()) {
            list.clear();
        }
        for (const list of this.shadowLists.values()) {
            list.clear();
        }
    }

    /**
     * The kind of a light, as far as the shaders are concerned. Lights of
     * different kinds are counted separately by three.js, so they must be
     * budgeted separately too.
     * @param light {THREE.SpotLight | THREE.PointLight}
     * @returns {string}
     */
    static getLightKind(light) {
        //@ts-ignore - `isSpotLight` is set by three.js on SpotLight instances.
        if (!light.isSpotLight) {
            return 'point';
        }
        // A projected texture adds to NUM_SPOT_LIGHT_MAPS, so a spot light
        // that has one is a different kind from a spot light that has not.
        //@ts-ignore - only spot lights have a projected texture.
        return light.map ? 'spotWithMap' : 'spot';
    }

    /**
     * @param lists {Map<string, CappedLightList>}
     * @param kind {string}
     * @param capacity {{value: number}}
     * @param onInsertion {(object: LightRuntimeObject) => void}
     * @param onDeletion {(object: LightRuntimeObject) => void}
     * @returns {CappedLightList}
     */
    static _getListForKind(lists, kind, capacity, onInsertion, onDeletion) {
        let list = lists.get(kind);
        if (!list) {
            list = new CappedLightList(capacity, onInsertion, onDeletion);
            lists.set(kind, list);
        }
        return list;
    }

    /**
     * @param object {LightRuntimeObject}
     * @param distance {number} The squared distance to the camera.
     */
    applyVisibilityAndShadow(object, distance) {
        const light = object.__light3D;
        const kind = LightManager.getLightKind(light);
        this._useKind(kind);

        if (object._getIsCastingShadow()) {
            LightManager._getListForKind(
                this.shadowLists, kind, this.shadowCountByKind.get(kind),
                enableShadow, disableShadow
            ).insertByDistance(object, distance);
        }
        LightManager._getListForKind(
            this.visibleLists, kind, this.maxCountByKind.get(kind),
            showLight, hideLight
        ).insertByDistance(object, distance);
    }
}

//@ts-ignore
gdjs.__light3DExtension = {
    Light3DRenderer,
    lightCountMax,
    lightShadowCountMax,
}
};
gdjs.evtsExt__Light3D__DefineHelperClasses.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Light3D__DefineHelperClasses.userFunc0xad17a0(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__Light3D__DefineHelperClasses.func = function(runtimeScene, parentEventsFunctionContext) {
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


gdjs.evtsExt__Light3D__DefineHelperClasses.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__Light3D__DefineHelperClasses.registeredGdjsCallbacks = [];