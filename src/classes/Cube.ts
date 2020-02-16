import * as BABYLON from 'babylonjs';
import { Cubie } from './Cubie';

enum AxisName { X = 'x', Y = 'y', Z = 'z' };

const AXIS = {
    [AxisName.X]: BABYLON.Axis.X,
    [AxisName.Y]: BABYLON.Axis.Y,
    [AxisName.Z]: BABYLON.Axis.Z
};

export class Cube {
    center: BABYLON.Vector3 = BABYLON.Vector3.Zero();

    cubies: Array<Cubie> = [];

    constructor(scene: BABYLON.Scene) {
        const cubieMaterial = new BABYLON.StandardMaterial('material', scene);
        cubieMaterial.diffuseTexture = new BABYLON.Texture(
            'https://dl.dropbox.com/s/gzmav3qcq6mpowz/rubiks-cube-diffuse.png',
            scene
        );
        cubieMaterial.specularTexture = new BABYLON.Texture(
            'https://dl.dropbox.com/s/5ybdpwe93te66qj/rubiks-cube-specular.png',
            scene
        );

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cubie = new Cubie(scene, cubieMaterial);
                    cubie.holder.position = new BABYLON.Vector3(x, y, z);
                    this.cubies.push(cubie);
                }
            }
        }
    }

    rotate(axisName: AxisName, isClockwise: boolean, options: { layersCount: number; layer?: number }): void {
        const { layersCount, layer = null } = options;
        const axis = isClockwise ? AXIS[axisName] : AXIS[axisName].negate();
        let cubies: Array<Cubie> = [];

        if (layersCount === 3) {
            cubies = this.cubies;
        } else if (layersCount === 2 && layer !== null) {
            const ignorePosition = layer === 1 ? 1 : -1;
            cubies = this.cubies.filter(cubie => cubie.holder.position[axisName] !== ignorePosition);
        } else if (layersCount === 1 && layer !== null) {
            const startPosition = layer - 2;
            cubies = this.cubies.filter(cubie => cubie.holder.position[axisName] === startPosition);
        }

        for (let cubie of cubies) cubie.holder.rotateAround(this.center, axis, Math.PI / 2);
    }

    applyRotationRule(r: string) {
        const normalizedRule = r.toLowerCase();
        const layersCount = normalizedRule === r ? 2 : 1;
        const rule = normalizedRule.replace('\'', '');
        const isClockwise = rule === normalizedRule;

        switch (rule) {
            case 'u': this.rotate(AxisName.Y, isClockwise, { layersCount, layer: 3 }); return;
            case 'l': this.rotate(AxisName.X, !isClockwise, { layersCount, layer: 1 }); return;
            case 'f': this.rotate(AxisName.Z, !isClockwise, { layersCount, layer: 1 }); return;
            case 'r': this.rotate(AxisName.X, isClockwise, { layersCount, layer: 3 }); return;
            case 'b': this.rotate(AxisName.Z, isClockwise, { layersCount, layer: 3 }); return;
            case 'd': this.rotate(AxisName.Y, !isClockwise, { layersCount, layer: 1 }); return;

            case 'm': this.rotate(AxisName.X, !isClockwise, { layersCount: 1, layer: 2 }); return;
            case 'e': this.rotate(AxisName.Y, !isClockwise, { layersCount: 1, layer: 2 }); return;
            case 's': this.rotate(AxisName.Z, !isClockwise, { layersCount: 1, layer: 2 }); return;

            case 'x': this.rotate(AxisName.X, isClockwise, { layersCount: 3 }); return;
            case 'y': this.rotate(AxisName.Y, isClockwise, { layersCount: 3 }); return;
            case 'z': this.rotate(AxisName.Z, !isClockwise, { layersCount: 3 }); return;

            default: return;
        }
    }
}