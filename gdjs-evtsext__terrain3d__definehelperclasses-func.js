
if (typeof gdjs.evtsExt__Terrain3D__DefineHelperClasses !== "undefined") {
  gdjs.evtsExt__Terrain3D__DefineHelperClasses.registeredGdjsCallbacks.forEach(callback =>
    gdjs._unregisterCallback(callback)
  );
}

gdjs.evtsExt__Terrain3D__DefineHelperClasses = {};
gdjs.evtsExt__Terrain3D__DefineHelperClasses.idToCallbackMap = new Map();


gdjs.evtsExt__Terrain3D__DefineHelperClasses.userFunc0xd0e4e0 = function GDJSInlineCode(runtimeScene, eventsFunctionContext) {
"use strict";
if (gdjs.__terrain3DExtension) {
    return;
}

// Tested by the gameplay tests of the "3D island terrain" example (GDevelop-examples repository).

const groundsByScene = new WeakMap();
/**
 * The grounds of a scene (the terrains), followed by the terrain grass.
 *
 * A ground has: `getVersion()` (changing when the ground changes),
 * `containsPoint(x, y)`, `getHeightAt(x, y)` (Z position of the ground),
 * `getSlopeAt(x, y)` (in degrees), `getLayerWeightAt(x, y, layer)` (how
 * much a painted layer, from 1 to 4, is there, from 0 to 1) and optionally
 * `getTintAt(x, y)` (the painted tint, as red, green and blue from 0 to 255).
 * @param {gdjs.RuntimeScene} runtimeScene
 * @returns {Set<object>}
 */
const getGrounds = (runtimeScene) => {
    let grounds = groundsByScene.get(runtimeScene);
    if (!grounds) {
        grounds = new Set();
        groundsByScene.set(runtimeScene, grounds);
    }
    return grounds;
};

/**
 * @param {number} seed
 * @returns {() => number} Random numbers between 0 (included) and 1 (excluded), the same for the same seed.
 */
const createRandom = (seed) => {
    let state = seed >>> 0 || 1;
    return () => {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
    };
};

/**
 * Find the highest ground at a position: grounds can overlap (like an island over a sea floor).
 * @param {Iterable<object>} grounds
 * @param {{ground: object | null, z: number}} result Set to the ground (null if there is none) and its Z position.
 */
const findHighestGround = (grounds, x, y, result) => {
    result.ground = null;
    for (const ground of grounds) {
        if (!ground.containsPoint(x, y)) continue;
        const z = ground.getHeightAt(x, y);
        if (!result.ground || z > result.z) {
            result.ground = ground;
            result.z = z;
        }
    }
    return result;
};

// The grounds or the objects placed on them can change every frame (while
// sculpting or moving them in the editor): things are placed again at most this often.
const PLACEMENT_DELAY = 0.3;

/**
 * Tells when things placed on the grounds of a scene (grass blades, scattered
 * models) must be placed again: after the grounds or the given properties
 * changed, at most every `PLACEMENT_DELAY` seconds.
 */
class GroundPlacement {
    /** @param {gdjs.RuntimeScene} runtimeScene */
    constructor(runtimeScene) {
        this.grounds = getGrounds(runtimeScene);
        this.placedFrom = '';
        this.timeSincePlacement = 0;
    }

    /**
     * @param {number} elapsedSeconds
     * @param {string} propertiesKey Changes when the things must be placed again.
     */
    shouldPlaceAgain(elapsedSeconds, propertiesKey) {
        this.timeSincePlacement += elapsedSeconds;
        if (this.placedFrom && this.timeSincePlacement < PLACEMENT_DELAY) return false;
        let placementKey = propertiesKey;
        for (const ground of this.grounds) placementKey += '|' + ground.getVersion();
        if (placementKey === this.placedFrom) return false;
        this.placedFrom = placementKey;
        this.timeSincePlacement = 0;
        return true;
    }

    placeAgain() {
        this.placedFrom = '';
    }
}

/**
 * Replace parts of the shader code of a Three.js material, with an error if
 * a part is missing (for example after an update of Three.js).
 * @param {string} shaderCode
 * @param {Array<[string, string]>} replacements The searched code and its replacement.
 * @param {string} materialName
 */
const patchShaderCode = (shaderCode, replacements, materialName) => {
    for (const [searchedCode, newCode] of replacements) {
        if (!shaderCode.includes(searchedCode)) {
            console.error(`${materialName}: "${searchedCode}" was not found in the shader, which won't look as expected.`);
        }
        shaderCode = shaderCode.replace(searchedCode, newCode);
    }
    return shaderCode;
};

// Size of the object inner area. Instances are scaled from it, so these only
// define the default size of a new terrain.
const AREA_SIZE = 4096;
const AREA_DEPTH = 600;

// Terrains have at most 8 x 8 chunks (so at most 64 draw calls), of at least
// 32 x 32 cells.
const MIN_CHUNK_CELLS = 32;
const MAX_CHUNKS_PER_SIDE = 8;
/** @param {number} resolution */
const getChunkCells = (resolution) => Math.max(MIN_CHUNK_CELLS, resolution / MAX_CHUNKS_PER_SIDE);
// Grid steps of each level of detail, and the distance (in chunk sizes)
// from which each one is used.
const LOD_STEPS = [1, 2, 4];
const LOD_DISTANCES = [0, 3, 6];

const LAYER_COUNT = 4;
const RESOLUTIONS = [64, 128, 256, 512, 1024];
const DEFAULT_RESOLUTION = 256;
// Each undo step is a copy of the data: fewer are kept for big terrains.
const UNDO_STEPS_SAMPLES = 20 * 257 * 257;

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);
const clampInteger = (value, min, max) =>
    value < min ? min : value > max ? max : Math.floor(value);

/**
 * A rectangle of grid samples, inclusive. Empty when `minI > maxI`.
 */
class SampleRectangle {
    constructor() {
        this.clear();
    }

    clear() {
        this.minI = Number.MAX_SAFE_INTEGER;
        this.minJ = Number.MAX_SAFE_INTEGER;
        this.maxI = -1;
        this.maxJ = -1;
    }

    isEmpty() {
        return this.minI > this.maxI;
    }

    /** @param {SampleRectangle} other */
    add(other) {
        if (other.isEmpty()) return;
        this.minI = Math.min(this.minI, other.minI);
        this.minJ = Math.min(this.minJ, other.minJ);
        this.maxI = Math.max(this.maxI, other.maxI);
        this.maxJ = Math.max(this.maxJ, other.maxJ);
    }

    set(minI, minJ, maxI, maxJ) {
        this.minI = minI;
        this.minJ = minJ;
        this.maxI = maxI;
        this.maxJ = maxJ;
        return this;
    }
}

/**
 * The heights (between 0 and 1) and the painted layers weights of a square
 * grid of `size * size` samples.
 */
class TerrainData {
    /** @param {number} resolution The number of cells on each side. */
    constructor(resolution) {
        this.resolution = resolution;
        this.size = resolution + 1;
        this.heights = new Float32Array(this.size * this.size);
        /** 4 weights (0-255) per sample, one for each layer. */
        this.splat = new Uint8Array(this.size * this.size * LAYER_COUNT);
        this.fillLayer(0);
        /**
         * 4 bytes per sample: a tint multiplying the layers (red, green and
         * blue, white for none) and the wetness (0 for dry).
         */
        this.colors = new Uint8Array(this.size * this.size * 4);
        this.clearColors();
    }

    clearColors() {
        this.colors.fill(255);
        for (let index = 3; index < this.colors.length; index += 4) {
            this.colors[index] = 0;
        }
    }

    /** @param {number} layer */
    fillLayer(layer) {
        this.splat.fill(0);
        for (let index = layer; index < this.splat.length; index += LAYER_COUNT) {
            this.splat[index] = 255;
        }
    }

    getHeight(i, j) {
        const last = this.resolution;
        const clampedI = i < 0 ? 0 : i > last ? last : i;
        const clampedJ = j < 0 ? 0 : j > last ? last : j;
        return this.heights[clampedJ * this.size + clampedI];
    }

    /**
     * @param {number} gridX
     * @param {number} gridY
     * @returns {number} The height interpolated on the triangles that are drawn.
     */
    sampleHeight(gridX, gridY) {
        const x = Math.min(Math.max(gridX, 0), this.resolution);
        const y = Math.min(Math.max(gridY, 0), this.resolution);
        const i = Math.min(Math.floor(x), this.resolution - 1);
        const j = Math.min(Math.floor(y), this.resolution - 1);
        const fx = x - i;
        const fy = y - j;
        const topRight = this.getHeight(i + 1, j);
        const bottomLeft = this.getHeight(i, j + 1);
        if (fx + fy <= 1) {
            const topLeft = this.getHeight(i, j);
            return topLeft + fx * (topRight - topLeft) + fy * (bottomLeft - topLeft);
        }
        const bottomRight = this.getHeight(i + 1, j + 1);
        return (
            bottomRight +
            (1 - fx) * (bottomLeft - bottomRight) +
            (1 - fy) * (topRight - bottomRight)
        );
    }

    /** @returns {number} The weight (0-1) of a layer, interpolated between samples. */
    sampleLayerWeight(gridX, gridY, layer) {
        const x = Math.min(Math.max(gridX, 0), this.resolution);
        const y = Math.min(Math.max(gridY, 0), this.resolution);
        const i = Math.min(Math.floor(x), this.resolution - 1);
        const j = Math.min(Math.floor(y), this.resolution - 1);
        const fx = x - i;
        const fy = y - j;
        const weight = (i, j) => this.splat[(j * this.size + i) * LAYER_COUNT + layer];
        const top = weight(i, j) + fx * (weight(i + 1, j) - weight(i, j));
        const bottom = weight(i, j + 1) + fx * (weight(i + 1, j + 1) - weight(i, j + 1));
        return (top + fy * (bottom - top)) / 255;
    }

    /**
     * @param {number} channel 0, 1 and 2 for the tint, 3 for the wetness.
     * @returns {number} The channel (0-1), interpolated between samples.
     */
    sampleColor(gridX, gridY, channel) {
        const x = Math.min(Math.max(gridX, 0), this.resolution);
        const y = Math.min(Math.max(gridY, 0), this.resolution);
        const i = Math.min(Math.floor(x), this.resolution - 1);
        const j = Math.min(Math.floor(y), this.resolution - 1);
        const fx = x - i;
        const fy = y - j;
        const value = (i, j) => this.colors[(j * this.size + i) * 4 + channel];
        const top = value(i, j) + fx * (value(i + 1, j) - value(i, j));
        const bottom = value(i, j + 1) + fx * (value(i + 1, j + 1) - value(i, j + 1));
        return (top + fy * (bottom - top)) / 255;
    }

    /**
     * @param {number} index The index of a sample.
     * @returns {boolean} true if no layer is painted on the sample: it's a hole.
     */
    isHole(index) {
        const offset = index * LAYER_COUNT;
        return (this.splat[offset] | this.splat[offset + 1] | this.splat[offset + 2] | this.splat[offset + 3]) === 0;
    }

    /**
     * @returns {number} The sum of the layer weights (0-1), interpolated between samples: there is a
     * hole where it's under 0.5, like what is drawn.
     */
    sampleSolidity(gridX, gridY) {
        let solidity = 0;
        for (let layer = 0; layer < LAYER_COUNT; layer++) solidity += this.sampleLayerWeight(gridX, gridY, layer);
        return solidity;
    }

    /** @returns {number} The index (from 0) of the layer painted the most. */
    getDominantLayer(gridX, gridY) {
        const i = clampInteger(Math.round(gridX), 0, this.resolution);
        const j = clampInteger(Math.round(gridY), 0, this.resolution);
        const offset = (j * this.size + i) * LAYER_COUNT;
        let dominantLayer = 0;
        for (let layer = 1; layer < LAYER_COUNT; layer++) {
            if (this.splat[offset + layer] > this.splat[offset + dominantLayer]) {
                dominantLayer = layer;
            }
        }
        return dominantLayer;
    }

    /** @param {TerrainData} other */
    copyFrom(other) {
        this.heights.set(other.heights);
        this.splat.set(other.splat);
        this.colors.set(other.colors);
    }

    /**
     * @param {number} resolution
     * @returns {TerrainData} A copy of this data with another resolution.
     */
    resampled(resolution) {
        const data = new TerrainData(resolution);
        const ratio = this.resolution / resolution;
        for (let j = 0; j < data.size; j++) {
            for (let i = 0; i < data.size; i++) {
                const index = j * data.size + i;
                data.heights[index] = this.sampleHeight(i * ratio, j * ratio);
                const sourceOffset =
                    (Math.round(j * ratio) * this.size + Math.round(i * ratio)) * LAYER_COUNT;
                for (let layer = 0; layer < LAYER_COUNT; layer++) {
                    data.splat[index * LAYER_COUNT + layer] = this.splat[sourceOffset + layer];
                }
                for (let channel = 0; channel < 4; channel++) {
                    data.colors[index * 4 + channel] = this.colors[sourceOffset + channel];
                }
            }
        }
        return data;
    }
}

/**
 * Brushes change the samples around a segment, with an effect going smoothly
 * from full on the segment to none at `radius`. A point is a segment of
 * length 0. Positions are in scene units relative to the terrain origin.
 */
const brushes = {
    /**
     * @param {TerrainData} data
     * @param {{cellWidth: number, cellHeight: number, ax: number, ay: number, bx: number, by: number, radius: number}} stroke
     * @param {(sampleIndex: number, weight: number, t: number) => void} apply Called with the weight of
     * the brush and the position (from 0 to 1) of the nearest point of the segment.
     * @param {SampleRectangle} changedSamples
     */
    forEachSample(data, stroke, apply, changedSamples) {
        const { cellWidth, cellHeight, ax, ay, bx, by, radius } = stroke;
        const last = data.resolution;
        const minI = clampInteger(Math.floor((Math.min(ax, bx) - radius) / cellWidth), 0, last);
        const maxI = clampInteger(Math.ceil((Math.max(ax, bx) + radius) / cellWidth), 0, last);
        const minJ = clampInteger(Math.floor((Math.min(ay, by) - radius) / cellHeight), 0, last);
        const maxJ = clampInteger(Math.ceil((Math.max(ay, by) + radius) / cellHeight), 0, last);
        changedSamples.set(minI, minJ, maxI, maxJ);
        if (radius <= 0) return;

        const abX = bx - ax;
        const abY = by - ay;
        const abLengthSquared = abX * abX + abY * abY;
        const radiusSquared = radius * radius;
        for (let j = minJ; j <= maxJ; j++) {
            const y = j * cellHeight;
            for (let i = minI; i <= maxI; i++) {
                const x = i * cellWidth;
                const t =
                    abLengthSquared > 0
                        ? clamp01(((x - ax) * abX + (y - ay) * abY) / abLengthSquared)
                        : 0;
                const dx = x - (ax + t * abX);
                const dy = y - (ay + t * abY);
                const distanceSquared = dx * dx + dy * dy;
                if (distanceSquared >= radiusSquared) continue;
                const falloff = 1 - distanceSquared / radiusSquared;
                apply(j * data.size + i, falloff * falloff, t);
            }
        }
    },

    raise(data, stroke, amount, changedSamples) {
        const { heights } = data;
        brushes.forEachSample(
            data,
            stroke,
            (index, weight) => {
                heights[index] = clamp01(heights[index] + amount * weight);
            },
            changedSamples
        );
    },

    /**
     * @param {number} targetHeight
     * @param {number} [endTargetHeight] The target at the end of the segment, for a slope (like a road
     * going up). The same target as at its start by default.
     */
    flatten(data, stroke, targetHeight, strength, changedSamples, endTargetHeight = targetHeight) {
        const { heights } = data;
        const startTarget = clamp01(targetHeight);
        const endTarget = clamp01(endTargetHeight);
        brushes.forEachSample(
            data,
            stroke,
            (index, weight, t) => {
                const target = startTarget + (endTarget - startTarget) * t;
                heights[index] += (target - heights[index]) * clamp01(weight * strength);
            },
            changedSamples
        );
    },

    smooth(data, stroke, strength, changedSamples) {
        const { heights, size } = data;
        const changes = [];
        brushes.forEachSample(
            data,
            stroke,
            (index, weight) => {
                const i = index % size;
                const j = (index - i) / size;
                let sum = 0;
                for (let dj = -1; dj <= 1; dj++) {
                    for (let di = -1; di <= 1; di++) {
                        sum += data.getHeight(i + di, j + dj);
                    }
                }
                changes.push(index, heights[index] + (sum / 9 - heights[index]) * clamp01(weight * strength));
            },
            changedSamples
        );
        // Written after all averages are computed, so that the result
        // doesn't depend on the order in which samples are visited.
        for (let index = 0; index < changes.length; index += 2) {
            heights[changes[index]] = changes[index + 1];
        }
    },

    paint(data, stroke, layer, strength, changedSamples) {
        const { splat } = data;
        brushes.forEachSample(
            data,
            stroke,
            (index, weight) => {
                const amount = clamp01(weight * strength);
                const offset = index * LAYER_COUNT;
                for (let otherLayer = 0; otherLayer < LAYER_COUNT; otherLayer++) {
                    const target = otherLayer === layer ? 255 : 0;
                    const value = splat[offset + otherLayer];
                    // Rounded towards the target, so that light strokes still paint.
                    const change = (target - value) * amount;
                    splat[offset + otherLayer] = value + (change > 0 ? Math.ceil(change) : Math.floor(change));
                }
            },
            changedSamples
        );
    },

    /** Remove all the layers, making a hole (`fill` or painting a layer fills it again). */
    hole(data, stroke, changedSamples) {
        const { splat } = data;
        brushes.forEachSample(
            data,
            stroke,
            (index) => {
                splat.fill(0, index * LAYER_COUNT, (index + 1) * LAYER_COUNT);
            },
            changedSamples
        );
    },

    /**
     * Fill the holes in the radius with the layers of the ground around them:
     * each pass fills the holes next to the ground with the average of their
     * neighbors, from the edges of the holes inward.
     */
    fill(data, stroke, changedSamples) {
        const { splat, size, resolution } = data;
        /** @type {number[]} */
        let holes = [];
        brushes.forEachSample(
            data,
            stroke,
            (index) => {
                if (data.isHole(index)) holes.push(index);
            },
            changedSamples
        );
        const filledWeights = new Float32Array(holes.length * LAYER_COUNT);
        while (holes.length > 0) {
            /** @type {number[]} */
            const remainingHoles = [];
            /** @type {number[]} */
            const filledHoles = [];
            for (const index of holes) {
                const i = index % size;
                const j = (index - i) / size;
                const weights = filledWeights.subarray(filledHoles.length * LAYER_COUNT, (filledHoles.length + 1) * LAYER_COUNT);
                weights.fill(0);
                for (let neighborJ = Math.max(j - 1, 0); neighborJ <= Math.min(j + 1, resolution); neighborJ++) {
                    for (let neighborI = Math.max(i - 1, 0); neighborI <= Math.min(i + 1, resolution); neighborI++) {
                        const neighbor = neighborJ * size + neighborI;
                        if (data.isHole(neighbor)) continue;
                        for (let layer = 0; layer < LAYER_COUNT; layer++) weights[layer] += splat[neighbor * LAYER_COUNT + layer];
                    }
                }
                if (weights[0] + weights[1] + weights[2] + weights[3] > 0) filledHoles.push(index);
                else remainingHoles.push(index);
            }
            if (filledHoles.length === 0) {
                // No ground around (a hole bigger than the brush): the first layer is used.
                for (const index of remainingHoles) splat[index * LAYER_COUNT] = 255;
                break;
            }
            // Filled after the pass, so that the holes are filled from the edges inward.
            filledHoles.forEach((index, filledIndex) => {
                const weights = filledWeights.subarray(filledIndex * LAYER_COUNT, (filledIndex + 1) * LAYER_COUNT);
                const total = weights[0] + weights[1] + weights[2] + weights[3];
                for (let layer = 0; layer < LAYER_COUNT; layer++) {
                    splat[index * LAYER_COUNT + layer] = Math.round((weights[layer] / total) * 255);
                }
            });
            holes = remainingHoles;
        }
    },

    /** @param {number[]} color The red, green and blue (0-255) of the tint: white removes it. */
    tint(data, stroke, color, strength, changedSamples) {
        brushes.paintColors(data, stroke, 0, color, strength, changedSamples);
    },

    /** @param {number} wetness From 0 (dry) to 1. */
    wet(data, stroke, wetness, strength, changedSamples) {
        brushes.paintColors(data, stroke, 3, [Math.round(clamp01(wetness) * 255)], strength, changedSamples);
    },

    /**
     * Bring channels of the colors (see `TerrainData.colors`) towards targets.
     * @param {number} firstChannel
     * @param {number[]} targets From 0 to 255, for the channels from the first one.
     */
    paintColors(data, stroke, firstChannel, targets, strength, changedSamples) {
        const { colors } = data;
        brushes.forEachSample(
            data,
            stroke,
            (index, weight) => {
                const amount = clamp01(weight * strength);
                for (let channel = 0; channel < targets.length; channel++) {
                    const offset = index * 4 + firstChannel + channel;
                    // Rounded towards the target, so that light strokes still paint.
                    const change = (targets[channel] - colors[offset]) * amount;
                    colors[offset] += change > 0 ? Math.ceil(change) : Math.floor(change);
                }
            },
            changedSamples
        );
    },
};

const relief = (() => {
    const hash = (x, y, seed) => {
        let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 982451653);
        h = Math.imul(h ^ (h >>> 13), 1274126177);
        return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const valueNoise = (x, y, seed) => {
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const fx = x - x0;
        const fy = y - y0;
        const sx = fx * fx * (3 - 2 * fx);
        const sy = fy * fy * (3 - 2 * fy);
        const top = hash(x0, y0, seed) + sx * (hash(x0 + 1, y0, seed) - hash(x0, y0, seed));
        const bottom =
            hash(x0, y0 + 1, seed) + sx * (hash(x0 + 1, y0 + 1, seed) - hash(x0, y0 + 1, seed));
        return top + sy * (bottom - top);
    };
    /** Fractal noise between 0 and 1. */
    const fractalNoise = (x, y, seed) => {
        let value = 0;
        let amplitude = 0.5;
        let frequency = 1;
        for (let octave = 0; octave < 5; octave++) {
            value += amplitude * valueNoise(x * frequency, y * frequency, seed + octave);
            amplitude *= 0.5;
            frequency *= 2;
        }
        return value / 0.96875;
    };
    const smoothstep = (edge0, edge1, x) => {
        const t = clamp01((x - edge0) / (edge1 - edge0));
        return t * t * (3 - 2 * t);
    };
    const reliefHeights = {
        Flat: () => 0,
        Hills: (u, v, seed) => 0.05 + 0.5 * Math.pow(fractalNoise(u * 3, v * 3, seed), 2),
        Mountains: (u, v, seed) => {
            const ridge = 1 - Math.abs(2 * fractalNoise(u * 2.5, v * 2.5, seed) - 1);
            return 0.9 * Math.pow(ridge, 2.5);
        },
        Island: (u, v, seed) => {
            const distanceToCenter = 2 * Math.hypot(u - 0.5, v - 0.5);
            const coast = 0.2 * (fractalNoise(u * 4, v * 4, seed + 7) - 0.5);
            const land = smoothstep(0.95, 0.55, distanceToCenter + coast);
            return land * (0.12 + 0.6 * Math.pow(fractalNoise(u * 3, v * 3, seed), 1.5));
        },
    };
    const beachLayer = 3;

    return {
        /**
         * @param {TerrainData} data
         * @param {string} reliefName Flat, Hills, Mountains or Island.
         * @param {number} seed
         */
        generate(data, reliefName, seed) {
            const getHeight = reliefHeights[reliefName] || reliefHeights.Flat;
            const integerSeed = Math.floor(seed) | 0;
            data.fillLayer(0);
            for (let j = 0; j < data.size; j++) {
                for (let i = 0; i < data.size; i++) {
                    const index = j * data.size + i;
                    const height = clamp01(
                        getHeight(i / data.resolution, j / data.resolution, integerSeed)
                    );
                    data.heights[index] = height;
                    if (reliefName === 'Island') {
                        const sand = Math.round(255 * smoothstep(0.16, 0.1, height));
                        const offset = index * LAYER_COUNT;
                        data.splat[offset] = 255 - sand;
                        data.splat[offset + beachLayer] = sand;
                    }
                }
            }
        },
    };
})();

/**
 * Edits written in the Edits property: a JSON list of brush strokes, like
 * `[{"tool": "raise", "x": 0.5, "y": 0.5, "radius": 0.2, "height": 0.3}]`,
 * applied on the relief or the heightmap. Positions and radius are fractions
 * of the terrain size, heights and Z positions fractions of its depth: they
 * are the same for all instances, whatever their size. They are made to be
 * read and written by people and by AI agents.
 */
const edits = {
    /**
     * @param {TerrainData} data
     * @param {string} text
     */
    apply(data, text) {
        if (!text.trim()) return;
        let editList;
        try {
            editList = JSON.parse(text);
        } catch (error) {
            console.warn('The edits of a terrain are not valid JSON: ' + error.message);
            return;
        }
        if (!Array.isArray(editList)) {
            console.warn('The edits of a terrain must be a JSON list (like [{"tool": "raise", ...}]).');
            return;
        }
        const numberOr = (value, defaultValue) => (typeof value === 'number' && isFinite(value) ? value : defaultValue);
        const changedSamples = new SampleRectangle();
        for (const edit of editList) {
            if (!edit || typeof edit !== 'object') continue;
            const x = numberOr(edit.x, 0.5);
            const y = numberOr(edit.y, 0.5);
            const stroke = {
                cellWidth: 1 / data.resolution,
                cellHeight: 1 / data.resolution,
                ax: x,
                ay: y,
                bx: numberOr(edit.toX, x),
                by: numberOr(edit.toY, y),
                radius: numberOr(edit.radius, 0.1),
            };
            const strength = clamp01(numberOr(edit.strength, 1));
            if (edit.tool === 'raise') {
                brushes.raise(data, stroke, numberOr(edit.height, 0.1), changedSamples);
            } else if (edit.tool === 'flatten') {
                const z = numberOr(edit.z, 0);
                brushes.flatten(data, stroke, z, strength, changedSamples, numberOr(edit.toZ, z));
            } else if (edit.tool === 'smooth') {
                // Smoothing the same fraction of the terrain at any resolution.
                const passes = Math.max(Math.round(((1 + 9 * strength) * data.resolution) / 256), 1);
                for (let pass = 0; pass < passes; pass++) brushes.smooth(data, stroke, 1, changedSamples);
            } else if (edit.tool === 'paint') {
                const layer = clampInteger(numberOr(edit.layer, 1) - 1, 0, LAYER_COUNT - 1);
                brushes.paint(data, stroke, layer, strength, changedSamples);
            } else if (edit.tool === 'tint') {
                const color = gdjs.rgbOrHexToRGBColor(typeof edit.color === 'string' ? edit.color : '255;255;255');
                brushes.tint(data, stroke, color, strength, changedSamples);
            } else if (edit.tool === 'wetness') {
                brushes.wet(data, stroke, numberOr(edit.amount, 1), strength, changedSamples);
            } else if (edit.tool === 'hole') {
                brushes.hole(data, stroke, changedSamples);
            } else if (edit.tool === 'fill') {
                brushes.fill(data, stroke, changedSamples);
            } else {
                console.warn('Unknown tool in the edits of a terrain: "' + edit.tool + '" (use raise, flatten, smooth, paint, tint, wetness, hole or fill).');
            }
        }
    },
};

/**
 * @param {gdjs.RuntimeGame} game
 * @param {string} imageResourceName
 * @returns {CanvasImageSource | null} The image, or null if it's not loaded (yet).
 */
const getLoadedImage = (game, imageResourceName) => {
    const imageManager = game.getImageManager();
    if (typeof imageManager.getImageSource === 'function') return imageManager.getImageSource(imageResourceName);
    // Older GDevelop versions: a 192 x 192 placeholder is given for images that are not loaded.
    const texture = imageManager.getPIXITexture(imageResourceName);
    return texture && texture !== imageManager.getInvalidPIXITexture() ? texture.baseTexture.getDrawableSource() : null;
};

/**
 * Loads heights from an image: black is the lowest, white the highest.
 * Heights have 16 bits of precision when the red channel holds the most
 * significant byte and the green one the least significant (a gray image
 * works as expected too).
 * @param {TerrainData} data
 * @param {gdjs.RuntimeGame} game
 * @param {string} imageResourceName
 * @returns {boolean} true if the image could be read.
 */
const loadHeightsFromImage = (data, game, imageResourceName) => {
    const source = getLoadedImage(game, imageResourceName);
    if (!source) return false;

    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return false;
    context.drawImage(source, 0, 0);
    const pixels = context.getImageData(0, 0, source.width, source.height).data;
    // Pixels are decoded before being interpolated, to keep the 16 bits.
    const pixelHeight = (x, y) => {
        const offset = (y * source.width + x) * 4;
        return (256 * pixels[offset] + pixels[offset + 1]) / 65535;
    };
    for (let j = 0; j < data.size; j++) {
        const y = (j / data.resolution) * (source.height - 1);
        const y0 = Math.floor(y);
        const y1 = Math.min(y0 + 1, source.height - 1);
        for (let i = 0; i < data.size; i++) {
            const x = (i / data.resolution) * (source.width - 1);
            const x0 = Math.floor(x);
            const x1 = Math.min(x0 + 1, source.width - 1);
            const top = pixelHeight(x0, y0) + (x - x0) * (pixelHeight(x1, y0) - pixelHeight(x0, y0));
            const bottom = pixelHeight(x0, y1) + (x - x0) * (pixelHeight(x1, y1) - pixelHeight(x0, y1));
            data.heights[j * data.size + i] = top + (y - y0) * (bottom - top);
        }
    }
    return true;
};

/**
 * Stores the data in a string. Only the differences with the base data (from
 * the relief or the heightmap) are stored: heights on 16 bits, layer weights
 * on 8 bits, then (since format 2) the tint and wetness on 8 bits. Each value is predicted from its neighbors and the
 * prediction errors are written as variable length integers, with runs of
 * zeros collapsed. Untouched or smoothly changed areas take almost no space.
 */
const codec = (() => {
    const formatVersion = '2';
    // Format 1 has no tint and wetness.
    const readableFormatVersions = ['1', '2'];

    class ByteWriter {
        constructor() {
            this.bytes = new Uint8Array(1024);
            this.length = 0;
        }
        writeVarUint(value) {
            if (this.length + 5 > this.bytes.length) {
                const bytes = new Uint8Array(this.bytes.length * 2);
                bytes.set(this.bytes);
                this.bytes = bytes;
            }
            while (value >= 0x80) {
                this.bytes[this.length++] = (value & 0x7f) | 0x80;
                value >>>= 7;
            }
            this.bytes[this.length++] = value;
        }
    }

    class ByteReader {
        /** @param {Uint8Array} bytes */
        constructor(bytes) {
            this.bytes = bytes;
            this.position = 0;
        }
        readVarUint() {
            let value = 0;
            let shift = 0;
            let byte;
            do {
                if (this.position >= this.bytes.length) throw new Error('Truncated terrain data.');
                byte = this.bytes[this.position++];
                value += (byte & 0x7f) * Math.pow(2, shift);
                shift += 7;
            } while (byte & 0x80);
            return value;
        }
    }

    /** Predicts a value from the left, top and top-left ones. */
    const predict = (values, size, index) => {
        const i = index % size;
        if (index < size) return i === 0 ? 0 : values[index - 1];
        if (i === 0) return values[index - size];
        return values[index - 1] + values[index - size] - values[index - size - 1];
    };

    /**
     * @param {ByteWriter} writer
     * @param {Int32Array} values A grid of `size * size` values.
     */
    const writeGrid = (writer, values, size) => {
        let zeroRun = 0;
        for (let index = 0; index < values.length; index++) {
            const error = values[index] - predict(values, size, index);
            if (error === 0) {
                zeroRun++;
                continue;
            }
            if (zeroRun > 0) {
                writer.writeVarUint(0);
                writer.writeVarUint(zeroRun);
                zeroRun = 0;
            }
            // Zigzag: small negative and positive numbers get small codes.
            writer.writeVarUint(error > 0 ? error * 2 : -error * 2 - 1);
        }
        if (zeroRun > 0) {
            writer.writeVarUint(0);
            writer.writeVarUint(zeroRun);
        }
    };

    /** @param {ByteReader} reader */
    const readGrid = (reader, size) => {
        const values = new Int32Array(size * size);
        let zeroRun = 0;
        for (let index = 0; index < values.length; index++) {
            let error = 0;
            if (zeroRun > 0) {
                zeroRun--;
            } else {
                const code = reader.readVarUint();
                if (code === 0) {
                    zeroRun = reader.readVarUint() - 1;
                } else {
                    error = code % 2 === 0 ? code / 2 : -(code + 1) / 2;
                }
            }
            values[index] = predict(values, size, index) + error;
        }
        return values;
    };

    const toBase64 = (bytes, length) => {
        let binary = '';
        for (let offset = 0; offset < length; offset += 0x8000) {
            binary += String.fromCharCode.apply(null, bytes.subarray(offset, Math.min(offset + 0x8000, length)));
        }
        return btoa(binary);
    };

    const fromBase64 = (base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    };

    return {
        /**
         * @param {TerrainData} data
         * @param {TerrainData} baseData The data without changes, with the same resolution.
         */
        encode(data, baseData) {
            const writer = new ByteWriter();
            const values = new Int32Array(data.heights.length);
            for (let index = 0; index < values.length; index++) {
                values[index] = Math.round((data.heights[index] - baseData.heights[index]) * 65535);
            }
            writeGrid(writer, values, data.size);
            for (let layer = 0; layer < LAYER_COUNT; layer++) {
                for (let index = 0; index < values.length; index++) {
                    const offset = index * LAYER_COUNT + layer;
                    values[index] = data.splat[offset] - baseData.splat[offset];
                }
                writeGrid(writer, values, data.size);
            }
            // Not painted, these grids are zeros: a few bytes each.
            for (let channel = 0; channel < 4; channel++) {
                for (let index = 0; index < values.length; index++) {
                    const offset = index * 4 + channel;
                    values[index] = data.colors[offset] - baseData.colors[offset];
                }
                writeGrid(writer, values, data.size);
            }
            return formatVersion + ';' + data.resolution + ';' + toBase64(writer.bytes, writer.length);
        },

        /**
         * Store grids of integers in a string, like the terrain data. Used by other objects (the scattered models).
         * @param {Int32Array[]} grids Grids of `size * size` values.
         * @param {number} size
         */
        encodeGrids(grids, size) {
            const writer = new ByteWriter();
            for (const grid of grids) writeGrid(writer, grid, size);
            return toBase64(writer.bytes, writer.length);
        },

        /**
         * @param {string} base64 A string from `encodeGrids`.
         * @param {number} size
         * @param {number} count The number of grids.
         * @returns {Int32Array[]} The grids (an error is thrown if the string is not valid).
         */
        decodeGrids(base64, size, count) {
            const reader = new ByteReader(fromBase64(base64));
            return Array.from({ length: count }, () => readGrid(reader, size));
        },

        /**
         * @param {string} text
         * @param {(resolution: number) => TerrainData} createBaseData
         * @returns {TerrainData | null} null if the text is empty or not valid.
         */
        decode(text, createBaseData) {
            if (!text) return null;
            const parts = text.split(';');
            const resolution = parseInt(parts[1], 10);
            if (readableFormatVersions.indexOf(parts[0]) === -1 || RESOLUTIONS.indexOf(resolution) === -1) {
                return null;
            }
            try {
                const reader = new ByteReader(fromBase64(parts[2]));
                const data = createBaseData(resolution);
                const heightChanges = readGrid(reader, data.size);
                for (let index = 0; index < heightChanges.length; index++) {
                    data.heights[index] = clamp01(data.heights[index] + heightChanges[index] / 65535);
                }
                for (let layer = 0; layer < LAYER_COUNT; layer++) {
                    const weightChanges = readGrid(reader, data.size);
                    for (let index = 0; index < weightChanges.length; index++) {
                        const offset = index * LAYER_COUNT + layer;
                        // The base may have changed since the data was saved.
                        data.splat[offset] = Math.min(Math.max(data.splat[offset] + weightChanges[index], 0), 255);
                    }
                }
                if (parts[0] !== '1') {
                    for (let channel = 0; channel < 4; channel++) {
                        const colorChanges = readGrid(reader, data.size);
                        for (let index = 0; index < colorChanges.length; index++) {
                            const offset = index * 4 + channel;
                            data.colors[offset] = Math.min(Math.max(data.colors[offset] + colorChanges[index], 0), 255);
                        }
                    }
                }
                return data;
            } catch (error) {
                console.error('Terrain data could not be read:', error);
                return null;
            }
        },
    };
})();

const lodIndices = new Map();
/**
 * The triangles of a chunk, shared by all chunks of the same size. Chunk
 * borders have a skirt going down, hiding the gaps between chunks drawn
 * with different levels of detail.
 * @param {number} chunkCells
 * @param {number} step
 */
const getLodIndex = (chunkCells, step) => {
    const key = chunkCells + ';' + step;
    const existingIndex = lodIndices.get(key);
    if (existingIndex) return existingIndex;

    const sideVertices = chunkCells + 1;
    const gridVertices = sideVertices * sideVertices;
    const indices = [];
    const grid = (i, j) => j * sideVertices + i;
    for (let j = 0; j < chunkCells; j += step) {
        for (let i = 0; i < chunkCells; i += step) {
            const topLeft = grid(i, j);
            const topRight = grid(i + step, j);
            const bottomLeft = grid(i, j + step);
            const bottomRight = grid(i + step, j + step);
            indices.push(topLeft, topRight, bottomLeft, topRight, bottomRight, bottomLeft);
        }
    }
    const borders = [
        (k) => grid(k, 0),
        (k) => grid(k, chunkCells),
        (k) => grid(0, k),
        (k) => grid(chunkCells, k),
    ];
    borders.forEach((borderVertex, border) => {
        const skirtVertex = (k) => gridVertices + border * sideVertices + k;
        for (let k = 0; k < chunkCells; k += step) {
            const a = borderVertex(k);
            const b = borderVertex(k + step);
            const skirtA = skirtVertex(k);
            const skirtB = skirtVertex(k + step);
            // Both faces, as a skirt can be seen from either side.
            indices.push(a, b, skirtB, a, skirtB, skirtA, a, skirtB, b, a, skirtA, skirtB);
        }
    });
    const index = new THREE.BufferAttribute(new Uint16Array(indices), 1);
    lodIndices.set(key, index);
    return index;
};

const vertexShaderDeclarations = `
varying vec2 vTerrainLocalXY;
varying float vTerrainLocalZ;
uniform float terrainWorldScale;
varying vec2 vTerrainWorldXY;
varying float vTerrainUp;
`;
const vertexShaderCode = `
vTerrainLocalXY = position.xy;
vTerrainLocalZ = position.z;
vTerrainWorldXY = (modelMatrix * vec4(transformed, 1.0)).xy * terrainWorldScale;
vTerrainUp = normalize(transpose(inverse(mat3(modelMatrix))) * objectNormal).z;
`;
const fragmentShaderDeclarations = `
uniform sampler2D terrainSplatMap;
uniform vec2 terrainSplatUvScaleAndOffset;
uniform vec3 terrainLayerColors[4];
uniform sampler2D terrainLayerMap0;
uniform sampler2D terrainLayerMap1;
uniform sampler2D terrainLayerMap2;
uniform sampler2D terrainLayerMap3;
uniform sampler2D terrainLayerNormalMap0;
uniform sampler2D terrainLayerNormalMap1;
uniform sampler2D terrainLayerNormalMap2;
uniform sampler2D terrainLayerNormalMap3;
uniform float terrainHasNormalMaps;
uniform float terrainNormalMapStrength;
uniform float terrainTextureSize;
uniform float terrainHeightBlending;
uniform float terrainTextureVariation;
uniform vec4 terrainCliffLayer;
uniform vec2 terrainCliffCosines;
uniform vec4 terrainBrush;
uniform sampler2D terrainColorMap;
uniform vec3 terrainWetShore;
varying vec2 vTerrainLocalXY;
varying float vTerrainLocalZ;
varying vec2 vTerrainWorldXY;
varying float vTerrainUp;

float terrainHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
// The rotation of the copies of textures used to make repetition less visible.
const mat2 terrainCopyRotation = mat2(0.8, -0.6, 0.6, 0.8);
/** A bump of a normal map (from -1 to 1), mixed with its rotated copy in patches. */
vec3 terrainSampleNormal(sampler2D normalMap, vec2 uv, vec2 uv2, float patches) {
  vec3 bump = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
  if (patches <= 0.0) return bump;
  vec3 copyBump = texture2D(normalMap, uv2).xyz * 2.0 - 1.0;
  // The bumps of the copy are rotated back with the inverse rotation.
  copyBump.xy = transpose(terrainCopyRotation) * copyBump.xy;
  return mix(bump, copyBump, patches);
}
float terrainNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(terrainHash(i), terrainHash(i + vec2(1.0, 0.0)), u.x),
    mix(terrainHash(i + vec2(0.0, 1.0)), terrainHash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
`;
// Holes are samples without any painted layer: the interpolated sum of the
// weights gives smooth edges. Only compiled for terrains having holes, as
// discard makes drawing slower on some GPUs.
const holeShaderCode = `
#ifdef TERRAIN_HOLES
if (dot(texture2D(terrainSplatMap, vTerrainLocalXY * terrainSplatUvScaleAndOffset.x + terrainSplatUvScaleAndOffset.y), vec4(1.0)) < 0.5) discard;
#endif
`;
// For the shadows: the depth of holes is not drawn.
const holeDepthShaderDeclarations = `
uniform sampler2D terrainSplatMap;
uniform vec2 terrainSplatUvScaleAndOffset;
varying vec2 vTerrainLocalXY;
`;

const fragmentShaderCode = holeShaderCode + `
// Borders between layers are made irregular and sharper, to look painted.
vec2 terrainNoisePosition = vTerrainWorldXY / 24.0;
vec4 terrainJitter = vec4(
  terrainNoise(terrainNoisePosition),
  terrainNoise(terrainNoisePosition + 19.1),
  terrainNoise(terrainNoisePosition + 37.7),
  terrainNoise(terrainNoisePosition + 53.3)
);
// Layer weights are in a texture, so that painted details stay the same
// whatever the level of detail of the ground.
vec2 terrainSplatUv = vTerrainLocalXY * terrainSplatUvScaleAndOffset.x + terrainSplatUvScaleAndOffset.y;
vec4 terrainWeights = texture2D(terrainSplatMap, terrainSplatUv) * (0.7 + 0.6 * terrainJitter);
terrainWeights = terrainWeights * terrainWeights;
terrainWeights /= max(dot(terrainWeights, vec4(1.0)), 0.00001);
float terrainCliff = 1.0 - smoothstep(terrainCliffCosines.x, terrainCliffCosines.y, vTerrainUp);
terrainWeights = mix(terrainWeights, terrainCliffLayer, terrainCliff * dot(terrainCliffLayer, vec4(1.0)));

vec2 terrainUv = vTerrainWorldXY / terrainTextureSize;
vec3 terrainTexture0 = texture2D(terrainLayerMap0, terrainUv).rgb;
vec3 terrainTexture1 = texture2D(terrainLayerMap1, terrainUv).rgb;
vec3 terrainTexture2 = texture2D(terrainLayerMap2, terrainUv).rgb;
vec3 terrainTexture3 = texture2D(terrainLayerMap3, terrainUv).rgb;

// Less visible repetition: in irregular patches, textures are replaced by a
// rotated and shifted copy of themselves, and colors slowly vary.
float terrainPatches = 0.0;
vec2 terrainUv2 = terrainUv;
float terrainColorVariation = 1.0;
if (terrainTextureVariation > 0.0) {
  // Up to half of the ground is covered by the copies, each patch showing
  // only one of them (mixing them would make them blurry).
  float terrainPatchThreshold = 1.0 - 0.5 * terrainTextureVariation;
  terrainPatches = smoothstep(terrainPatchThreshold - 0.05, terrainPatchThreshold + 0.05, terrainNoise(terrainUv * 0.23 + 7.3));
  terrainUv2 = terrainCopyRotation * terrainUv + vec2(0.31, 0.73);
  terrainTexture0 = mix(terrainTexture0, texture2D(terrainLayerMap0, terrainUv2).rgb, terrainPatches);
  terrainTexture1 = mix(terrainTexture1, texture2D(terrainLayerMap1, terrainUv2).rgb, terrainPatches);
  terrainTexture2 = mix(terrainTexture2, texture2D(terrainLayerMap2, terrainUv2).rgb, terrainPatches);
  terrainTexture3 = mix(terrainTexture3, texture2D(terrainLayerMap3, terrainUv2).rgb, terrainPatches);
  terrainColorVariation += terrainTextureVariation * 0.3 *
    (terrainNoise(terrainUv * 0.11) + 0.5 * terrainNoise(terrainUv * 0.37 + 3.1) - 0.75);
}

// Height-based blending: the brightness of a texture, compared to its
// average, is used as its height. Where layers meet, the high parts (stones,
// tufts) cover the low parts (sand, gaps) instead of fading into each other.
if (terrainHeightBlending > 0.0) {
  const vec3 terrainLuminance = vec3(0.299, 0.587, 0.114);
  vec4 terrainHeights = vec4(
    dot(terrainTexture0 - textureLod(terrainLayerMap0, vec2(0.5), 16.0).rgb, terrainLuminance),
    dot(terrainTexture1 - textureLod(terrainLayerMap1, vec2(0.5), 16.0).rgb, terrainLuminance),
    dot(terrainTexture2 - textureLod(terrainLayerMap2, vec2(0.5), 16.0).rgb, terrainLuminance),
    dot(terrainTexture3 - textureLod(terrainLayerMap3, vec2(0.5), 16.0).rgb, terrainLuminance)
  );
  vec4 terrainHeightWeights = terrainWeights + terrainHeights;
  float terrainTop = max(max(terrainHeightWeights.x, terrainHeightWeights.y), max(terrainHeightWeights.z, terrainHeightWeights.w));
  // Only painted layers (and the cliff layer) can show.
  vec4 terrainHeightBlend = max(terrainHeightWeights - terrainTop + 0.1, 0.0) * step(0.004, terrainWeights);
  terrainHeightBlend /= max(dot(terrainHeightBlend, vec4(1.0)), 0.00001);
  terrainWeights = mix(terrainWeights, terrainHeightBlend, terrainHeightBlending);
}

vec3 terrainColor = terrainColorVariation * (
  terrainWeights.x * terrainLayerColors[0] * terrainTexture0 +
  terrainWeights.y * terrainLayerColors[1] * terrainTexture1 +
  terrainWeights.z * terrainLayerColors[2] * terrainTexture2 +
  terrainWeights.w * terrainLayerColors[3] * terrainTexture3);

// The painted tint multiplies all layers. Wet ground is darker (and
// shinier, see the roughness).
vec4 terrainTintAndWetness = texture2D(terrainColorMap, terrainSplatUv);
float terrainWetness = max(
  terrainTintAndWetness.a,
  terrainWetShore.z * (1.0 - smoothstep(terrainWetShore.x, terrainWetShore.x + terrainWetShore.y, vTerrainLocalZ))
);
terrainColor *= terrainTintAndWetness.rgb * (1.0 - 0.4 * terrainWetness);
diffuseColor.rgb *= terrainColor;

if (terrainBrush.w > 0.5) {
  float brushDistance = distance(vTerrainWorldXY, terrainBrush.xy);
  float ringWidth = max(terrainBrush.z * 0.04, 1.5);
  float ring = 1.0 - smoothstep(0.0, ringWidth, abs(brushDistance - terrainBrush.z));
  float disc = brushDistance < terrainBrush.z ? 0.12 : 0.0;
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), max(ring * 0.85, disc));
}
`;

const fragmentShaderRoughnessCode = `
roughnessFactor = mix(roughnessFactor, 0.3, terrainWetness);
`;

const fragmentShaderNormalCode = `
if (terrainHasNormalMaps > 0.5) {
  vec3 terrainMapNormal =
    terrainWeights.x * terrainSampleNormal(terrainLayerNormalMap0, terrainUv, terrainUv2, terrainPatches) +
    terrainWeights.y * terrainSampleNormal(terrainLayerNormalMap1, terrainUv, terrainUv2, terrainPatches) +
    terrainWeights.z * terrainSampleNormal(terrainLayerNormalMap2, terrainUv, terrainUv2, terrainPatches) +
    terrainWeights.w * terrainSampleNormal(terrainLayerNormalMap3, terrainUv, terrainUv2, terrainPatches);
  terrainMapNormal.xy *= terrainNormalMapStrength;
  // The X and Y of textures follow the X and Y of the 3D world, projected on
  // the ground (the camera space of the normal is used).
  vec3 terrainTangent = (viewMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz;
  terrainTangent -= normal * dot(normal, terrainTangent);
  // A ground facing the X axis (a rotated terrain) uses the Y axis instead.
  if (dot(terrainTangent, terrainTangent) < 0.000001) {
    terrainTangent = (viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
    terrainTangent -= normal * dot(normal, terrainTangent);
  }
  terrainTangent = normalize(terrainTangent);
  vec3 terrainBitangent = cross(normal, terrainTangent);
  normal = normalize(mat3(terrainTangent, terrainBitangent, normal) * terrainMapNormal);
}
`;

let whiteTexture = null;
const getWhiteTexture = () => {
    if (!whiteTexture) {
        whiteTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
        whiteTexture.needsUpdate = true;
    }
    return whiteTexture;
};

let flatNormalTexture = null;
const getFlatNormalTexture = () => {
    if (!flatNormalTexture) {
        flatNormalTexture = new THREE.DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1);
        flatNormalTexture.needsUpdate = true;
    }
    return flatNormalTexture;
};

const layerTextures = new WeakMap();
const layerNormalMaps = new WeakMap();
/**
 * Textures of the image manager have no mipmaps: they would shimmer when
 * repeated in the distance.
 * @param {gdjs.RuntimeGame} game
 * @param {string} resourceName
 * @param {boolean} isNormalMap Normal maps are directions, not colors.
 */
const getLayerTexture = (game, resourceName, isNormalMap) => {
    if (!resourceName) return isNormalMap ? getFlatNormalTexture() : getWhiteTexture();
    const imageTexture = game.getImageManager().getThreeTexture(resourceName);
    const textures = isNormalMap ? layerNormalMaps : layerTextures;
    let texture = textures.get(imageTexture);
    if (!texture) {
        texture = imageTexture.clone();
        if (isNormalMap) texture.colorSpace = THREE.NoColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;
        texture.anisotropy = 4;
        texture.needsUpdate = true;
        textures.set(imageTexture, texture);
    }
    return texture;
};

/**
 * A texture of 4 bytes per sample of a grid of `size * size` samples (layer
 * weights, tint and wetness...), interpolated between samples.
 * @param {Uint8Array} bytes
 * @param {number} size
 */
const createGridTexture = (bytes, size) => {
    const texture = new THREE.DataTexture(bytes, size, size);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.userData.isUploaded = false;
    texture.onUpdate = () => {
        texture.userData.isUploaded = true;
    };
    return texture;
};

/**
 * Send the rows of the changed samples to the GPU, or the whole texture
 * before its first upload (and in older GDevelop versions).
 * @param {THREE.DataTexture} texture
 * @param {SampleRectangle} samples
 */
const uploadGridTextureRows = (texture, samples) => {
    if (texture.userData.isUploaded && typeof texture.addUpdateRange === 'function') {
        const size = texture.image.width;
        for (let j = samples.minJ; j <= samples.maxJ; j++) {
            texture.addUpdateRange((j * size + samples.minI) * 4, (samples.maxI - samples.minI + 1) * 4);
        }
    }
    texture.needsUpdate = true;
};

class TerrainRenderer {
    /** @param {Terrain} terrain */
    constructor(terrain) {
        this.terrain = terrain;
        this.group = new THREE.Group();
        terrain.object.get3DRendererObject().add(this.group);
        /** @type {Array<{mesh: THREE.Mesh, geometry: THREE.BufferGeometry, firstI: number, firstJ: number, center: THREE.Vector3, lod: number}>} */
        this.chunks = [];
        this.chunksPerSide = 0;
        this.chunkCells = 0;
        this.chunkSideVertices = 0;
        this.chunkGridVertices = 0;
        this.chunkVertices = 0;
        /** @type {THREE.DataTexture | null} */
        this.splatTexture = null;
        /** @type {THREE.DataTexture | null} */
        this.colorTexture = null;
        this.uniforms = {
            terrainSplatMap: { value: getWhiteTexture() },
            terrainSplatUvScaleAndOffset: { value: new THREE.Vector2() },
            terrainLayerColors: { value: [new THREE.Color(), new THREE.Color(), new THREE.Color(), new THREE.Color()] },
            terrainLayerMap0: { value: getWhiteTexture() },
            terrainLayerMap1: { value: getWhiteTexture() },
            terrainLayerMap2: { value: getWhiteTexture() },
            terrainLayerMap3: { value: getWhiteTexture() },
            terrainLayerNormalMap0: { value: getFlatNormalTexture() },
            terrainLayerNormalMap1: { value: getFlatNormalTexture() },
            terrainLayerNormalMap2: { value: getFlatNormalTexture() },
            terrainLayerNormalMap3: { value: getFlatNormalTexture() },
            terrainHasNormalMaps: { value: 0 },
            terrainNormalMapStrength: { value: 1 },
            terrainTextureSize: { value: 256 },
            terrainHeightBlending: { value: 0 },
            terrainTextureVariation: { value: 0 },
            terrainCliffLayer: { value: new THREE.Vector4() },
            terrainCliffCosines: { value: new THREE.Vector2() },
            terrainBrush: { value: new THREE.Vector4() },
            terrainColorMap: { value: getWhiteTexture() },
            // Z (in the terrain group) under which the ground is wet, fade height, and 1 if it's used.
            terrainWetShore: { value: new THREE.Vector3() },
            // Scene units by 3D world unit.
            terrainWorldScale: { value: 1 },
        };
        this.material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
        this.material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms);
            shader.vertexShader = patchShaderCode(shader.vertexShader, [
                ['#include <common>', '#include <common>\n' + vertexShaderDeclarations],
                ['#include <begin_vertex>', '#include <begin_vertex>\n' + vertexShaderCode],
            ], 'Terrain3D');
            shader.fragmentShader = patchShaderCode(shader.fragmentShader, [
                ['#include <common>', '#include <common>\n' + fragmentShaderDeclarations],
                ['#include <map_fragment>', fragmentShaderCode],
                ['#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n' + fragmentShaderRoughnessCode],
                ['#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + fragmentShaderNormalCode],
            ], 'Terrain3D');
        };
        this.material.customProgramCacheKey = () => (this.hasHoles ? 'Terrain3DWithHoles' : 'Terrain3D');
        this.hasHoles = false;
        // Without them, holes would cast shadows.
        this.depthMaterial = this._createHoleDepthMaterial(new THREE.MeshDepthMaterial());
        this.distanceMaterial = this._createHoleDepthMaterial(new THREE.MeshDistanceMaterial());
        this._cameraPosition = new THREE.Vector3();
        this._chunkPosition = new THREE.Vector3();
        this._scale = new THREE.Vector3();
    }

    /**
     * @param {THREE.MeshDepthMaterial | THREE.MeshDistanceMaterial} material
     * @returns The material, drawing nothing in holes.
     */
    _createHoleDepthMaterial(material) {
        material.defines = { TERRAIN_HOLES: '' };
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, this.uniforms);
            shader.vertexShader = patchShaderCode(shader.vertexShader, [
                ['#include <common>', '#include <common>\nvarying vec2 vTerrainLocalXY;'],
                ['#include <begin_vertex>', '#include <begin_vertex>\nvTerrainLocalXY = position.xy;'],
            ], 'Terrain3D shadows');
            shader.fragmentShader = patchShaderCode(shader.fragmentShader, [
                ['#include <common>', '#include <common>\n' + holeDepthShaderDeclarations],
                ['#include <clipping_planes_fragment>', holeShaderCode + '#include <clipping_planes_fragment>'],
            ], 'Terrain3D shadows');
        };
        material.customProgramCacheKey = () => 'Terrain3DHoles';
        return material;
    }

    /**
     * Use the shaders drawing holes, or the faster ones without them.
     * @param {boolean} hasHoles
     */
    setHasHoles(hasHoles) {
        if (hasHoles === this.hasHoles) return;
        this.hasHoles = hasHoles;
        // The material has its own defines (STANDARD).
        if (hasHoles) this.material.defines.TERRAIN_HOLES = '';
        else delete this.material.defines.TERRAIN_HOLES;
        this.material.needsUpdate = true;
        for (const chunk of this.chunks) this._setChunkShadowMaterials(chunk.mesh);
    }

    /** @param {THREE.Mesh} mesh */
    _setChunkShadowMaterials(mesh) {
        mesh.customDepthMaterial = this.hasHoles ? this.depthMaterial : undefined;
        mesh.customDistanceMaterial = this.hasHoles ? this.distanceMaterial : undefined;
    }

    /** Recreate all the chunks, for example after the resolution changed. */
    rebuild() {
        this.disposeChunks();
        const { data } = this.terrain;
        this.chunkCells = getChunkCells(data.resolution);
        this.chunkSideVertices = this.chunkCells + 1;
        this.chunkGridVertices = this.chunkSideVertices * this.chunkSideVertices;
        this.chunkVertices = this.chunkGridVertices + 4 * this.chunkSideVertices;
        this.chunksPerSide = data.resolution / this.chunkCells;
        const cellSize = AREA_SIZE / data.resolution;
        // Sample centers are at the texel centers.
        this.splatTexture = createGridTexture(data.splat, data.size);
        this.uniforms.terrainSplatMap.value = this.splatTexture;
        this.colorTexture = createGridTexture(data.colors, data.size);
        // Tints are colors chosen like the layer colors.
        this.colorTexture.colorSpace = THREE.SRGBColorSpace;
        this.uniforms.terrainColorMap.value = this.colorTexture;
        this.uniforms.terrainSplatUvScaleAndOffset.value.set(1 / (cellSize * data.size), 0.5 / data.size);
        for (let chunkJ = 0; chunkJ < this.chunksPerSide; chunkJ++) {
            for (let chunkI = 0; chunkI < this.chunksPerSide; chunkI++) {
                const firstI = chunkI * this.chunkCells;
                const firstJ = chunkJ * this.chunkCells;
                const positions = new Float32Array(this.chunkVertices * 3);
                for (let j = 0; j < this.chunkSideVertices; j++) {
                    for (let i = 0; i < this.chunkSideVertices; i++) {
                        const vertex = j * this.chunkSideVertices + i;
                        positions[vertex * 3] = (firstI + i) * cellSize;
                        positions[vertex * 3 + 1] = (firstJ + j) * cellSize;
                    }
                }
                // Skirt vertices are below border vertices.
                this._forEachSkirtVertex((skirtVertex, borderVertex) => {
                    positions[skirtVertex * 3] = positions[borderVertex * 3];
                    positions[skirtVertex * 3 + 1] = positions[borderVertex * 3 + 1];
                });
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(this.chunkVertices * 3), 3));
                geometry.setIndex(getLodIndex(this.chunkCells, LOD_STEPS[0]));
                geometry.boundingBox = new THREE.Box3();
                geometry.boundingSphere = new THREE.Sphere();
                const mesh = new THREE.Mesh(geometry, this.material);
                mesh.matrixAutoUpdate = false;
                // Rays hit the ground at its full resolution, whatever the level of
                // detail drawn, and go through holes.
                const chunkCells = this.chunkCells;
                const terrainData = () => this.terrain.data;
                const localPoint = new THREE.Vector3();
                mesh.raycast = function (raycaster, intersects) {
                    const drawnIndex = geometry.index;
                    const firstIntersection = intersects.length;
                    geometry.setIndex(getLodIndex(chunkCells, LOD_STEPS[0]));
                    THREE.Mesh.prototype.raycast.call(this, raycaster, intersects);
                    geometry.setIndex(drawnIndex);
                    const data = terrainData();
                    const cellSize = AREA_SIZE / data.resolution;
                    for (let index = intersects.length - 1; index >= firstIntersection; index--) {
                        this.worldToLocal(localPoint.copy(intersects[index].point));
                        if (data.sampleSolidity(localPoint.x / cellSize, localPoint.y / cellSize) < 0.5) {
                            intersects.splice(index, 1);
                        }
                    }
                };
                this._setChunkShadowMaterials(mesh);
                this.group.add(mesh);
                this.chunks.push({
                    mesh,
                    geometry,
                    firstI,
                    firstJ,
                    center: new THREE.Vector3(
                        (firstI + this.chunkCells / 2) * cellSize,
                        (firstJ + this.chunkCells / 2) * cellSize,
                        0
                    ),
                    lod: 0,
                });
            }
        }
        this.updateSamples(new SampleRectangle().set(0, 0, data.resolution, data.resolution), true);
        this.updateMaterial();
    }

    _forEachSkirtVertex(callback) {
        for (let k = 0; k < this.chunkSideVertices; k++) {
            callback(this.chunkGridVertices + k, k);
            callback(this.chunkGridVertices + this.chunkSideVertices + k, this.chunkCells * this.chunkSideVertices + k);
            callback(this.chunkGridVertices + 2 * this.chunkSideVertices + k, k * this.chunkSideVertices);
            callback(
                this.chunkGridVertices + 3 * this.chunkSideVertices + k,
                k * this.chunkSideVertices + this.chunkCells
            );
        }
    }

    /**
     * Skirts go down only to the lowest point a coarser neighbor chunk can
     * draw along the border, so that they can't be seen through holes.
     * @param {Float32Array} positions
     */
    _updateSkirtHeights(positions) {
        const coarsestStep = LOD_STEPS[LOD_STEPS.length - 1];
        const borderVertices = [
            (k) => k,
            (k) => this.chunkCells * this.chunkSideVertices + k,
            (k) => k * this.chunkSideVertices,
            (k) => k * this.chunkSideVertices + this.chunkCells,
        ];
        borderVertices.forEach((borderVertex, border) => {
            for (let k = 0; k < this.chunkSideVertices; k++) {
                let minZ = Infinity;
                const from = Math.max(k - coarsestStep, 0);
                const to = Math.min(k + coarsestStep, this.chunkCells);
                for (let other = from; other <= to; other++) {
                    minZ = Math.min(minZ, positions[borderVertex(other) * 3 + 2]);
                }
                const skirtVertex = this.chunkGridVertices + border * this.chunkSideVertices + k;
                positions[skirtVertex * 3 + 2] = minZ;
            }
        });
    }

    /**
     * Update the vertices of the chunks sharing the given samples.
     * @param {SampleRectangle} samples
     * @param {boolean} hasPaintChanged
     */
    updateSamples(samples, hasPaintChanged) {
        if (samples.isEmpty()) return;
        const { data } = this.terrain;
        const cellSize = AREA_SIZE / data.resolution;
        const slopeFactor = AREA_DEPTH / cellSize;
        // Normals of samples next to changed ones change too.
        const minI = Math.max(samples.minI - 1, 0);
        const minJ = Math.max(samples.minJ - 1, 0);
        const maxI = Math.min(samples.maxI + 1, data.resolution);
        const maxJ = Math.min(samples.maxJ + 1, data.resolution);
        const firstChunkI = Math.max(Math.ceil(minI / this.chunkCells) - 1, 0);
        const firstChunkJ = Math.max(Math.ceil(minJ / this.chunkCells) - 1, 0);
        const lastChunkI = Math.min(Math.floor(maxI / this.chunkCells), this.chunksPerSide - 1);
        const lastChunkJ = Math.min(Math.floor(maxJ / this.chunkCells), this.chunksPerSide - 1);

        for (let chunkJ = firstChunkJ; chunkJ <= lastChunkJ; chunkJ++) {
            for (let chunkI = firstChunkI; chunkI <= lastChunkI; chunkI++) {
                const chunk = this.chunks[chunkJ * this.chunksPerSide + chunkI];
                const positions = chunk.geometry.attributes.position.array;
                const normals = chunk.geometry.attributes.normal.array;
                const fromI = Math.max(minI - chunk.firstI, 0);
                const toI = Math.min(maxI - chunk.firstI, this.chunkCells);
                const fromJ = Math.max(minJ - chunk.firstJ, 0);
                const toJ = Math.min(maxJ - chunk.firstJ, this.chunkCells);
                for (let j = fromJ; j <= toJ; j++) {
                    const gridJ = chunk.firstJ + j;
                    for (let i = fromI; i <= toI; i++) {
                        const gridI = chunk.firstI + i;
                        const vertex = j * this.chunkSideVertices + i;
                        const sample = gridJ * data.size + gridI;
                        positions[vertex * 3 + 2] = data.heights[sample] * AREA_DEPTH;

                        const leftI = Math.max(gridI - 1, 0);
                        const rightI = Math.min(gridI + 1, data.resolution);
                        const upJ = Math.max(gridJ - 1, 0);
                        const downJ = Math.min(gridJ + 1, data.resolution);
                        const nx =
                            ((data.getHeight(leftI, gridJ) - data.getHeight(rightI, gridJ)) * slopeFactor) /
                            (rightI - leftI);
                        const ny =
                            ((data.getHeight(gridI, upJ) - data.getHeight(gridI, downJ)) * slopeFactor) /
                            (downJ - upJ);
                        const inverseLength = 1 / Math.sqrt(nx * nx + ny * ny + 1);
                        normals[vertex * 3] = nx * inverseLength;
                        normals[vertex * 3 + 1] = ny * inverseLength;
                        normals[vertex * 3 + 2] = inverseLength;
                    }
                }
                this._forEachSkirtVertex((skirtVertex, borderVertex) => {
                    for (let axis = 0; axis < 3; axis++) {
                        normals[skirtVertex * 3 + axis] = normals[borderVertex * 3 + axis];
                    }
                });
                this._updateSkirtHeights(positions);
                let maxZ = 0;
                for (let vertex = 0; vertex < this.chunkGridVertices; vertex++) {
                    maxZ = Math.max(maxZ, positions[vertex * 3 + 2]);
                }
                const chunkSize = this.chunkCells * cellSize;
                chunk.geometry.boundingBox.min.set(chunk.firstI * cellSize, chunk.firstJ * cellSize, 0);
                chunk.geometry.boundingBox.max.set(
                    chunk.firstI * cellSize + chunkSize,
                    chunk.firstJ * cellSize + chunkSize,
                    maxZ
                );
                chunk.geometry.boundingBox.getBoundingSphere(chunk.geometry.boundingSphere);
                chunk.center.z = maxZ / 2;
                chunk.geometry.attributes.position.needsUpdate = true;
                chunk.geometry.attributes.normal.needsUpdate = true;
            }
        }
        if (hasPaintChanged) {
            // The data may have been replaced by one with the same resolution.
            this.splatTexture.image.data = data.splat;
            uploadGridTextureRows(this.splatTexture, samples);
            this.colorTexture.image.data = data.colors;
            uploadGridTextureRows(this.colorTexture, samples);
        }
    }

    updateMaterial() {
        const { object } = this.terrain;
        const game = object.getRuntimeScene().getGame();
        const colors = [object._getLayer1Color(), object._getLayer2Color(), object._getLayer3Color(), object._getLayer4Color()];
        const textures = [
            object._getLayer1Texture(),
            object._getLayer2Texture(),
            object._getLayer3Texture(),
            object._getLayer4Texture(),
        ];
        const normalMaps = [
            object._getLayer1NormalMap(),
            object._getLayer2NormalMap(),
            object._getLayer3NormalMap(),
            object._getLayer4NormalMap(),
        ];
        for (let layer = 0; layer < LAYER_COUNT; layer++) {
            this.uniforms.terrainLayerColors.value[layer].set(gdjs.rgbOrHexStringToNumber(colors[layer]));
            this.uniforms['terrainLayerMap' + layer].value = getLayerTexture(game, textures[layer], false);
            this.uniforms['terrainLayerNormalMap' + layer].value = getLayerTexture(game, normalMaps[layer], true);
        }
        this.uniforms.terrainHasNormalMaps.value = normalMaps.some((normalMap) => !!normalMap) ? 1 : 0;
        this.uniforms.terrainNormalMapStrength.value = Math.max(object._getNormalMapStrength(), 0);
        this.uniforms.terrainTextureSize.value = Math.max(object._getTextureSize(), 1);
        this.uniforms.terrainHeightBlending.value = clamp01(object._getHeightBlending());
        this.uniforms.terrainTextureVariation.value = clamp01(object._getTextureVariation());

        const cliffLayer = parseInt(object._getCliffLayer(), 10);
        const cliffAngle = gdjs.toRad(object._getCliffAngle());
        const cliffBlendAngle = gdjs.toRad(4);
        this.uniforms.terrainCliffLayer.value.set(
            cliffLayer === 1 ? 1 : 0,
            cliffLayer === 2 ? 1 : 0,
            cliffLayer === 3 ? 1 : 0,
            cliffLayer === 4 ? 1 : 0
        );
        this.uniforms.terrainCliffCosines.value.set(
            Math.cos(cliffAngle + cliffBlendAngle),
            Math.cos(cliffAngle - cliffBlendAngle)
        );

        const castShadow = object._getCastShadow();
        const receiveShadow = object._getReceiveShadow();
        for (const chunk of this.chunks) {
            chunk.mesh.castShadow = castShadow;
            chunk.mesh.receiveShadow = receiveShadow;
        }
    }

    /**
     * Show the brush circle of the editor.
     * @param {THREE.Vector3 | null} localPosition
     * @param {number} radius In scene units.
     */
    setBrush(localPosition, radius) {
        const brush = this.uniforms.terrainBrush.value;
        if (!localPosition) {
            brush.w = 0;
            return;
        }
        this.group.updateWorldMatrix(true, false);
        const worldPosition = this._chunkPosition.copy(localPosition).applyMatrix4(this.group.matrixWorld);
        const worldScale = this.uniforms.terrainWorldScale.value;
        brush.set(worldPosition.x * worldScale, worldPosition.y * worldScale, radius, 1);
    }

    /** @param {THREE.Camera | null} camera */
    updateLevelsOfDetail(camera) {
        if (!camera || !this.group.visible) return;
        const matrixWorld = this.group.matrixWorld;
        this._cameraPosition.setFromMatrixPosition(camera.matrixWorld);
        this._scale.setFromMatrixScale(matrixWorld);
        const cellSize = AREA_SIZE / this.terrain.data.resolution;
        const chunkWorldSize = this.chunkCells * cellSize * Math.max(this._scale.x, this._scale.y);
        for (const chunk of this.chunks) {
            const distance =
                this._chunkPosition.copy(chunk.center).applyMatrix4(matrixWorld).distanceTo(this._cameraPosition) /
                chunkWorldSize;
            let lod = LOD_DISTANCES.length - 1;
            while (lod > 0 && distance < LOD_DISTANCES[lod]) lod--;
            if (lod !== chunk.lod) {
                chunk.lod = lod;
                chunk.geometry.setIndex(getLodIndex(this.chunkCells, LOD_STEPS[lod]));
            }
        }
    }

    disposeChunks() {
        for (const chunk of this.chunks) {
            chunk.mesh.removeFromParent();
            // The index is shared by all chunks: it must stay on the GPU.
            chunk.geometry.setIndex(null);
            chunk.geometry.dispose();
        }
        this.chunks.length = 0;
        if (this.splatTexture) this.splatTexture.dispose();
        this.splatTexture = null;
        if (this.colorTexture) this.colorTexture.dispose();
        this.colorTexture = null;
    }

    dispose() {
        this.disposeChunks();
        this.material.dispose();
        this.depthMaterial.dispose();
        this.distanceMaterial.dispose();
        this.group.removeFromParent();
    }
}

/**
 * Makes a Physics3D behavior use a height field shape following the terrain.
 * Changes of heights are applied to the shape without recreating it.
 * @implements {gdjs.Physics3DRuntimeBehavior.BodyUpdater}
 */
class TerrainBodyUpdater {
    /**
     * @param {Terrain} terrain
     * @param {gdjs.Physics3DRuntimeBehavior} physics
     */
    constructor(terrain, physics) {
        this.terrain = terrain;
        this.physics = physics;
        this.defaultBodyUpdater = physics.bodyUpdater;
        this.changedSamples = new SampleRectangle();
        /** @type {Jolt.HeightFieldShape | null} */
        this.heightField = null;
        this.heightScale = 1;
        this.heightsBufferPointer = 0;
        this.heightsBufferLength = 0;
        this.bodyX = 0;
        this.bodyY = 0;
        this.bodyZ = 0;
        this.bodyHeight = 0;
        physics.bodyType = 'Static';
        physics.bodyUpdater = this;
    }

    createShape() {
        const { data, object } = this.terrain;
        const worldInvScale = this.physics._sharedData.worldInvScale;
        const { size } = data;
        this.heightScale = object.getDepth() * worldInvScale;

        // Changes of heights (SetHeights) break collisions unless the sample
        // count is a power of 2: extra samples have no collision.
        const sampleCount = Math.pow(2, Math.ceil(Math.log2(size)));
        const settings = new Jolt.HeightFieldShapeSettings();
        settings.mScale.Set(
            (object.getWidth() / data.resolution) * worldInvScale,
            1,
            (object.getHeight() / data.resolution) * worldInvScale
        );
        settings.mSampleCount = sampleCount;
        settings.mBlockSize = 4;
        // Allows later changes of heights on the whole depth of the object.
        settings.mMinHeightValue = 0;
        settings.mMaxHeightValue = this.heightScale;
        settings.mHeightSamples.resize(sampleCount * sampleCount);
        const samples = new Float32Array(
            Jolt.HEAPF32.buffer,
            Jolt.getPointer(settings.mHeightSamples.data()),
            sampleCount * sampleCount
        );
        const noCollision = Jolt.HeightFieldShapeConstantValues.prototype.cNoCollisionValue;
        samples.fill(noCollision);
        // Height fields go along X and Z: rows are flipped so that, once
        // rotated to have heights along Z, rows go along Y.
        for (let j = 0; j < size; j++) {
            const row = (size - 1 - j) * sampleCount;
            for (let i = 0; i < size; i++) {
                samples[row + i] = this._getSampleHeight(j * size + i, noCollision);
            }
        }
        const shape = settings.Create().Get();
        Jolt.destroy(settings);
        this.heightField = Jolt.castObject(shape, Jolt.HeightFieldShape);
        this.changedSamples.clear();
        return shape;
    }

    /** @returns {number} The height of a sample in the shape, or no collision in a hole. */
    _getSampleHeight(index, noCollision) {
        const height = this.terrain.surfaceHeights[index];
        return Number.isNaN(height) ? noCollision : height * this.heightScale;
    }

    _getBodyPosition() {
        const { object } = this.terrain;
        const worldInvScale = this.physics._sharedData.worldInvScale;
        this.bodyX = object.getX();
        this.bodyY = object.getY();
        this.bodyZ = object.getZ();
        // The origin of the height field is at the bottom of the terrain (see createShape).
        this.bodyHeight = object.getHeight();
        return this.physics._sharedData.getRVec3(
            object.getX() * worldInvScale,
            (object.getY() + object.getHeight()) * worldInvScale,
            object.getZ() * worldInvScale
        );
    }

    _getBodyRotation() {
        // A quarter turn around X: heights go along Z.
        return this.physics._sharedData.getQuat(Math.SQRT1_2, 0, 0, Math.SQRT1_2);
    }

    createAndAddBody() {
        const { physics } = this;
        const { bodyInterface } = physics._sharedData;
        const shape = this.createShape();
        const settings = new Jolt.BodyCreationSettings(
            shape,
            this._getBodyPosition(),
            this._getBodyRotation(),
            Jolt.EMotionType_Static,
            physics.getBodyLayer()
        );
        settings.mFriction = physics.friction;
        settings.mRestitution = physics.restitution;
        const body = bodyInterface.CreateBody(settings);
        Jolt.destroy(settings);
        bodyInterface.AddBody(body.GetID(), Jolt.EActivation_DontActivate);
        return body;
    }

    updateObjectFromBody() {
        // The terrain is static: the body never moves it.
    }

    updateBodyFromObject() {
        const { physics } = this;
        const body = physics._body;
        if (!body) return;
        const { object } = this.terrain;
        const { bodyInterface } = physics._sharedData;
        if (
            object.getX() !== this.bodyX ||
            object.getY() !== this.bodyY ||
            object.getZ() !== this.bodyZ ||
            object.getHeight() !== this.bodyHeight
        ) {
            bodyInterface.SetPositionAndRotation(
                body.GetID(),
                this._getBodyPosition(),
                this._getBodyRotation(),
                Jolt.EActivation_DontActivate
            );
        }
        if (!this.changedSamples.isEmpty()) {
            this._applyChangedHeights(body);
        }
    }

    _applyChangedHeights(body) {
        const { data } = this.terrain;
        const { size } = data;
        const { minI, minJ, maxI, maxJ } = this.changedSamples;
        // Jolt only changes blocks of samples. Rows are flipped and extra
        // samples have no collision (see createShape).
        const blockSize = this.heightField.GetBlockSize();
        const sampleCount = this.heightField.GetSampleCount();
        const alignDown = (value) => Math.floor(value / blockSize) * blockSize;
        const alignUp = (value) => Math.min(Math.ceil(value / blockSize) * blockSize, sampleCount);
        const firstX = alignDown(minI);
        const firstRow = alignDown(size - 1 - maxJ);
        const width = alignUp(maxI + 1) - firstX;
        const height = alignUp(size - minJ) - firstRow;
        if (width * height > this.heightsBufferLength) {
            if (this.heightsBufferPointer) Jolt._webidl_free(this.heightsBufferPointer);
            this.heightsBufferLength = width * height;
            this.heightsBufferPointer = Jolt._webidl_malloc(this.heightsBufferLength * 4);
        }
        const heights = new Float32Array(Jolt.HEAPF32.buffer, this.heightsBufferPointer, width * height);
        const noCollision = Jolt.HeightFieldShapeConstantValues.prototype.cNoCollisionValue;
        for (let row = 0; row < height; row++) {
            const j = size - 1 - (firstRow + row);
            for (let column = 0; column < width; column++) {
                const i = firstX + column;
                heights[row * width + column] =
                    i < size && j >= 0 ? this._getSampleHeight(j * size + i, noCollision) : noCollision;
            }
        }
        const sharedData = this.physics._sharedData;
        this.heightField.SetHeights(
            firstX,
            firstRow,
            width,
            height,
            this.heightsBufferPointer,
            width,
            sharedData.jolt.GetTempAllocator()
        );
        sharedData.bodyInterface.NotifyShapeChanged(
            body.GetID(),
            sharedData.getVec3(0, 0, 0),
            false,
            Jolt.EActivation_DontActivate
        );
        this._wakeUpBodiesOnChangedSamples();
        this.changedSamples.clear();
    }

    /** Bodies sleeping on the changed area would otherwise float or sink. */
    _wakeUpBodiesOnChangedSamples() {
        const { object, data } = this.terrain;
        const worldInvScale = this.physics._sharedData.worldInvScale;
        const cellWidth = object.getWidth() / data.resolution;
        const cellHeight = object.getHeight() / data.resolution;
        const { minI, minJ, maxI, maxJ } = this.changedSamples;
        const min = new Jolt.Vec3(
            (object.getX() + (minI - 1) * cellWidth) * worldInvScale,
            (object.getY() + (minJ - 1) * cellHeight) * worldInvScale,
            (object.getZ() - 1) * worldInvScale
        );
        const max = new Jolt.Vec3(
            (object.getX() + (maxI + 1) * cellWidth) * worldInvScale,
            (object.getY() + (maxJ + 1) * cellHeight) * worldInvScale,
            (object.getZ() + object.getDepth() + 1) * worldInvScale
        );
        const box = new Jolt.AABox(min, max);
        const broadPhaseLayerFilter = new Jolt.BroadPhaseLayerFilter();
        const objectLayerFilter = new Jolt.ObjectLayerFilter();
        this.physics._sharedData.bodyInterface.ActivateBodiesInAABox(box, broadPhaseLayerFilter, objectLayerFilter);
        Jolt.destroy(min);
        Jolt.destroy(max);
        Jolt.destroy(box);
        Jolt.destroy(broadPhaseLayerFilter);
        Jolt.destroy(objectLayerFilter);
    }

    recreateShape() {
        const body = this.physics._body;
        if (!body) return;
        this.physics._sharedData.bodyInterface.SetShape(
            body.GetID(),
            this.createShape(),
            false,
            Jolt.EActivation_DontActivate
        );
        const { resolution } = this.terrain.data;
        this.changedSamples.set(0, 0, resolution, resolution);
        this._wakeUpBodiesOnChangedSamples();
        this.changedSamples.clear();
    }

    destroyBody() {
        this.defaultBodyUpdater.destroyBody();
        this.heightField = null;
    }

    dispose() {
        if (this.heightsBufferPointer) Jolt._webidl_free(this.heightsBufferPointer);
        this.heightsBufferPointer = 0;
        this.heightsBufferLength = 0;
    }
}

/** @param {TerrainData} data */
const copyTerrainData = (data) => {
    const copy = new TerrainData(data.resolution);
    copy.copyFrom(data);
    return copy;
};

// Generating a relief or reading an image is long for big terrains, and done
// for every instance and every hot-reload: the results are kept.
const baseDataCache = new Map();
const MAX_CACHED_BASE_DATA = 8;
// Changes of the shape of a terrain kept for consumers of its surface that
// missed some versions: older changes update the whole surface.
const MAX_SURFACE_CHANGES = 64;
// Unique among all terrains: a terrain replaced by another one never has its version.
let lastGroundVersion = 0;

/**
 * The terrain of a Terrain3D object: its data, how it's drawn and its
 * surface (for collisions and navigation meshes). Positions are in the scene.
 */
class Terrain {
    /** @param {gdjs.CustomRuntimeObject3D} object */
    constructor(object) {
        this.object = object;
        /** @type {TerrainData} */
        this.data = new TerrainData(DEFAULT_RESOLUTION);
        /** The data before any sculpting or painting, from the relief or heightmap. */
        this.baseData = this.data;
        this.renderer = new TerrainRenderer(this);
        /** @type {TerrainBodyUpdater[]} */
        this.bodyUpdaters = [];
        this.changedSamples = new SampleRectangle();
        this.hasPaintChanged = false;
        /** Increased each time the ground changes, for objects following it (like grass). */
        this.version = 0;
        /** Increased each time the shape of the ground changes (not its paint or position). */
        this.surfaceVersion = 0;
        /**
         * The last changes of the shape of the ground, for `getChangedArea`.
         * @type {Array<{version: number, samples: SampleRectangle}>}
         */
        this.surfaceChanges = [];
        /** The changes since this version are all in `surfaceChanges`. */
        this.surfaceChangesStartVersion = 0;
        this._stroke = { cellWidth: 1, cellHeight: 1, ax: 0, ay: 0, bx: 0, by: 0, radius: 0 };
        this._strokeChangedSamples = new SampleRectangle();
        /** The properties the data was loaded from, to reload it only if they change. */
        this.loadedFrom = '';
        /** The heightmap image being loaded: the relief is used until it is. */
        this.loadingHeightmapImage = '';
        this.isDisposed = false;
        /** The last value of the sculpt data property read or saved. */
        this.sculptData = '';
        /**
         * Values saved by the editor tools: the editor sends them back with a
         * hot-reload, possibly after newer ones were saved.
         * @type {string[]}
         */
        this.savedSculptData = [];
        /** The heights of the surface: the heights of the data, and NaN in holes. */
        this.surfaceHeights = new Float32Array(0);
        this.loadFromProperties();
        this._transform = this._getTransform();
        getGrounds(object.getRuntimeScene()).add(this);
        /**
         * The shape of the ground, for the physics engine and navigation meshes.
         * @type {gdjs.Surface}
         */
        this.surface = {
            getVersion: () => this.surfaceVersion,
            getChangedArea: (sinceVersion) => this.getChangedArea(sinceVersion),
            getTriangles: () => null,
            getHeightField: () => ({ columns: this.data.size, rows: this.data.size, heights: this.surfaceHeights }),
        };
        if (typeof object.setSurface === 'function') {
            object.setSurface(this.surface);
        } else if (gdjs.Physics3DRuntimeBehavior) {
            // Older GDevelop versions don't use surfaces.
            for (const behavior of object._behaviors) {
                if (behavior instanceof gdjs.Physics3DRuntimeBehavior) {
                    this.bodyUpdaters.push(new TerrainBodyUpdater(this, behavior));
                }
            }
        }
    }

    _getSourceProperties() {
        const { object } = this;
        return [
            object._getResolution(),
            object._getRelief(),
            object._getSeed(),
            object._getHeightmapImage(),
            object._getEdits(),
        ].join('|');
    }

    loadFromProperties() {
        const { object } = this;
        const resolution = parseInt(object._getResolution(), 10);
        const validResolution = RESOLUTIONS.indexOf(resolution) !== -1 ? resolution : DEFAULT_RESOLUTION;
        this.sculptData = object._getSculptData();
        this.loadedFrom = this._getSourceProperties();

        this.baseData = this._getBaseData(validResolution);
        let data = codec.decode(this.sculptData, (resolution) => copyTerrainData(this._getBaseData(resolution)));
        if (data && data.resolution !== validResolution) {
            data = data.resampled(validResolution);
        }
        this.setData(data || copyTerrainData(this.baseData));
    }

    /**
     * @param {number} resolution
     * @returns {TerrainData} The data from the relief or the heightmap, shared: it must not be changed.
     */
    _getBaseData(resolution) {
        const { object } = this;
        const key = [resolution, object._getRelief(), object._getSeed(), object._getHeightmapImage(), object._getEdits()].join('|');
        const cachedData = baseDataCache.get(key);
        if (cachedData) return cachedData;

        const data = new TerrainData(resolution);
        const heightmapImage = object._getHeightmapImage();
        const isHeightmapLoaded =
            !!heightmapImage && loadHeightsFromImage(data, object.getRuntimeScene().getGame(), heightmapImage);
        if (!isHeightmapLoaded) {
            relief.generate(data, object._getRelief(), object._getSeed());
            if (heightmapImage) this._reloadOnceLoaded(heightmapImage);
        }
        edits.apply(data, object._getEdits());
        // Not kept if the image is missing: it may be loaded later.
        if (isHeightmapLoaded || !heightmapImage) baseDataCache.set(key, data);
        if (baseDataCache.size > MAX_CACHED_BASE_DATA) {
            baseDataCache.delete(baseDataCache.keys().next().value);
        }
        return data;
    }

    /** @param {TerrainData} data */
    setData(data) {
        this.version = ++lastGroundVersion;
        this.surfaceVersion = this.version;
        this.surfaceChanges.length = 0;
        this.surfaceChangesStartVersion = this.version;
        const hasSameResolution = data.resolution === this.data.resolution && this.renderer.chunks.length > 0;
        this.data = data;
        const allSamples = new SampleRectangle().set(0, 0, data.resolution, data.resolution);
        this.surfaceHeights = new Float32Array(data.heights.length);
        this.renderer.setHasHoles(false);
        this._updateSurfaceHeights(allSamples);
        if (hasSameResolution) {
            this.renderer.updateSamples(allSamples, true);
        } else {
            this.renderer.rebuild();
        }
        for (const bodyUpdater of this.bodyUpdaters) {
            bodyUpdater.recreateShape();
        }
    }

    onHotReloading() {
        const sculptData = this.object._getSculptData();
        const savedIndex = this.savedSculptData.indexOf(sculptData);
        if (savedIndex !== -1 && this._getSourceProperties() === this.loadedFrom) {
            // The terrain already has this data, or newer changes.
            this.savedSculptData.splice(0, savedIndex + 1);
        } else if (sculptData !== this.sculptData || this._getSourceProperties() !== this.loadedFrom) {
            this.savedSculptData.length = 0;
            this.loadFromProperties();
        }
        this.renderer.updateMaterial();
    }

    /** @returns {string} The data to save in the sculpt data property. */
    save() {
        this.sculptData = codec.encode(this.data, this.baseData);
        this.savedSculptData.push(this.sculptData);
        return this.sculptData;
    }

    getCellWidth() {
        return this.object.getWidth() / this.data.resolution;
    }

    getCellHeight() {
        return this.object.getHeight() / this.data.resolution;
    }

    _toGridX(x) {
        return (x - this.object.getX()) / this.getCellWidth();
    }

    _toGridY(y) {
        return (y - this.object.getY()) / this.getCellHeight();
    }

    /** @returns {number} The Z position of the ground. */
    getHeightAt(x, y) {
        return this.object.getZ() + this.data.sampleHeight(this._toGridX(x), this._toGridY(y)) * this.object.getDepth();
    }

    /** @returns {number} The angle of the ground with the horizontal, in degrees. */
    getSlopeAt(x, y) {
        const gridX = this._toGridX(x);
        const gridY = this._toGridY(y);
        const { data } = this;
        const depth = this.object.getDepth();
        const slopeX = ((data.sampleHeight(gridX + 0.5, gridY) - data.sampleHeight(gridX - 0.5, gridY)) * depth) / this.getCellWidth();
        const slopeY = ((data.sampleHeight(gridX, gridY + 0.5) - data.sampleHeight(gridX, gridY - 0.5)) * depth) / this.getCellHeight();
        return gdjs.toDegrees(Math.atan(Math.hypot(slopeX, slopeY)));
    }

    /** @returns {number} The layer painted the most, from 1 to 4. */
    getLayerAt(x, y) {
        return this.data.getDominantLayer(this._toGridX(x), this._toGridY(y)) + 1;
    }

    /**
     * @param {number} layer From 1 to 4.
     * @returns {number} How much the layer is painted, from 0 to 1.
     */
    getLayerWeightAt(x, y, layer) {
        const layerIndex = clampInteger(layer - 1, 0, LAYER_COUNT - 1);
        return this.data.sampleLayerWeight(this._toGridX(x), this._toGridY(y), layerIndex);
    }

    /** @returns {number[]} The painted tint: red, green and blue, from 0 to 255 (white when there is none). */
    getTintAt(x, y) {
        const gridX = this._toGridX(x);
        const gridY = this._toGridY(y);
        return [0, 1, 2].map((channel) => Math.round(this.data.sampleColor(gridX, gridY, channel) * 255));
    }

    /** @returns {number} How wet the ground is, from 0 (dry) to 1, painted or near the water (see the wet shore). */
    getWetnessAt(x, y) {
        const paintedWetness = this.data.sampleColor(this._toGridX(x), this._toGridY(y), 3);
        const { object } = this;
        if (!object._getWetShore()) return paintedWetness;
        const fade = Math.max(object._getWetShoreFade(), 0.001);
        const shoreWetness = clamp01((object._getWetShoreZ() + fade - this.getHeightAt(x, y)) / fade);
        // Like the smoothstep of the shader.
        return Math.max(paintedWetness, shoreWetness * shoreWetness * (3 - 2 * shoreWetness));
    }

    _isInArea(x, y) {
        const { object } = this;
        return (
            x >= object.getX() &&
            x <= object.getX() + object.getWidth() &&
            y >= object.getY() &&
            y <= object.getY() + object.getHeight()
        );
    }

    /** @returns {boolean} true if the position is above or under the terrain, and not in a hole. */
    containsPoint(x, y) {
        return this._isInArea(x, y) && this.data.sampleSolidity(this._toGridX(x), this._toGridY(y)) >= 0.5;
    }

    /** @returns {boolean} true if there is a hole in the terrain at the position, like what is drawn. */
    isHoleAt(x, y) {
        return this._isInArea(x, y) && this.data.sampleSolidity(this._toGridX(x), this._toGridY(y)) < 0.5;
    }

    _getStroke(x1, y1, x2, y2, radius) {
        const stroke = this._stroke;
        stroke.cellWidth = this.getCellWidth();
        stroke.cellHeight = this.getCellHeight();
        stroke.ax = x1 - this.object.getX();
        stroke.ay = y1 - this.object.getY();
        stroke.bx = x2 - this.object.getX();
        stroke.by = y2 - this.object.getY();
        stroke.radius = Math.max(radius, 0);
        return stroke;
    }

    /**
     * @param {SampleRectangle} samples
     * @param {boolean} haveHeightsChanged false when only the paint changed.
     */
    _onSamplesChanged(samples, haveHeightsChanged) {
        if (samples.isEmpty()) return;
        this.version = ++lastGroundVersion;
        this.changedSamples.add(samples);
        // Painting changes the surface when it makes holes or fills them.
        const hasSurfaceChanged = this._updateSurfaceHeights(samples);
        if (!haveHeightsChanged && !hasSurfaceChanged) return;
        this.surfaceVersion = this.version;
        this.surfaceChanges.push({ version: this.version, samples: new SampleRectangle().set(samples.minI, samples.minJ, samples.maxI, samples.maxJ) });
        if (this.surfaceChanges.length > MAX_SURFACE_CHANGES) {
            this.surfaceChangesStartVersion = this.surfaceChanges.shift().version;
        }
        for (const bodyUpdater of this.bodyUpdaters) {
            bodyUpdater.changedSamples.add(samples);
        }
    }

    /**
     * @param {SampleRectangle} samples
     * @returns {boolean} true if heights of the surface changed, or holes were made or filled.
     */
    _updateSurfaceHeights(samples) {
        const { data, surfaceHeights } = this;
        let hasChanged = false;
        let hasHoles = false;
        for (let j = samples.minJ; j <= samples.maxJ; j++) {
            for (let i = samples.minI; i <= samples.maxI; i++) {
                const index = j * data.size + i;
                const isHole = data.isHole(index);
                const height = isHole ? NaN : data.heights[index];
                const previousHeight = surfaceHeights[index];
                if (isHole) {
                    hasHoles = true;
                    if (Number.isNaN(previousHeight)) continue;
                } else if (height === previousHeight) {
                    continue;
                }
                surfaceHeights[index] = height;
                hasChanged = true;
            }
        }
        // Filled holes keep the shaders drawing holes until the data is loaded again.
        if (hasHoles) this.renderer.setHasHoles(true);
        return hasChanged;
    }

    /** @param {number} height In scene units, negative to lower the ground. */
    raise(x1, y1, x2, y2, radius, height) {
        const samples = this._strokeChangedSamples;
        brushes.raise(this.data, this._getStroke(x1, y1, x2, y2, radius), height / this.object.getDepth(), samples);
        this._onSamplesChanged(samples, true);
    }

    /** @param {number} z The Z position to flatten the ground to. */
    /** @param {number} [toZ] The Z position at the end of the segment, for a slope. The same as z by default. */
    flatten(x1, y1, x2, y2, radius, z, strength, toZ = z) {
        const samples = this._strokeChangedSamples;
        const toHeight = (value) => (value - this.object.getZ()) / this.object.getDepth();
        brushes.flatten(this.data, this._getStroke(x1, y1, x2, y2, radius), toHeight(z), strength, samples, toHeight(toZ));
        this._onSamplesChanged(samples, true);
    }

    smooth(x1, y1, x2, y2, radius, strength) {
        const samples = this._strokeChangedSamples;
        brushes.smooth(this.data, this._getStroke(x1, y1, x2, y2, radius), strength, samples);
        this._onSamplesChanged(samples, true);
    }

    /** @param {number} layer From 1 to 4. */
    paint(x1, y1, x2, y2, radius, layer, strength) {
        const layerIndex = clampInteger(layer - 1, 0, LAYER_COUNT - 1);
        const samples = this._strokeChangedSamples;
        brushes.paint(this.data, this._getStroke(x1, y1, x2, y2, radius), layerIndex, strength, samples);
        this.hasPaintChanged = true;
        this._onSamplesChanged(samples, false);
    }

    /** @param {number[]} color The red, green and blue (0-255) of the tint: white removes it. */
    tint(x1, y1, x2, y2, radius, color, strength) {
        const samples = this._strokeChangedSamples;
        brushes.tint(this.data, this._getStroke(x1, y1, x2, y2, radius), color, strength, samples);
        this.hasPaintChanged = true;
        this._onSamplesChanged(samples, false);
    }

    /** @param {number} wetness From 0 (dry) to 1. */
    wet(x1, y1, x2, y2, radius, wetness, strength) {
        const samples = this._strokeChangedSamples;
        brushes.wet(this.data, this._getStroke(x1, y1, x2, y2, radius), wetness, strength, samples);
        this.hasPaintChanged = true;
        this._onSamplesChanged(samples, false);
    }

    /** Make a hole around a segment (`fillHoles` fills it again). */
    makeHole(x1, y1, x2, y2, radius) {
        const samples = this._strokeChangedSamples;
        brushes.hole(this.data, this._getStroke(x1, y1, x2, y2, radius), samples);
        this.hasPaintChanged = true;
        this._onSamplesChanged(samples, false);
    }

    /** Fill the holes around a segment with the layers of the ground around them. */
    fillHoles(x1, y1, x2, y2, radius) {
        const samples = this._strokeChangedSamples;
        brushes.fill(this.data, this._getStroke(x1, y1, x2, y2, radius), samples);
        this.hasPaintChanged = true;
        this._onSamplesChanged(samples, false);
    }

    /**
     * Make the entrance of a tunnel or a cave: a hole, with the ground in
     * front of it flattened to the floor of the tunnel.
     * @param {number} angle The direction going into the ground, in degrees.
     * @param {number} floorZ
     * @param {number} length The length of the flat ground in front of the entrance.
     */
    carveEntrance(x, y, radius, angle, floorZ, length) {
        const directionX = Math.cos(gdjs.toRad(angle));
        const directionY = Math.sin(gdjs.toRad(angle));
        this.flatten(x - directionX * length, y - directionY * length, x, y, radius * 1.5, floorZ, 1);
        this.makeHole(x, y, x + directionX * radius, y + directionY * radius, radius);
    }

    generate(reliefName, seed) {
        this.baseData = new TerrainData(this.data.resolution);
        relief.generate(this.baseData, reliefName, seed);
        this.setData(copyTerrainData(this.baseData));
    }

    loadHeightmap(imageResourceName) {
        const baseData = new TerrainData(this.data.resolution);
        if (loadHeightsFromImage(baseData, this.object.getRuntimeScene().getGame(), imageResourceName)) {
            baseData.splat.set(this.data.splat);
            baseData.colors.set(this.data.colors);
            this.baseData = baseData;
            this.setData(copyTerrainData(baseData));
        }
    }

    /** @param {gdjs.RuntimeObject[]} objects */
    placeOnGround(objects) {
        for (const object of objects) {
            if (object === this.object || !gdjs.Base3DHandler.is3D(object)) continue;
            const groundZ = this.getHeightAt(object.getCenterXInScene(), object.getCenterYInScene());
            // The origin of the object is not always at its bottom.
            object.setZ(groundZ + object.getZ() - object.getUnrotatedAABBMinZ());
        }
    }

    /**
     * @returns {THREE.Vector3 | null} The point of the ground under the cursor,
     * in the terrain group coordinates. Holes are hit too, so that brushes can fill them.
     */
    raycastFromCursor(game, raycaster, ndc) {
        const layer = this.object.getInstanceContainer().getLayer(this.object.getLayer());
        const camera = layer.getRenderer().getThreeCamera();
        if (!camera) return null;
        const inputManager = game.getInputManager();
        ndc.set(
            (inputManager.getCursorX() / game.getGameResolutionWidth()) * 2 - 1,
            -(inputManager.getCursorY() / game.getGameResolutionHeight()) * 2 + 1
        );
        raycaster.setFromCamera(ndc, camera);
        this.renderer.group.updateWorldMatrix(true, false);
        const ray = raycaster.ray.clone().applyMatrix4(this.renderer.group.matrixWorld.clone().invert());
        ray.direction.normalize();

        const box = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(AREA_SIZE, AREA_SIZE, AREA_DEPTH));
        const entry = box.containsPoint(ray.origin) ? ray.origin.clone() : ray.intersectBox(box, new THREE.Vector3());
        if (!entry) return null;
        const cellSize = AREA_SIZE / this.data.resolution;
        const groundZAt = (point) => this.data.sampleHeight(point.x / cellSize, point.y / cellSize) * AREA_DEPTH;
        const step = cellSize / 2;
        const point = entry.clone();
        const previousPoint = entry.clone();
        for (let distance = 0; distance < AREA_SIZE * 2; distance += step) {
            if (point.z <= groundZAt(point)) {
                // Refine between the last point above the ground and this one.
                for (let iteration = 0; iteration < 8; iteration++) {
                    const middle = previousPoint.clone().lerp(point, 0.5);
                    if (middle.z <= groundZAt(middle)) point.copy(middle);
                    else previousPoint.copy(middle);
                }
                return point;
            }
            if (!box.containsPoint(point)) return null;
            previousPoint.copy(point);
            point.addScaledVector(ray.direction, step);
        }
        return null;
    }

    /**
     * @param {THREE.Vector3} localPosition In the terrain group coordinates (like from `raycastFromCursor`).
     * @returns {{x: number, y: number, z: number}} The position in the scene.
     */
    toScenePosition(localPosition) {
        const { object } = this;
        return {
            x: object.getX() + (localPosition.x / AREA_SIZE) * object.getWidth(),
            y: object.getY() + (localPosition.y / AREA_SIZE) * object.getHeight(),
            z: object.getZ() + (localPosition.z / AREA_DEPTH) * object.getDepth(),
        };
    }

    /** Draw the changes of the ground (collisions are updated by the physics engine). */
    applyChanges() {
        this.renderer.updateSamples(this.changedSamples, this.hasPaintChanged);
        this.changedSamples.clear();
        this.hasPaintChanged = false;
    }

    /** @returns {number} A number changing each time the ground changes (see `getGrounds`). */
    getVersion() {
        return this.version;
    }

    /**
     * @param {number} sinceVersion
     * @returns {gdjs.SurfaceArea | null} The part of the ground whose shape changed since the version (see `gdjs.Surface`).
     */
    getChangedArea(sinceVersion) {
        if (sinceVersion < this.surfaceChangesStartVersion) return null;
        const samples = new SampleRectangle();
        for (const change of this.surfaceChanges) {
            if (change.version > sinceVersion) samples.add(change.samples);
        }
        if (samples.isEmpty()) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        const { resolution } = this.data;
        return {
            minX: samples.minI / resolution,
            minY: samples.minJ / resolution,
            maxX: samples.maxI / resolution,
            maxY: samples.maxJ / resolution,
        };
    }

    _getTransform() {
        const { object } = this;
        return [object.getX(), object.getY(), object.getZ(), object.getWidth(), object.getHeight(), object.getDepth()].join(',');
    }

    /** @param {string} imageResourceName A heightmap image that is not loaded yet. */
    _reloadOnceLoaded(imageResourceName) {
        if (this.loadingHeightmapImage === imageResourceName) return;
        this.loadingHeightmapImage = imageResourceName;
        const game = this.object.getRuntimeScene().getGame();
        game.getImageManager()
            .loadResource(imageResourceName)
            .then(() => {
                if (this.isDisposed || this.loadingHeightmapImage !== imageResourceName) return;
                this.loadingHeightmapImage = '';
                if (getLoadedImage(game, imageResourceName)) this.loadFromProperties();
            })
            .catch(() => {});
    }

    update() {
        const transform = this._getTransform();
        if (transform !== this._transform) {
            this._transform = transform;
            this.version = ++lastGroundVersion;
        }
        this.applyChanges();
        this.renderer.uniforms.terrainWorldScale.value = getWorldScale(this.object);
        this._updateWetShore();
        const layer = this.object.getInstanceContainer().getLayer(this.object.getLayer());
        this.renderer.updateLevelsOfDetail(layer.getRenderer().getThreeCamera());
    }

    _updateWetShore() {
        const { object } = this;
        // In the coordinates of the terrain group, like the vertices.
        const depthScale = AREA_DEPTH / Math.max(object.getDepth(), 0.0001);
        this.renderer.uniforms.terrainWetShore.value.set(
            (object._getWetShoreZ() - object.getZ()) * depthScale,
            Math.max(object._getWetShoreFade(), 0.001) * depthScale,
            object._getWetShore() ? 1 : 0
        );
    }

    dispose() {
        this.isDisposed = true;
        getGrounds(this.object.getRuntimeScene()).delete(this);
        if (typeof this.object.setSurface === 'function' && this.object.getSurface() === this.surface) {
            this.object.setSurface(null);
        }
        this.renderer.dispose();
        for (const bodyUpdater of this.bodyUpdaters) {
            bodyUpdater.dispose();
        }
    }
}

/**
 * @param {gdjs.RuntimeObject} object
 * @returns {number} The number of scene units by 3D world unit (1 in GDevelop versions before the world scale).
 */
const getWorldScale = (object) => {
    const scene = object.getRuntimeScene();
    return typeof scene.getRenderer3DWorldScale === 'function' ? scene.getRenderer3DWorldScale() : 1;
};

const averageColors = new WeakMap();
let white = null;
/**
 * @param {THREE.Texture} texture
 * @returns {THREE.Color} The average color of the texture (white when it's not loaded).
 */
const getAverageColor = (texture) => {
    const cachedColor = averageColors.get(texture);
    if (cachedColor) return cachedColor;
    const image = texture.image;
    const isDrawable =
        typeof document !== 'undefined' &&
        ((image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0) ||
            image instanceof HTMLCanvasElement ||
            (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap));
    if (!isDrawable) return white || (white = new THREE.Color(1, 1, 1));
    const size = 8;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, size, size);
    const pixels = context.getImageData(0, 0, size, size).data;
    let red = 0;
    let green = 0;
    let blue = 0;
    for (let index = 0; index < pixels.length; index += 4) {
        red += pixels[index];
        green += pixels[index + 1];
        blue += pixels[index + 2];
    }
    const count = size * size * 255;
    const color = new THREE.Color().setRGB(red / count, green / count, blue / count, THREE.SRGBColorSpace);
    averageColors.set(texture, color);
    return color;
};

const svgIcon = (content) =>
    'data:image/svg+xml,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' + content + '</svg>');
const strokes = 'fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const toolIcons = {
    Raise: svgIcon('<path ' + strokes + ' d="M3 20h18M6 20c2-6 4-9 6-9s4 3 6 9M12 3v5M9 5l3-3 3 3"/>'),
    Lower: svgIcon('<path ' + strokes + ' d="M3 12h4c2 6 3 8 5 8s3-2 5-8h4M12 2v6M9 5l3 3 3-3"/>'),
    Smooth: svgIcon('<path ' + strokes + ' d="M3 15c3-6 6 2 9-3s6 3 9-3M3 20h18"/>'),
    Flatten: svgIcon('<path ' + strokes + ' d="M3 14h18M3 20h18M8 9V4M16 9V4M5 7l3 2 3-2M13 7l3 2 3-2"/>'),
    Size: svgIcon('<circle ' + strokes + ' cx="12" cy="12" r="9"/><circle ' + strokes + ' cx="12" cy="12" r="4"/>'),
    Strength: svgIcon('<path ' + strokes + ' d="M5 20v-3M10 20v-7M15 20v-11M20 20V4"/>'),
    Undo: svgIcon('<path ' + strokes + ' d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"/>'),
    Hole: svgIcon('<ellipse ' + strokes + ' cx="12" cy="16" rx="9" ry="4"/><path ' + strokes + ' d="M12 3v9M9 9l3 3 3-3"/>'),
    FillHoles: svgIcon('<ellipse ' + strokes + ' cx="12" cy="16" rx="9" ry="4"/><path ' + strokes + ' d="M12 12V3M9 6l3-3 3 3"/>'),
    Wetness: svgIcon('<path ' + strokes + ' d="M12 3c-3 5-6 8-6 11a6 6 0 0 0 12 0c0-3-3-6-6-11z"/><path ' + strokes + ' d="M9 15a3 3 0 0 0 3 3"/>'),
};
// Tints for the color brush when the editor has no color picker (older GDevelop versions).
const tintPresets = ['#e2c879', '#a5c45a', '#8a6a48', '#c98a62', '#9a9a92', '#ffffff'];

/**
 * The sculpt and paint tools shown in the scene editor when a terrain is
 * selected. Without the needed editor functions (older GDevelop versions),
 * nothing is shown: the terrain can still be changed with events.
 */
class TerrainEditorTools {
    constructor() {
        /** '' when no brush is used. */
        this.toolName = '';
        this.sizePercent = 30;
        this.strengthPercent = 50;
        /** @type {Terrain | null} */
        this.terrain = null;
        /** @type {gdjs.InGameEditor | null} */
        this.editor = null;
        this.isStroking = false;
        this.flattenHeight = 0;
        /** The color of the "Tint" brush, as "#rrggbb". */
        this.tintColor = tintPresets[0];
        this.wetnessPercent = 100;
        this.lastStrokeTime = 0;
        /** @type {{data: TerrainData, baseData: TerrainData}[]} */
        this.undoSteps = [];
        this.raycaster = new THREE.Raycaster();
        this.ndc = new THREE.Vector2();
        this._swatchColor = new THREE.Color();
    }

    /** @param {gdjs.InGameEditor} editor */
    update(editor) {
        if (typeof editor.showToolbar !== 'function') {
            // Older GDevelop versions: the terrain can only be changed with events.
            return;
        }
        this.editor = editor;
        const selectedObjects = editor.getSelectedObjects();
        const terrain =
            selectedObjects.length === 1 && selectedObjects[0].__terrain3D ? selectedObjects[0].__terrain3D : null;
        if (terrain !== this.terrain) {
            this._endStroke();
            if (this.terrain) this.terrain.renderer.setBrush(null, 0);
            this.terrain = terrain;
            this.undoSteps.length = 0;
        }
        if (terrain) editor.showToolbar('Terrain3D', this._getToolbarItems(terrain));
        const game = editor.getRuntimeGame();
        if (!terrain || !this.toolName) {
            if (terrain) terrain.renderer.setBrush(null, 0);
            return;
        }

        const inputManager = game.getInputManager();
        if (inputManager.wasKeyJustPressed(gdjs.evtTools.input.keysNameToCode.Escape)) {
            this._endStroke();
            this.toolName = '';
            terrain.renderer.setBrush(null, 0);
            return;
        }
        editor.captureLeftMouseButton();
        const hit = terrain.raycastFromCursor(game, this.raycaster, this.ndc);
        const radius = this._getRadius();
        terrain.renderer.setBrush(hit, radius);

        // Older GDevelop versions don't have it.
        const isPressedForTool =
            typeof editor.isCapturedLeftMouseButtonPressed === 'function'
                ? editor.isCapturedLeftMouseButtonPressed()
                : inputManager.isMouseButtonPressed(0);
        // The button is released outside the canvas when the mouse is on a toolbar.
        const isPressed = isPressedForTool && inputManager.isMouseInsideCanvas();
        if (isPressed && hit && !this.isStroking) {
            this._startStroke(terrain, hit);
        }
        if (this.isStroking && isPressed && hit) {
            this._applyBrush(terrain, hit, radius);
        }
        if (!isPressed) {
            this._endStroke();
        }
    }

    _getRadius() {
        const { object } = this.terrain;
        const maxRadius = Math.max(object.getWidth(), object.getHeight()) / 4;
        return Math.max(maxRadius * Math.pow(this.sizePercent / 100, 2), this.terrain.getCellWidth());
    }

    _startStroke(terrain, hit) {
        this.isStroking = true;
        this.lastStrokeTime = performance.now();
        this.flattenHeight = terrain.toScenePosition(hit).z;
        this.undoSteps.push({ data: copyTerrainData(terrain.data), baseData: terrain.baseData });
        const maxUndoSteps = Math.max(Math.floor(UNDO_STEPS_SAMPLES / terrain.data.heights.length), 2);
        while (this.undoSteps.length > maxUndoSteps) this.undoSteps.shift();
    }

    _endStroke() {
        if (!this.isStroking) return;
        this.isStroking = false;
        this._save();
    }

    _applyBrush(terrain, hit, radius) {
        const now = performance.now();
        const elapsedSeconds = Math.min((now - this.lastStrokeTime) / 1000, 0.1);
        this.lastStrokeTime = now;
        const { x, y } = terrain.toScenePosition(hit);
        const amount = (this.strengthPercent / 100) * elapsedSeconds;
        const depth = terrain.object.getDepth();
        if (this.toolName === 'Raise') terrain.raise(x, y, x, y, radius, amount * depth * 0.5);
        else if (this.toolName === 'Lower') terrain.raise(x, y, x, y, radius, -amount * depth * 0.5);
        else if (this.toolName === 'Smooth') terrain.smooth(x, y, x, y, radius, amount * 10);
        else if (this.toolName === 'Flatten') terrain.flatten(x, y, x, y, radius, this.flattenHeight, amount * 10);
        else if (this.toolName.startsWith('Paint')) {
            terrain.paint(x, y, x, y, radius, parseInt(this.toolName.slice(5), 10), amount * 8);
        } else if (this.toolName === 'Hole') {
            terrain.makeHole(x, y, x, y, radius);
        } else if (this.toolName === 'FillHoles') {
            terrain.fillHoles(x, y, x, y, radius);
        } else if (this.toolName === 'Tint') {
            terrain.tint(x, y, x, y, radius, gdjs.rgbOrHexToRGBColor(this.tintColor), amount * 8);
        } else if (this.toolName === 'Wetness') {
            terrain.wet(x, y, x, y, radius, this.wetnessPercent / 100, amount * 8);
        }
        // Drawn now, as the terrain was updated earlier in this frame.
        terrain.applyChanges();
    }

    _save() {
        const { terrain, editor } = this;
        if (!terrain || !editor) return;
        editor.updateObjectProperties(terrain.object.getName(), { SculptData: terrain.save() });
    }

    _undo() {
        const undoStep = this.undoSteps.pop();
        // The relief, the edits or the resolution may have changed since the stroke.
        if (!this.terrain || !undoStep || undoStep.baseData !== this.terrain.baseData) {
            this.undoSteps.length = 0;
            return;
        }
        this.terrain.setData(undoStep.data);
        this._save();
    }

    /** @returns {Array<gdjs.InGameEditorToolbarItem>} The settings of the tint or wetness brush, when it's used. */
    _getColorToolItems() {
        const { editor } = this;
        if (this.toolName === 'Tint') {
            if (editor && typeof editor.isToolbarItemTypeSupported === 'function' && editor.isToolbarItemTypeSupported('color')) {
                return [
                    {
                        type: 'color',
                        id: 'TintColor',
                        tooltip: 'Color of the tint',
                        value: this.tintColor,
                        onChange: (color) => (this.tintColor = color),
                    },
                ];
            }
            return tintPresets.map((color) => ({
                type: 'button',
                id: 'TintPreset' + color,
                tooltip: color === '#ffffff' ? 'No tint' : 'Tint with this color',
                color,
                isActive: this.tintColor === color,
                onClick: () => (this.tintColor = color),
            }));
        }
        if (this.toolName === 'Wetness') {
            return [
                {
                    type: 'slider',
                    id: 'WetnessAmount',
                    tooltip: 'Wetness',
                    iconUrl: toolIcons.Wetness,
                    min: 0,
                    max: 100,
                    value: this.wetnessPercent,
                    onChange: (value) => (this.wetnessPercent = value),
                },
            ];
        }
        return [];
    }

    /**
     * @param {Terrain} terrain
     * @returns {Array<gdjs.InGameEditorToolbarItem>} The toolbar for the current state (the editor only
     * updates what changed).
     */
    _getToolbarItems(terrain) {
        const { object } = terrain;
        const toolButton = (toolName, tooltip, color) => ({
            type: 'button',
            id: toolName,
            tooltip,
            iconUrl: toolIcons[toolName],
            color,
            isActive: this.toolName === toolName,
            onClick: () => (this.toolName = this.toolName === toolName ? '' : toolName),
        });
        const layerColors = [object._getLayer1Color(), object._getLayer2Color(), object._getLayer3Color(), object._getLayer4Color()];
        // Layers are shown with their color, tinting their texture.
        const swatchColors = layerColors.map((color, index) =>
            this._swatchColor
                .set(gdjs.rgbOrHexStringToNumber(color))
                .multiply(getAverageColor(terrain.renderer.uniforms['terrainLayerMap' + index].value))
                .getHexString()
        );
        return [
            toolButton('Raise', 'Raise the ground (drag on the terrain)'),
            toolButton('Lower', 'Lower the ground'),
            toolButton('Smooth', 'Smooth the ground'),
            toolButton('Flatten', 'Flatten the ground to the height where the drag starts'),
            { type: 'divider', id: 'PaintDivider' },
            ...swatchColors.map((swatchColor, index) =>
                toolButton('Paint' + (index + 1), 'Paint layer ' + (index + 1), '#' + swatchColor)
            ),
            toolButton('Hole', 'Make a hole, for the entrance of a tunnel or a cave'),
            toolButton('FillHoles', 'Fill holes, with the layers of the ground around them'),
            { type: 'divider', id: 'ColorDivider' },
            toolButton('Tint', 'Tint the ground (white removes the tint)', this.tintColor),
            toolButton('Wetness', 'Make the ground wet, or dry with a wetness of 0'),
            ...this._getColorToolItems(),
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
            { type: 'button', id: 'Undo', tooltip: 'Undo the last stroke on this terrain', iconUrl: toolIcons.Undo, onClick: () => this._undo() },
        ];
    }
}

const editorTools = new TerrainEditorTools();
if (gdjs.registerInGameEditorPostStepCallback) {
    gdjs.registerInGameEditorPostStepCallback((editor) => editorTools.update(editor));
}

gdjs.__terrain3DExtension = {
    Terrain,
    // Used by the terrain grass and the scattered models.
    getWorldScale,
    getGrounds,
    patchShaderCode,
    createRandom,
    findHighestGround,
    GroundPlacement,
    svgIcon,
    toolIcons,
    // Exposed for tests.
    TerrainBodyUpdater,
    TerrainData,
    SampleRectangle,
    brushes,
    edits,
    codec,
    relief,
};
};
gdjs.evtsExt__Terrain3D__DefineHelperClasses.eventsList0 = function(runtimeScene, eventsFunctionContext) {

{


gdjs.evtsExt__Terrain3D__DefineHelperClasses.userFunc0xd0e4e0(runtimeScene, eventsFunctionContext);

}


};

gdjs.evtsExt__Terrain3D__DefineHelperClasses.func = function(runtimeScene, parentEventsFunctionContext) {
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


gdjs.evtsExt__Terrain3D__DefineHelperClasses.eventsList0(runtimeScene, eventsFunctionContext);


return;
}

gdjs.evtsExt__Terrain3D__DefineHelperClasses.registeredGdjsCallbacks = [];