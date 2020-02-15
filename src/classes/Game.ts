import * as BABYLON from 'babylonjs';
import { Cube } from './Cube';

export class Game {
    public canvas: HTMLCanvasElement;

    public engine: BABYLON.Engine;

    public scene: BABYLON.Scene;

    public cube: Cube;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.debugLayer.show();

        this.engine.runRenderLoop(this.render.bind(this));

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

    render(): void {
        this.scene.render();
    }

    resize(): void {
        this.engine.resize();
    }
}