import * as BABYLON from 'babylonjs';
import { Cube } from './Cube';

export class Game {
    private canvas: HTMLCanvasElement;

    private engine: BABYLON.Engine;

    private scene!: BABYLON.Scene;

    private cube!: Cube;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(
            this.canvas, true, { preserveDrawingBuffer: true, stencil: true }, true
        );
    }

    createScene(): void {
        this.scene = new BABYLON.Scene(this.engine);

        const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), this.scene);
        camera.setPosition(new BABYLON.Vector3(5, 5, -5));
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this.canvas, true);
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 10;

        const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 2;
        light.setDirectionToTarget(BABYLON.Vector3.Zero());

        this.cube = new Cube(this.scene);
    }

    doRender(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}