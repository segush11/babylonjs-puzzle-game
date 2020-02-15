import * as BABYLON from 'babylonjs';
import { AbstractMesh } from 'babylonjs';

const COLORS = [
    BABYLON.Color4.FromHexString('#0066FFFF'),
    BABYLON.Color4.FromHexString('#33CC00FF'),
    BABYLON.Color4.FromHexString('#FF0000FF'),
    BABYLON.Color4.FromHexString('#FF9900FF'),
    BABYLON.Color4.FromHexString('#FFFFFFFF'),
    BABYLON.Color4.FromHexString('#FFFF66FF')
];

export class Cube {
    cubies: Array<AbstractMesh> = [];

    constructor(scene: BABYLON.Scene, size: number) {
        const offset = (size - 1) * 0.5;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                for (let k = 0; k < size; k++) {
                    const x = i - offset;
                    const y = j - offset;
                    const z = k - offset;

                    const cubie = BABYLON.MeshBuilder.CreateBox("cubie", { faceColors: COLORS }, scene);
                    cubie.position = new BABYLON.Vector3(x, y, z);
                    cubie.enableEdgesRendering();
                    cubie.edgesColor = BABYLON.Color3.Black().toColor4();

                    this.cubies.push(cubie);
                }
            }
        }
    }
}