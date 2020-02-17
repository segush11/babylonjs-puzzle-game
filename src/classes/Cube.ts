import * as BABYLON from 'babylonjs';
import { Cubie } from './Cubie';
import { Animator } from "./Animator";

enum AxisName { X = 'x', Y = 'y', Z = 'z' }

export class Cube {
    cubies: Array<Cubie> = [];

    pivot: BABYLON.TransformNode;

    holder: BABYLON.TransformNode;

    animator: Animator = new Animator();

    constructor(scene: BABYLON.Scene) {
        this.holder = new BABYLON.TransformNode('cube', scene);
        this.holder.position.set(0, 0, 0);

        this.pivot = new BABYLON.TransformNode('pivot', scene);
        this.pivot.position.set(0, 0, 0);

        const cubieMaterial = new BABYLON.StandardMaterial('cubie-material', scene);
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
                    const coloredFaces = [];

                    if (z === 1) coloredFaces.push(0);
                    if (z === -1) coloredFaces.push(1);
                    if (x === 1) coloredFaces.push(2);
                    if (x === -1) coloredFaces.push(3);
                    if (y === 1) coloredFaces.push(4);
                    if (y === -1) coloredFaces.push(5);

                    const cubie = new Cubie(scene, cubieMaterial, coloredFaces);
                    cubie.holder.position = new BABYLON.Vector3(x, y, z);
                    cubie.holder.parent = this.holder;
                    this.cubies.push(cubie);
                }
            }
        }
    }

    rotate(axisName: AxisName, isClockwise: boolean, layersCount: number, layer?: number): Promise<void> {
        let cubies: Array<Cubie> = [];

        if (layersCount === 3) {
            cubies = this.cubies;
        } else if (layersCount === 2 && !!layer) {
            const ignorePosition = layer === 1 ? 1 : -1;
            cubies = this.cubies.filter(cubie => cubie.holder.position[axisName] !== ignorePosition);
        } else if (layersCount === 1 && layer) {
            const startPosition = layer - 2;
            cubies = this.cubies.filter(cubie => cubie.holder.position[axisName] === startPosition);
        }

        if (cubies.length === 0) return Promise.resolve();

        for (let cubie of cubies) cubie.holder.setParent(this.pivot);

        return this.animator.createAnimation({
            duration: 1000,
            from: 0,
            to: isClockwise ? Math.PI / 2 : -Math.PI / 2,
            mesh: this.pivot,
            property: `rotation.${axisName}`
        }).then(() => {
            for (let cubie of cubies) {
                cubie.holder.setParent(this.holder);
                /**
                 * It is necessary to round the coordinates
                 * after rotation to get rid of the inaccuracy
                 *
                 * https://forum.babylonjs.com/t/how-to-fix-coordinates-after-rotation/8612/5
                 */
                cubie.holder.position.x = Math.round(cubie.holder.position.x);
                cubie.holder.position.y = Math.round(cubie.holder.position.y);
                cubie.holder.position.z = Math.round(cubie.holder.position.z);
            }
            this.pivot.rotation = BABYLON.Vector3.Zero();
        });
    }

    createRotationRule(r: string): () => Promise<void> {
        return () => {
            const normalizedRule = r.toLowerCase();
            const layersCount = normalizedRule === r ? 2 : 1;
            const rule = normalizedRule.replace('\'', '');
            const isClockwise = rule === normalizedRule;

            switch (rule) {
                case 'u': return this.rotate(AxisName.Y, isClockwise, layersCount, 3);
                case 'l': return this.rotate(AxisName.X, !isClockwise, layersCount, 1);
                case 'f': return this.rotate(AxisName.Z, !isClockwise, layersCount, 1);
                case 'r': return this.rotate(AxisName.X, isClockwise, layersCount, 3);
                case 'b': return this.rotate(AxisName.Z, isClockwise, layersCount, 3);
                case 'd': return this.rotate(AxisName.Y, !isClockwise, layersCount, 1);

                case 'm': return this.rotate(AxisName.X, !isClockwise, 1, 2);
                case 'e': return this.rotate(AxisName.Y, !isClockwise, 1, 2);
                case 's': return this.rotate(AxisName.Z, !isClockwise, 1, 2);

                case 'x': return this.rotate(AxisName.X, isClockwise, 3);
                case 'y': return this.rotate(AxisName.Y, isClockwise, 3);
                case 'z': return this.rotate(AxisName.Z, !isClockwise, 3);

                default: throw new Error(`the rule ${r} is not incorrectly`);
            }
        };
    }

    // TODO: save rotation history
    shuffle() {
        const rulesDictionary: string[] = ['u', 'l', 'f', 'r', 'b', 'd', 'm', 'e', 's'];
        const randomRange = (min: number, max: number) => Math.floor(BABYLON.Scalar.RandomRange(min, max));

        const randomRules: string[] = [];
        for (let i = 0; i < randomRange(10, 20); i++) {
            const rule = rulesDictionary[randomRange(0, rulesDictionary.length)];
            const counterClockwiseMark = randomRange(0, 1) ? '\'' : '';

            randomRules.push(`${rule}${counterClockwiseMark}`);
        }

        randomRules
            .map(rule => this.createRotationRule(rule))
            .reduce((prev, curr) => prev.then(curr), Promise.resolve());
    }
}
