import * as BABYLON from 'babylonjs';

enum AxisName { X = 'x', Y = 'y', Z = 'z' };

const COLORS = [
    BABYLON.Color4.FromHexString('#0066FFFF'),
    BABYLON.Color4.FromHexString('#33CC00FF'),
    BABYLON.Color4.FromHexString('#FF0000FF'),
    BABYLON.Color4.FromHexString('#FF9900FF'),
    BABYLON.Color4.FromHexString('#FFFFFFFF'),
    BABYLON.Color4.FromHexString('#FFFF66FF')
];

const AXIS = {
    [AxisName.X]: BABYLON.Axis.X,
    [AxisName.Y]: BABYLON.Axis.Y,
    [AxisName.Z]: BABYLON.Axis.Z
};

export class Cube {
    center: BABYLON.Vector3 = BABYLON.Vector3.Zero();

    boxes: Array<BABYLON.AbstractMesh> = [];

    constructor(scene: BABYLON.Scene) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const box = BABYLON.MeshBuilder.CreateBox("box", { faceColors: COLORS }, scene);
                    box.position = new BABYLON.Vector3(x, y, z);
                    box.enableEdgesRendering();
                    box.edgesColor = BABYLON.Color3.Black().toColor4();
                    this.boxes.push(box);
                }
            }
        }
    }

    rotate(axisName: AxisName, isClockwise: boolean, options: { layersCount: number; layer?: number }): void {
        const { layersCount, layer = null } = options;
        const axis = isClockwise ? AXIS[axisName] : AXIS[axisName].negate();
        let boxes: Array<BABYLON.AbstractMesh> = [];

        if (layersCount === 3) {
            boxes = this.boxes;
        } else if (layersCount === 2 && layer !== null) {
            const ignorePosition = layer === 1 ? 1 : -1;
            boxes = this.boxes.filter(box => box.position[axisName] !== ignorePosition);
        } else if (layersCount === 1 && layer !== null) {
            const startPosition = layer - 2;
            boxes = this.boxes.filter(box => box.position[axisName] === startPosition);
        }

        for (let box of boxes) box.rotateAround(this.center, axis, Math.PI / 2);
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