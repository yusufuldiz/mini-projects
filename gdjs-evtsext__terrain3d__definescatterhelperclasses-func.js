
if (typeof gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses !== "undefined") {
  gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses = {};
gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.idToCallbackMap = new Map();


gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.userFunc0xf76850 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
if (gdjs.__terrainScatterExtension) {
    return;
}
// Copies grow on the grounds of the scene, like the terrain grass (see
// `getGrounds` in the terrain helper).

const {
    getWorldScale,
    getGrounds,
    patchShaderCode,
    createRandom,
    findHighestGround,
    GroundPlacement,
    SampleRectangle,
    brushes,
    codec,
    svgIcon,
    toolIcons,
} = gdjs.__terrain3DExtension;

// Size of the object inner area: instances are scaled from it.
const AREA_SIZE = 2000;
const AREA_DEPTH = 200;
// The painted density is stored in a grid of this many cells on each side,
// whatever the size of the object.
const MASK_RESOLUTION = 256;
const MASK_FORMAT_VERSION = '1';
// Copies are hidden in chunks: big chunks mean fewer draw calls, small ones
// hide more copies out of the screen.
const MIN_CHUNK_SIZE = 500;
const MAX_CHUNK_SIZE = 2000;
// Copies shrink to nothing over this part of the draw distance, instead of popping out.
const FADE_PART = 0.15;
const MAX_COPIES = 200000;
// Prisms of the trunk collisions.
const TRUNK_SIDES = 6;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * @returns {number} A number for a cell of the copies grid, changing with the seed.
 */
const hashCell = (seed, i, j) => {
    let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(seed, 982451653);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
};

/**
 * How dense copies are, from 0 to 1, in a grid covering the object: painted
 * with the editor brushes, the edits or events.
 */
class DensityMask {
    /** @param {number} fillValue From 0 to 255. */
    constructor(fillValue) {
        // `resolution` and `size` let terrain brushes paint it.
        this.resolution = MASK_RESOLUTION;
        this.size = MASK_RESOLUTION + 1;
        this.values = new Uint8Array(this.size * this.size).fill(fillValue);
    }

    /**
     * @param {number} u From 0 to 1, along the object width.
     * @param {number} v From 0 to 1, along the object height.
     * @returns {number} The density, from 0 to 1, interpolated between samples.
     */
    sample(u, v) {
        const x = clamp01(u) * this.resolution;
        const y = clamp01(v) * this.resolution;
        const i = Math.min(Math.floor(x), this.resolution - 1);
        const j = Math.min(Math.floor(y), this.resolution - 1);
        const fx = x - i;
        const fy = y - j;
        const value = (i, j) => this.values[j * this.size + i];
        const top = value(i, j) + fx * (value(i + 1, j) - value(i, j));
        const bottom = value(i, j + 1) + fx * (value(i + 1, j + 1) - value(i, j + 1));
        return (top + fy * (bottom - top)) / 255;
    }

    /**
     * Bring the density towards a target around a segment: fully up to 70%
     * of the radius, then fading out (forests have dense centers and soft edges).
     * @param {{cellWidth: number, cellHeight: number, ax: number, ay: number, bx: number, by: number, radius: number}} stroke
     * @param {number} density The target, from 0 to 1.
     * @param {number} strength From 0 to 1.
     * @param {SampleRectangle} changedSamples
     */
    paint(stroke, density, strength, changedSamples) {
        const { values } = this;
        const target = Math.round(clamp01(density) * 255);
        brushes.forEachSample(
            this,
            stroke,
            (index, falloff) => {
                // The falloff of terrain brushes is (1 - distance² / radius²)².
                const weight = clamp01(2 * Math.sqrt(falloff));
                // Rounded towards the target, so that light strokes still paint.
                const change = (target - values[index]) * clamp01(weight * strength);
                values[index] += change > 0 ? Math.ceil(change) : Math.floor(change);
            },
            changedSamples
        );
    }

    /** @returns {DensityMask} */
    clone() {
        const mask = new DensityMask(0);
        mask.values.set(this.values);
        return mask;
    }
}

/**
 * Edits written in the Edits property: a JSON list of brush strokes, like
 * `[{"tool": "add", "x": 0.5, "y": 0.5, "radius": 0.2}]`. Positions and
 * radius are fractions of the object size, like the terrain edits.
 */
const applyEdits = (mask, text) => {
    if (!text.trim()) return;
    let editList;
    try {
        editList = JSON.parse(text);
    } catch (error) {
        console.warn('The edits of scattered models are not valid JSON: ' + error.message);
        return;
    }
    if (!Array.isArray(editList)) {
        console.warn('The edits of scattered models must be a JSON list (like [{"tool": "add", ...}]).');
        return;
    }
    const numberOr = (value, defaultValue) => (typeof value === 'number' && isFinite(value) ? value : defaultValue);
    const changedSamples = new SampleRectangle();
    for (const edit of editList) {
        if (!edit || typeof edit !== 'object') continue;
        const x = numberOr(edit.x, 0.5);
        const y = numberOr(edit.y, 0.5);
        const stroke = {
            cellWidth: 1 / mask.resolution,
            cellHeight: 1 / mask.resolution,
            ax: x,
            ay: y,
            bx: numberOr(edit.toX, x),
            by: numberOr(edit.toY, y),
            radius: numberOr(edit.radius, 0.1),
        };
        const strength = clamp01(numberOr(edit.strength, 1));
        if (edit.tool === 'add') {
            mask.paint(stroke, numberOr(edit.density, 1), strength, changedSamples);
        } else if (edit.tool === 'erase') {
            mask.paint(stroke, 0, strength, changedSamples);
        } else {
            console.warn('Unknown tool in the edits of scattered models: "' + edit.tool + '" (use add or erase).');
        }
    }
};

/**
 * The density painted in the editor, stored as its difference with the
 * density from the properties (the coverage and the edits), like the terrain
 * sculpt data.
 */
const maskCodec = {
    /**
     * @param {DensityMask} mask
     * @param {DensityMask} baseMask
     */
    encode(mask, baseMask) {
        const changes = new Int32Array(mask.values.length);
        let hasChanges = false;
        for (let index = 0; index < changes.length; index++) {
            changes[index] = mask.values[index] - baseMask.values[index];
            if (changes[index] !== 0) hasChanges = true;
        }
        if (!hasChanges) return '';
        return MASK_FORMAT_VERSION + ';' + MASK_RESOLUTION + ';' + codec.encodeGrids([changes], mask.size);
    },

    /**
     * @param {string} text
     * @param {DensityMask} baseMask
     * @returns {DensityMask | null} null if the text is empty or not valid.
     */
    decode(text, baseMask) {
        if (!text) return null;
        const parts = text.split(';');
        if (parts[0] !== MASK_FORMAT_VERSION || parseInt(parts[1], 10) !== MASK_RESOLUTION) return null;
        try {
            const mask = baseMask.clone();
            const [changes] = codec.decodeGrids(parts[2], mask.size, 1);
            for (let index = 0; index < changes.length; index++) {
                // The base may have changed since the data was saved.
                mask.values[index] = Math.min(Math.max(mask.values[index] + changes[index], 0), 255);
            }
            return mask;
        } catch (error) {
            console.error('The painted data of scattered models could not be read:', error);
            return null;
        }
    },
};

const fadeShaderDeclarations = `
uniform float scatterDrawDistance;
`;
// Instance matrices are applied after this: copies shrink towards their base.
const fadeShaderCode = `
#ifdef USE_INSTANCING
vec3 scatterCopyPosition = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
transformed *= clamp(
  (scatterDrawDistance - distance(scatterCopyPosition, cameraPosition)) / (scatterDrawDistance * ${FADE_PART}),
  0.0,
  1.0
);
#endif
`;

const flipTriangles = (geometry) => {
    const index = geometry.index;
    for (let offset = 0; offset + 2 < index.count; offset += 3) {
        const second = index.getX(offset + 1);
        index.setX(offset + 1, index.getX(offset + 2));
        index.setX(offset + 2, second);
    }
};

/**
 * The parts of a model, ready to be drawn with instancing: each glTF
 * primitive with its material. Geometries are moved so that the model base
 * is at the origin, its height is 1 and it stands along Z (like 3D model
 * objects with a 90° rotation around X).
 * @param {THREE.Object3D} modelScene
 * @param {object} uniforms Uniforms added to the materials.
 * @returns {{parts: Array<{geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]}>, width: number, depth: number}}
 */
const createModelParts = (modelScene, uniforms) => {
    modelScene.updateMatrixWorld(true);
    const rootInverse = modelScene.matrixWorld.clone().invert();
    const standUp = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    /** @type {Array<{mesh: THREE.Mesh, matrix: THREE.Matrix4}>} */
    const meshes = [];
    const box = new THREE.Box3();
    modelScene.traverse((node) => {
        if (!node.isMesh || !node.geometry || !node.geometry.attributes.position) return;
        const matrix = standUp.clone().multiply(rootInverse).multiply(node.matrixWorld);
        if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
        box.union(node.geometry.boundingBox.clone().applyMatrix4(matrix));
        meshes.push({ mesh: node, matrix });
    });
    if (box.isEmpty()) return { parts: [], width: 0, depth: 0 };

    const height = Math.max(box.max.z - box.min.z, 0.000001);
    // The Y axis of the scene goes down: the model is flipped, like 3D model objects.
    const normalization = new THREE.Matrix4()
        .makeScale(1 / height, -1 / height, 1 / height)
        .multiply(
            new THREE.Matrix4().makeTranslation(
                -(box.min.x + box.max.x) / 2,
                -(box.min.y + box.max.y) / 2,
                -box.min.z
            )
        );
    const parts = meshes.map(({ mesh, matrix }) => {
        let geometry = mesh.geometry.clone();
        if (!geometry.index) {
            const indices = Array.from({ length: geometry.attributes.position.count }, (_, index) => index);
            geometry.setIndex(indices);
        }
        geometry.applyMatrix4(normalization.clone().multiply(matrix));
        // The flip turned the faces inside out.
        flipTriangles(geometry);
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        const patchMaterial = (originalMaterial) => {
            const material = originalMaterial.clone();
            // Like 3D model objects ("Standard without metalness"), which look better without an environment map.
            if (material.metalness) material.metalness = 0;
            material.onBeforeCompile = (shader) => {
                Object.assign(shader.uniforms, uniforms);
                shader.vertexShader = patchShaderCode(shader.vertexShader, [
                    ['#include <common>', '#include <common>\n' + fadeShaderDeclarations],
                    ['#include <begin_vertex>', '#include <begin_vertex>\n' + fadeShaderCode],
                ], 'ScatteredModels');
            };
            material.customProgramCacheKey = () => 'ScatteredModels';
            return material;
        };
        const material = Array.isArray(mesh.material) ? mesh.material.map(patchMaterial) : patchMaterial(mesh.material);
        return { geometry, material };
    });
    return {
        parts,
        width: (box.max.x - box.min.x) / height,
        depth: (box.max.y - box.min.y) / height,
    };
};

/**
 * A copy of the model: its base position in the scene, its scale (the
 * height of the copy) and the key of its cell in the grid of copies.
 * @typedef {{x: number, y: number, z: number, angle: number, height: number, key: number}} Copy
 */

/**
 * The scattered models of an object: copies of a 3D model placed on the
 * grounds of the scene, drawn with GPU instancing in chunks that are hidden
 * when far or off-screen.
 */
class Scatter {
    /** @param {gdjs.CustomRuntimeObject3D} object */
    constructor(object) {
        this.object = object;
        this.group = new THREE.Group();
        object.get3DRendererObject().add(this.group);
        /** @type {Array<{firstCellI: number, firstCellJ: number, meshes: THREE.InstancedMesh[], copies: Copy[], center: THREE.Vector3, radius: number}>} */
        this.chunks = [];
        /**
         * The grid of copies: one copy at most in each cell, cells grouped in chunks.
         * @type {{spacing: number, cellsPerChunk: number, cellsX: number, cellsY: number} | null}
         */
        this.grid = null;
        this.placement = new GroundPlacement(object.getRuntimeScene());
        this.uniforms = {
            // In 3D world units.
            scatterDrawDistance: { value: 1 },
        };
        /** @type {{parts: Array<{geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[]}>, width: number, depth: number}} */
        this.model = { parts: [], width: 0, depth: 0 };
        this.modelResourceName = '';
        this.loadingModelResourceName = '';
        /**
         * Copies removed by events (for example, cut trees), by key.
         * @type {Map<number, Copy>}
         */
        this.removedCopies = new Map();
        /** Increased each time copies change, for the collisions. */
        this.version = 0;
        this.isDisposed = false;
        /** The last value of the painted data property read or saved. */
        this.paintData = '';
        /**
         * Values saved by the editor tools: the editor sends them back with a
         * hot-reload, possibly after newer ones were saved.
         * @type {string[]}
         */
        this.savedPaintData = [];
        this.maskSource = '';
        /** @type {DensityMask} */
        this.baseMask = new DensityMask(255);
        /** @type {DensityMask} */
        this.mask = this.baseMask;
        this.changedSamples = new SampleRectangle();
        this._stroke = { cellWidth: 1, cellHeight: 1, ax: 0, ay: 0, bx: 0, by: 0, radius: 0 };
        this._groundAtCopy = { ground: null, z: 0 };
        this._matrix = new THREE.Matrix4();
        this._raycastSphere = new THREE.Sphere();
        this._raycastRay = new THREE.Ray();
        this._raycastBox = new THREE.Box3();
        this._raycastInverseMatrix = new THREE.Matrix4();
        this._raycastScale = new THREE.Vector3();
        /** Placed on a copy to test the triangles of the model. */
        this._raycastMesh = new THREE.Mesh();
        /** @type {THREE.Intersection[]} */
        this._raycastHits = [];
        this._color = new THREE.Color();
        this._tint = new THREE.Color();
        this._cameraPosition = new THREE.Vector3();
        this._chunkPosition = new THREE.Vector3();
        /**
         * Trunks, for the 3D physics behavior and navigation meshes. Always given,
         * empty without trunk collisions: otherwise these behaviors would use the
         * object box, covering the whole area.
         * @type {gdjs.Surface}
         */
        this.surface = {
            getVersion: () => this.version,
            getChangedArea: () => null,
            getTriangles: () => this._getTrunkTriangles(),
            getHeightField: () => null,
        };
        /** The trunk collision properties, changing the surface. */
        this.trunkKey = '';
        this.loadMaskFromProperties();
        this.updateFromProperties();
        // Before the behaviors create their shapes.
        this._updateSurface();
    }

    _getMaskSource() {
        return this.object._getCoverage() + '|' + this.object._getEdits();
    }

    loadMaskFromProperties() {
        const { object } = this;
        this.maskSource = this._getMaskSource();
        this.paintData = object._getPaintData();
        this.baseMask = new DensityMask(object._getCoverage() === 'Painted' ? 0 : 255);
        applyEdits(this.baseMask, object._getEdits());
        this.mask = maskCodec.decode(this.paintData, this.baseMask) || this.baseMask.clone();
        this.placement.placeAgain();
    }

    onHotReloading() {
        const paintData = this.object._getPaintData();
        const savedIndex = this.savedPaintData.indexOf(paintData);
        if (savedIndex !== -1 && this._getMaskSource() === this.maskSource) {
            // The object already has this data, or newer changes.
            this.savedPaintData.splice(0, savedIndex + 1);
        } else if (paintData !== this.paintData || this._getMaskSource() !== this.maskSource) {
            this.savedPaintData.length = 0;
            this.loadMaskFromProperties();
        }
        this.updateFromProperties();
    }

    /** @returns {string} The data to save in the painted data property. */
    save() {
        this.paintData = maskCodec.encode(this.mask, this.baseMask);
        this.savedPaintData.push(this.paintData);
        return this.paintData;
    }

    updateFromProperties() {
        const { object } = this;
        const modelResourceName = object._getModel();
        if (modelResourceName !== this.modelResourceName) {
            this.modelResourceName = modelResourceName;
            this._loadModel();
        }
        this.placement.placeAgain();
    }

    _disposeModel() {
        for (const part of this.model.parts) {
            part.geometry.dispose();
            for (const material of Array.isArray(part.material) ? part.material : [part.material]) {
                material.dispose();
            }
        }
        this.model = { parts: [], width: 0, depth: 0 };
    }

    _loadModel() {
        this._disposeChunks(this.chunks);
        this._disposeModel();
        const resourceName = this.modelResourceName;
        if (!resourceName) return;
        const game = this.object.getRuntimeScene().getGame();
        const modelManager = game.getModel3DManager();
        const gltf = modelManager.getModel(resourceName);
        if (gltf === modelManager._invalidModel) {
            // Not loaded yet, for example a model just chosen in the editor.
            if (this.loadingModelResourceName === resourceName) return;
            this.loadingModelResourceName = resourceName;
            game.getResourceLoader()
                .loadResource(resourceName)
                .then(() => {
                    if (this.isDisposed || this.modelResourceName !== resourceName) return;
                    this.loadingModelResourceName = '';
                    if (modelManager.getModel(resourceName) !== modelManager._invalidModel) {
                        this._loadModel();
                        this.placement.placeAgain();
                    }
                })
                .catch(() => {});
            return;
        }
        this.model = createModelParts(gltf.scene, this.uniforms);
    }

    _getPlacementKey() {
        const { object } = this;
        return [
            object.getX(), object.getY(), object.getZ(), object.getWidth(), object.getHeight(), object.getDepth(),
            object._getDensity(), object._getSize(), object._getMinScale(), object._getMaxScale(),
            object._getRandomRotation(), object._getRandomTint(), object._getGroundLayer(), object._getMaxSlope(),
            object._getMinGroundZ(), object._getMaxGroundZ(), object._getSeed(), object._getDrawDistance(),
            object._getCastShadow(), object._getReceiveShadow(), this.model.parts.length,
        ].join('|');
    }

    _getChunkSize() {
        return Math.min(Math.max(this.object._getDrawDistance() / 4, MIN_CHUNK_SIZE), MAX_CHUNK_SIZE);
    }

    /** @returns {number} The distance between copies (one copy per cell of this size at most). */
    _getSpacing() {
        const { object } = this;
        const density = Math.max(object._getDensity(), 0);
        if (density <= 0) return 0;
        const spacing = 100 / Math.sqrt(density);
        // Too many cells would freeze the game: the density is lowered.
        const cellCount = (object.getWidth() / spacing) * (object.getHeight() / spacing);
        return cellCount > MAX_COPIES ? spacing * Math.sqrt(cellCount / MAX_COPIES) : spacing;
    }

    /**
     * Find the copy of a cell of the grid, if there is one.
     * @returns {Copy | null}
     */
    _placeCopy(cellI, cellJ, spacing, grounds) {
        const { object } = this;
        const width = object.getWidth();
        const height = object.getHeight();
        const nextRandom = createRandom(hashCell(Math.floor(object._getSeed()), cellI, cellJ));
        // Always drawn in the same order, so that a copy stays the same when properties change.
        const x = (cellI + nextRandom()) * spacing;
        const y = (cellJ + nextRandom()) * spacing;
        const presence = nextRandom();
        const growth = nextRandom();
        const scaleFactor = nextRandom();
        const angle = nextRandom() * Math.PI * 2;
        if (x > width || y > height) return null;
        if (presence >= this.mask.sample(x / width, y / height)) return null;
        const key = cellJ * 65536 + cellI;
        if (this.removedCopies.has(key)) return null;

        const sceneX = object.getX() + x;
        const sceneY = object.getY() + y;
        const { ground, z } = findHighestGround(grounds, sceneX, sceneY, this._groundAtCopy);
        const groundZ = ground ? z : object.getZ();
        if (groundZ < object._getMinGroundZ() || groundZ > object._getMaxGroundZ()) return null;
        const copyHeight =
            Math.max(object._getSize(), 0) *
            (object._getMinScale() + (object._getMaxScale() - object._getMinScale()) * scaleFactor);
        if (ground) {
            if (ground.getSlopeAt(sceneX, sceneY) > object._getMaxSlope()) return null;
            const groundLayer = parseInt(object._getGroundLayer(), 10) || 0;
            if (groundLayer > 0) {
                if (growth > ground.getLayerWeightAt(sceneX, sceneY, groundLayer)) return null;
                // Copies don't stand at the border of their layer, so that trees don't cover roads.
                const margin = (copyHeight * Math.max(this.model.width, this.model.depth)) / 4;
                for (const [offsetX, offsetY] of [[margin, 0], [-margin, 0], [0, margin], [0, -margin]]) {
                    if (ground.getLayerWeightAt(sceneX + offsetX, sceneY + offsetY, groundLayer) < 0.5) return null;
                }
            }
        }
        return {
            x: sceneX,
            y: sceneY,
            z: groundZ,
            angle: object._getRandomRotation() ? angle : 0,
            height: copyHeight,
            key,
        };
    }

    _disposeChunks(chunks) {
        for (const chunk of chunks) {
            for (const mesh of chunk.meshes) {
                mesh.removeFromParent();
                // Geometries and materials are the ones of the model.
                mesh.dispose();
            }
        }
        if (chunks === this.chunks) this.chunks = [];
    }

    /** Place the copies again, for example after the ground or the object changed. */
    rebuild() {
        this._disposeChunks(this.chunks);
        this.version++;
        const { object } = this;
        const spacing = this._getSpacing();
        if (spacing <= 0 || this.model.parts.length === 0) {
            this.grid = null;
            return;
        }
        const cellsPerChunk = Math.max(Math.round(this._getChunkSize() / spacing), 1);
        const grid = {
            spacing,
            cellsPerChunk,
            cellsX: Math.ceil(object.getWidth() / spacing),
            cellsY: Math.ceil(object.getHeight() / spacing),
        };
        this.grid = grid;
        for (let firstCellJ = 0; firstCellJ < grid.cellsY; firstCellJ += cellsPerChunk) {
            for (let firstCellI = 0; firstCellI < grid.cellsX; firstCellI += cellsPerChunk) {
                this._createChunk(firstCellI, firstCellJ);
            }
        }
    }

    /**
     * Place again the copies of the chunks touching a rectangle of the scene,
     * for example after painting.
     */
    _rebuildArea(minX, minY, maxX, maxY) {
        const { grid, object } = this;
        if (!grid) return;
        const chunkSize = grid.spacing * grid.cellsPerChunk;
        const firstChunkI = Math.max(Math.floor((minX - object.getX()) / chunkSize), 0);
        const firstChunkJ = Math.max(Math.floor((minY - object.getY()) / chunkSize), 0);
        const lastChunkI = Math.min(Math.floor((maxX - object.getX()) / chunkSize), Math.ceil(grid.cellsX / grid.cellsPerChunk) - 1);
        const lastChunkJ = Math.min(Math.floor((maxY - object.getY()) / chunkSize), Math.ceil(grid.cellsY / grid.cellsPerChunk) - 1);
        if (firstChunkI > lastChunkI || firstChunkJ > lastChunkJ) return;
        const isInArea = (chunk) => {
            const chunkI = chunk.firstCellI / grid.cellsPerChunk;
            const chunkJ = chunk.firstCellJ / grid.cellsPerChunk;
            return chunkI >= firstChunkI && chunkI <= lastChunkI && chunkJ >= firstChunkJ && chunkJ <= lastChunkJ;
        };
        this._disposeChunks(this.chunks.filter(isInArea));
        this.chunks = this.chunks.filter((chunk) => !isInArea(chunk));
        for (let chunkJ = firstChunkJ; chunkJ <= lastChunkJ; chunkJ++) {
            for (let chunkI = firstChunkI; chunkI <= lastChunkI; chunkI++) {
                this._createChunk(chunkI * grid.cellsPerChunk, chunkJ * grid.cellsPerChunk);
            }
        }
        this.version++;
    }

    _createChunk(firstCellI, firstCellJ) {
        const { grid } = this;
        const grounds = Array.from(this.placement.grounds);
        /** @type {Copy[]} */
        const copies = [];
        for (let cellJ = firstCellJ; cellJ < Math.min(firstCellJ + grid.cellsPerChunk, grid.cellsY); cellJ++) {
            for (let cellI = firstCellI; cellI < Math.min(firstCellI + grid.cellsPerChunk, grid.cellsX); cellI++) {
                const copy = this._placeCopy(cellI, cellJ, grid.spacing, grounds);
                if (copy) copies.push(copy);
            }
        }
        if (copies.length === 0) return;

        const { object } = this;
        // Copies are placed in scene units, and the object group is scaled
        // from its inner area: they are scaled back to keep their proportions.
        const scaleX = Math.max(object.getWidth() / AREA_SIZE, 0.0001);
        const scaleY = Math.max(object.getHeight() / AREA_SIZE, 0.0001);
        const scaleZ = Math.max(object.getDepth() / AREA_DEPTH, 0.0001);
        const matrices = new Float32Array(copies.length * 16);
        const tintColor = gdjs.rgbOrHexStringToNumber(object._getRandomTint());
        const hasTint = tintColor !== 0xffffff;
        const colors = hasTint ? new Float32Array(copies.length * 3) : null;
        this._tint.setHex(tintColor);
        const min = new THREE.Vector3(Infinity, Infinity, Infinity);
        const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
        copies.forEach((copy, index) => {
            const cos = Math.cos(copy.angle) * copy.height;
            const sin = Math.sin(copy.angle) * copy.height;
            const localX = (copy.x - object.getX()) / scaleX;
            const localY = (copy.y - object.getY()) / scaleY;
            const localZ = (copy.z - object.getZ()) / scaleZ;
            this._matrix.set(
                cos / scaleX, -sin / scaleX, 0, localX,
                sin / scaleY, cos / scaleY, 0, localY,
                0, 0, copy.height / scaleZ, localZ,
                0, 0, 0, 1
            );
            this._matrix.toArray(matrices, index * 16);
            if (colors) {
                // The tint of each copy is between white and the tint color.
                this._color.setRGB(1, 1, 1).lerp(this._tint, createRandom(copy.key + 1)());
                this._color.toArray(colors, index * 3);
            }
            const reach = (copy.height * Math.max(this.model.width, this.model.depth)) / 2;
            min.min(this._chunkPosition.set(copy.x - reach, copy.y - reach, copy.z));
            max.max(this._chunkPosition.set(copy.x + reach, copy.y + reach, copy.z + copy.height));
        });
        const instanceMatrix = new THREE.InstancedBufferAttribute(matrices, 16);
        const instanceColor = colors ? new THREE.InstancedBufferAttribute(colors, 3) : null;
        const castShadow = object._getCastShadow();
        const receiveShadow = object._getReceiveShadow();
        const meshes = this.model.parts.map((part) => {
            const mesh = new THREE.InstancedMesh(part.geometry, part.material, 0);
            // All the parts of the model share the positions of the copies.
            mesh.instanceMatrix = instanceMatrix;
            mesh.instanceColor = instanceColor;
            mesh.count = copies.length;
            mesh.computeBoundingSphere();
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            // The first mesh tests all the parts of the copies.
            mesh.raycast = () => {};
            this.group.add(mesh);
            return mesh;
        });
        const center = new THREE.Vector3(
            ((min.x + max.x) / 2 - object.getX()) / scaleX,
            ((min.y + max.y) / 2 - object.getY()) / scaleY,
            ((min.z + max.z) / 2 - object.getZ()) / scaleZ
        );
        const chunk = { firstCellI, firstCellJ, meshes, copies, center, radius: min.distanceTo(max) / 2 };
        // Used by the scene editor to select the object when a copy is clicked.
        meshes[0].raycast = (raycaster, intersects) => this._raycastChunk(chunk, raycaster, intersects);
        this.chunks.push(chunk);
    }

    /**
     * Add the hits of a ray on the copies of a chunk, like they are drawn. There
     * can be thousands of copies: only the ones whose box is crossed by the ray
     * are tested with the triangles of the model.
     * @param {{meshes: THREE.InstancedMesh[], copies: Copy[], center: THREE.Vector3, radius: number}} chunk
     * @param {THREE.Raycaster} raycaster
     * @param {THREE.Intersection[]} intersects
     */
    _raycastChunk(chunk, raycaster, intersects) {
        const { object, group } = this;
        this._raycastSphere.center.copy(chunk.center).applyMatrix4(group.matrixWorld);
        this._raycastSphere.radius = chunk.radius / getWorldScale(object);
        if (!raycaster.ray.intersectsSphere(this._raycastSphere)) return;

        // The ray in the scene coordinates, like the copies.
        const scale = this._raycastScale.set(
            Math.max(object.getWidth() / AREA_SIZE, 0.0001),
            Math.max(object.getHeight() / AREA_SIZE, 0.0001),
            Math.max(object.getDepth() / AREA_DEPTH, 0.0001)
        );
        const ray = this._raycastRay.copy(raycaster.ray).applyMatrix4(this._raycastInverseMatrix.copy(group.matrixWorld).invert());
        ray.origin.multiply(scale).add(this._chunkPosition.set(object.getX(), object.getY(), object.getZ()));
        ray.direction.multiply(scale);

        const reachPerHeight = Math.max(this.model.width, this.model.depth) / 2;
        const instanceMatrices = chunk.meshes[0].instanceMatrix.array;
        chunk.copies.forEach((copy, index) => {
            const reach = copy.height * reachPerHeight;
            this._raycastBox.min.set(copy.x - reach, copy.y - reach, copy.z);
            this._raycastBox.max.set(copy.x + reach, copy.y + reach, copy.z + copy.height);
            if (!ray.intersectsBox(this._raycastBox)) return;
            this._raycastMesh.matrixWorld.fromArray(instanceMatrices, index * 16).premultiply(group.matrixWorld);
            for (const mesh of chunk.meshes) {
                this._raycastMesh.geometry = mesh.geometry;
                this._raycastMesh.material = mesh.material;
                this._raycastHits.length = 0;
                this._raycastMesh.raycast(raycaster, this._raycastHits);
                for (const hit of this._raycastHits) {
                    hit.object = mesh;
                    hit.instanceId = index;
                    intersects.push(hit);
                }
            }
        });
    }

    /** @param {THREE.Camera | null} camera */
    _hideFarChunks(camera) {
        if (!camera) return;
        const worldScale = getWorldScale(this.object);
        const drawDistance = Math.max(this.object._getDrawDistance(), 1) / worldScale;
        this.uniforms.scatterDrawDistance.value = drawDistance;
        this._cameraPosition.setFromMatrixPosition(camera.matrixWorld);
        for (const chunk of this.chunks) {
            const distance = this._chunkPosition
                .copy(chunk.center)
                .applyMatrix4(this.group.matrixWorld)
                .distanceTo(this._cameraPosition);
            const isVisible = distance - chunk.radius / worldScale < drawDistance;
            for (const mesh of chunk.meshes) mesh.visible = isVisible;
        }
    }

    /**
     * @param {number} elapsedSeconds
     * @param {THREE.Camera | null} camera
     */
    update(elapsedSeconds, camera) {
        if (this.placement.shouldPlaceAgain(elapsedSeconds, this._getPlacementKey())) {
            this.rebuild();
        }
        if (!this.changedSamples.isEmpty()) {
            const { object } = this;
            const sampleWidth = object.getWidth() / MASK_RESOLUTION;
            const sampleHeight = object.getHeight() / MASK_RESOLUTION;
            const { minI, minJ, maxI, maxJ } = this.changedSamples;
            // Copies between samples use the density of the samples around them.
            this._rebuildArea(
                object.getX() + (minI - 1) * sampleWidth,
                object.getY() + (minJ - 1) * sampleHeight,
                object.getX() + (maxI + 1) * sampleWidth,
                object.getY() + (maxJ + 1) * sampleHeight
            );
            this.changedSamples.clear();
        }
        // The object transformation is applied just before rendering, it's needed now.
        this.object.getRenderer().ensureUpToDate();
        this.group.updateWorldMatrix(true, false);
        this._hideFarChunks(camera);
        this._updateSurface();
    }

    _updateSurface() {
        const { object } = this;
        if (typeof object.setSurface !== 'function') return;
        const trunkKey = object._getTrunkCollisions() + '|' + object._getTrunkDiameter();
        if (trunkKey !== this.trunkKey) {
            this.trunkKey = trunkKey;
            this.version++;
        }
        if (object.getSurface() !== this.surface) object.setSurface(this.surface);
    }

    /** @returns {Copy[]} */
    getCopies() {
        const copies = [];
        for (const chunk of this.chunks) copies.push(...chunk.copies);
        return copies;
    }

    /**
     * @returns {Copy | null} The copy whose base is the nearest to a position (on X and Y), if any.
     */
    findNearestCopy(x, y) {
        let nearestCopy = null;
        let nearestDistanceSquared = Infinity;
        for (const chunk of this.chunks) {
            for (const copy of chunk.copies) {
                const distanceSquared = (copy.x - x) * (copy.x - x) + (copy.y - y) * (copy.y - y);
                if (distanceSquared < nearestDistanceSquared) {
                    nearestDistanceSquared = distanceSquared;
                    nearestCopy = copy;
                }
            }
        }
        return nearestCopy;
    }

    getCopyCount() {
        let count = 0;
        for (const chunk of this.chunks) count += chunk.copies.length;
        return count;
    }

    /** Remove the copies whose base is in a circle (they come back when the scene is restarted). */
    removeCopies(x, y, radius) {
        let hasRemovedCopies = false;
        for (const chunk of this.chunks) {
            for (const copy of chunk.copies) {
                if ((copy.x - x) * (copy.x - x) + (copy.y - y) * (copy.y - y) <= radius * radius) {
                    this.removedCopies.set(copy.key, copy);
                    hasRemovedCopies = true;
                }
            }
        }
        if (hasRemovedCopies) this._rebuildArea(x - radius, y - radius, x + radius, y + radius);
    }

    /** Paint the full density around a position, and bring back the copies removed there. */
    addCopies(x, y, radius) {
        for (const [key, copy] of this.removedCopies) {
            if ((copy.x - x) * (copy.x - x) + (copy.y - y) * (copy.y - y) <= radius * radius) {
                this.removedCopies.delete(key);
            }
        }
        this.paint(x, y, x, y, radius, 1, 1);
    }

    _getStroke(x1, y1, x2, y2, radius) {
        const { object } = this;
        const stroke = this._stroke;
        stroke.cellWidth = object.getWidth() / MASK_RESOLUTION;
        stroke.cellHeight = object.getHeight() / MASK_RESOLUTION;
        stroke.ax = x1 - object.getX();
        stroke.ay = y1 - object.getY();
        stroke.bx = x2 - object.getX();
        stroke.by = y2 - object.getY();
        stroke.radius = Math.max(radius, 0);
        return stroke;
    }

    /**
     * Paint the density around a segment (copies are placed again at the next frame).
     * @param {number} density From 0 (erase) to 1 (as dense as the Density property).
     * @param {number} strength From 0 to 1.
     */
    paint(x1, y1, x2, y2, radius, density, strength) {
        const changedSamples = new SampleRectangle();
        this.mask.paint(this._getStroke(x1, y1, x2, y2, radius), density, strength, changedSamples);
        this.changedSamples.add(changedSamples);
    }

    /** @param {DensityMask} mask */
    setMask(mask) {
        this.mask = mask;
        this.rebuild();
    }

    /**
     * Prisms around the trunks, from 0 to 1 in the object box (see `gdjs.Surface`).
     * @returns {gdjs.SurfaceTriangles}
     */
    _getTrunkTriangles() {
        const { object } = this;
        const copies = object._getTrunkCollisions() ? this.getCopies() : [];
        const verticesPerCopy = TRUNK_SIDES * 2 + 1;
        const positions = new Float32Array(copies.length * verticesPerCopy * 3);
        const indices = new Uint32Array(copies.length * TRUNK_SIDES * 3 * 3);
        const width = object.getWidth() || 1;
        const height = object.getHeight() || 1;
        const depth = object.getDepth() || 1;
        let indexOffset = 0;
        copies.forEach((copy, copyIndex) => {
            const radius = (Math.max(object._getTrunkDiameter(), 0) / 2) * (copy.height / Math.max(object._getSize(), 1));
            const top = copy.z + copy.height * 0.8;
            const firstVertex = copyIndex * verticesPerCopy;
            const setVertex = (vertex, x, y, z) => {
                positions[vertex * 3] = (x - object.getX()) / width;
                positions[vertex * 3 + 1] = (y - object.getY()) / height;
                positions[vertex * 3 + 2] = (z - object.getZ()) / depth;
            };
            for (let side = 0; side < TRUNK_SIDES; side++) {
                const angle = ((side + 0.5) / TRUNK_SIDES) * Math.PI * 2;
                const x = copy.x + Math.cos(angle) * radius;
                const y = copy.y + Math.sin(angle) * radius;
                // Starting a bit under the ground, which can be sloped.
                setVertex(firstVertex + side * 2, x, y, copy.z - radius);
                setVertex(firstVertex + side * 2 + 1, x, y, top);
            }
            const center = firstVertex + TRUNK_SIDES * 2;
            setVertex(center, copy.x, copy.y, top);
            for (let side = 0; side < TRUNK_SIDES; side++) {
                const bottom = firstVertex + side * 2;
                const nextBottom = firstVertex + ((side + 1) % TRUNK_SIDES) * 2;
                // Triangles face out of the prism (vertices at odd indices are at the top).
                indices.set([bottom, nextBottom, bottom + 1, nextBottom, nextBottom + 1, bottom + 1], indexOffset);
                indices.set([center, bottom + 1, nextBottom + 1], indexOffset + 6);
                indexOffset += 9;
            }
        });
        if (copies.length === 0) {
            // Without triangles, the physics engine and navigation meshes would use
            // the object box: a tiny triangle under the object is used instead.
            return { positions: new Float32Array([0, 0, -1, 0.0001, 0, -1, 0, 0.0001, -1]), indices: new Uint32Array([0, 2, 1]) };
        }
        return { positions, indices };
    }

    dispose() {
        this.isDisposed = true;
        if (typeof this.object.setSurface === 'function' && this.object.getSurface() === this.surface) {
            this.object.setSurface(null);
        }
        this._disposeChunks(this.chunks);
        this._disposeModel();
        this.group.removeFromParent();
    }
}

const scatterToolIcons = {
    Add: svgIcon(
        '<path fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 21v-4M8 17l-4-1 4-9 4 9zM17 21v-6M17 15l-3-1 3-6 3 6zM19 3v4M17 5h4"/>'
    ),
    Erase: svgIcon(
        '<path fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 21v-4M8 17l-4-1 4-9 4 9zM15 4l6 6M21 4l-6 6"/>'
    ),
};

/**
 * The brushes shown in the scene editor when scattered models are selected,
 * to add or erase copies. Without the needed editor functions (older GDevelop
 * versions), nothing is shown: copies can still be painted with events.
 */
class ScatterEditorTools {
    constructor() {
        /** '' when no brush is used. */
        this.toolName = '';
        this.sizePercent = 30;
        this.strengthPercent = 50;
        /** @type {Scatter | null} */
        this.scatter = null;
        /** @type {gdjs.InGameEditor | null} */
        this.editor = null;
        this.isStroking = false;
        this.lastStrokeTime = 0;
        /** @type {Array<{mask: DensityMask, baseMask: DensityMask}>} */
        this.undoSteps = [];
        this.raycaster = new THREE.Raycaster();
        this.ndc = new THREE.Vector2();
        this._groundAtCursor = { ground: null, z: 0 };
        /** A circle following the ground under the cursor. */
        this.brushRing = new THREE.LineLoop(
            new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(64 * 3), 3)),
            new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false, transparent: true })
        );
        this.brushRing.renderOrder = 1000;
        this.brushRing.frustumCulled = false;
        this.brushRing.raycast = () => {};
    }

    /** @param {gdjs.InGameEditor} editor */
    update(editor) {
        if (typeof editor.showToolbar !== 'function') return;
        this.editor = editor;
        const selectedObjects = editor.getSelectedObjects();
        const scatter =
            selectedObjects.length === 1 && selectedObjects[0].__terrainScatter ? selectedObjects[0].__terrainScatter : null;
        if (scatter !== this.scatter) {
            this._endStroke();
            this.scatter = scatter;
            this.undoSteps.length = 0;
        }
        if (scatter) editor.showToolbar('ScatteredModels', this._getToolbarItems());
        const game = editor.getRuntimeGame();
        if (!scatter || !this.toolName) {
            this.brushRing.removeFromParent();
            return;
        }
        const inputManager = game.getInputManager();
        if (inputManager.wasKeyJustPressed(gdjs.evtTools.input.keysNameToCode.Escape)) {
            this._endStroke();
            this.toolName = '';
            this.brushRing.removeFromParent();
            return;
        }
        editor.captureLeftMouseButton();
        const hit = this._getPositionUnderCursor(scatter, game);
        const radius = this._getRadius();
        this._showBrushRing(scatter, hit, radius);

        const isPressedForTool =
            typeof editor.isCapturedLeftMouseButtonPressed === 'function'
                ? editor.isCapturedLeftMouseButtonPressed()
                : inputManager.isMouseButtonPressed(0);
        // The button is released outside the canvas when the mouse is on a toolbar.
        const isPressed = isPressedForTool && inputManager.isMouseInsideCanvas();
        if (isPressed && hit && !this.isStroking) {
            this._startStroke(scatter);
        }
        if (this.isStroking && isPressed && hit) {
            this._applyBrush(scatter, hit, radius);
        }
        if (!isPressed) {
            this._endStroke();
        }
    }

    _getRadius() {
        const { object } = this.scatter;
        const maxRadius = Math.max(object.getWidth(), object.getHeight()) / 4;
        return Math.max(maxRadius * Math.pow(this.sizePercent / 100, 2), 10);
    }

    /**
     * @returns {{x: number, y: number} | null} The position of the scene under the cursor: on the
     * highest ground hit, or on the plane at the object Z.
     */
    _getPositionUnderCursor(scatter, game) {
        let hit = null;
        for (const ground of getGrounds(scatter.object.getRuntimeScene())) {
            if (typeof ground.raycastFromCursor !== 'function') continue;
            const localHit = ground.raycastFromCursor(game, this.raycaster, this.ndc);
            if (!localHit) continue;
            const sceneHit = ground.toScenePosition(localHit);
            if (!hit || sceneHit.z > hit.z) hit = sceneHit;
        }
        if (hit) return hit;

        const { object } = scatter;
        const layer = object.getInstanceContainer().getLayer(object.getLayer());
        const camera = layer.getRenderer().getThreeCamera();
        if (!camera) return null;
        const inputManager = game.getInputManager();
        this.ndc.set(
            (inputManager.getCursorX() / game.getGameResolutionWidth()) * 2 - 1,
            -(inputManager.getCursorY() / game.getGameResolutionHeight()) * 2 + 1
        );
        this.raycaster.setFromCamera(this.ndc, camera);
        scatter.group.updateWorldMatrix(true, false);
        const ray = this.raycaster.ray.clone().applyMatrix4(scatter.group.matrixWorld.clone().invert());
        const point = ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), new THREE.Vector3());
        if (!point) return null;
        return {
            x: object.getX() + (point.x / AREA_SIZE) * object.getWidth(),
            y: object.getY() + (point.y / AREA_SIZE) * object.getHeight(),
        };
    }

    _showBrushRing(scatter, hit, radius) {
        if (!hit) {
            this.brushRing.removeFromParent();
            return;
        }
        const { object } = scatter;
        if (this.brushRing.parent !== scatter.group) scatter.group.add(this.brushRing);
        const grounds = getGrounds(object.getRuntimeScene());
        const positions = this.brushRing.geometry.attributes.position;
        for (let index = 0; index < positions.count; index++) {
            const angle = (index / positions.count) * Math.PI * 2;
            const x = hit.x + Math.cos(angle) * radius;
            const y = hit.y + Math.sin(angle) * radius;
            const { ground, z } = findHighestGround(grounds, x, y, this._groundAtCursor);
            positions.setXYZ(
                index,
                ((x - object.getX()) / object.getWidth()) * AREA_SIZE,
                ((y - object.getY()) / object.getHeight()) * AREA_SIZE,
                (((ground ? z : object.getZ()) + 2 - object.getZ()) / Math.max(object.getDepth(), 0.0001)) * AREA_DEPTH
            );
        }
        positions.needsUpdate = true;
    }

    _startStroke(scatter) {
        this.isStroking = true;
        this.lastStrokeTime = performance.now();
        this.undoSteps.push({ mask: scatter.mask.clone(), baseMask: scatter.baseMask });
        while (this.undoSteps.length > 30) this.undoSteps.shift();
    }

    _endStroke() {
        if (!this.isStroking) return;
        this.isStroking = false;
        this._save();
    }

    _applyBrush(scatter, hit, radius) {
        const now = performance.now();
        const elapsedSeconds = Math.min((now - this.lastStrokeTime) / 1000, 0.1);
        this.lastStrokeTime = now;
        const strength = (this.strengthPercent / 100) * elapsedSeconds * 8;
        scatter.paint(hit.x, hit.y, hit.x, hit.y, radius, this.toolName === 'Add' ? 1 : 0, strength);
    }

    _save() {
        const { scatter, editor } = this;
        if (!scatter || !editor) return;
        editor.updateObjectProperties(scatter.object.getName(), { PaintData: scatter.save() });
    }

    _undo() {
        const undoStep = this.undoSteps.pop();
        // The coverage or the edits may have changed since the stroke.
        if (!this.scatter || !undoStep || undoStep.baseMask !== this.scatter.baseMask) {
            this.undoSteps.length = 0;
            return;
        }
        this.scatter.setMask(undoStep.mask);
        this._save();
    }

    /** @returns {Array<gdjs.InGameEditorToolbarItem>} */
    _getToolbarItems() {
        const toolButton = (toolName, tooltip) => ({
            type: 'button',
            id: toolName,
            tooltip,
            iconUrl: scatterToolIcons[toolName],
            isActive: this.toolName === toolName,
            onClick: () => (this.toolName = this.toolName === toolName ? '' : toolName),
        });
        return [
            toolButton('Add', 'Add copies (drag on the ground)'),
            toolButton('Erase', 'Erase copies'),
            { type: 'divider', id: 'BrushDivider' },
            {
                type: 'slider',
                id: 'Size',
                tooltip: 'Brush size',
                iconUrl: toolIcons.Size,
                min: 1,
                max: 100,
                value: this.sizePercent,
                onChange: (value) => (this.sizePercent = value),
            },
            {
                type: 'slider',
                id: 'Strength',
                tooltip: 'Brush strength',
                iconUrl: toolIcons.Strength,
                min: 5,
                max: 100,
                value: this.strengthPercent,
                onChange: (value) => (this.strengthPercent = value),
            },
            {
                type: 'button',
                id: 'Undo',
                tooltip: 'Undo the last stroke on these scattered models',
                iconUrl: toolIcons.Undo,
                onClick: () => this._undo(),
            },
        ];
    }
}

const editorTools = new ScatterEditorTools();
if (gdjs.registerInGameEditorPostStepCallback) {
    gdjs.registerInGameEditorPostStepCallback((editor) => editorTools.update(editor));
}

gdjs.__terrainScatterExtension = {
    Scatter,
    // Exposed for tests.
    DensityMask,
    maskCodec,
    applyEdits,
};

};
gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.userFunc0xf76850(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.func = function(runtimeScene, parentEventsFunctionContext) {
let scopeInstanceContainer = null;
var eventsFunctionContext = {
  _objectsMap: {
},
  _objectArraysMap: {
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


gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__Terrain3D__DefineScatterHelperClasses.registeredGdjsCallbacks = [];