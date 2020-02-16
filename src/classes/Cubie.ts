import * as BABYLON from 'babylonjs';

export class Cubie {
    public holder: BABYLON.AbstractMesh;

    public faces: BABYLON.AbstractMesh[] = [];

    private static getPosition(faceIndex: number): BABYLON.Vector3 {
        switch (faceIndex) {
            case 0: return new BABYLON.Vector3(0, 0, 0.5);
            case 1: return new BABYLON.Vector3(0, 0, -0.5);
            case 2: return new BABYLON.Vector3(0.5, 0, 0);
            case 3: return new BABYLON.Vector3(-0.5, 0, 0);
            case 4: return new BABYLON.Vector3(0, 0.5, 0);
            case 5: return new BABYLON.Vector3(0, -0.5, 0);
            default: throw new Error(`face index ${faceIndex} is not correct`);
        }
    }

    private static getRotation(faceIndex: number): BABYLON.Vector3 {
        switch (faceIndex) {
            case 0: return new BABYLON.Vector3(0, Math.PI, 0);
            case 1: return new BABYLON.Vector3(0, 0, 0);
            case 2: return new BABYLON.Vector3(0, -Math.PI / 2, 0);
            case 3: return new BABYLON.Vector3(0, Math.PI / 2, 0);
            case 4: return new BABYLON.Vector3(Math.PI / 2, 0, 0);
            case 5: return new BABYLON.Vector3(-Math.PI / 2, 0, 0);
            default: throw new Error(`face index ${faceIndex} is not correct`);
        }
    }

    private static getColor(faceIndex: number): BABYLON.Color3 {
        switch (faceIndex) {
            case 0: return BABYLON.Color3.FromHexString('#0066FF');
            case 1: return BABYLON.Color3.FromHexString('#33CC00');
            case 2: return BABYLON.Color3.FromHexString('#FF0000');
            case 3: return BABYLON.Color3.FromHexString('#FF9900');
            case 4: return BABYLON.Color3.FromHexString('#FFFFFF');
            case 5: return BABYLON.Color3.FromHexString('#FFFF66');
            default: throw new Error(`face index ${faceIndex} is not correct`);
        }
    }

    constructor(scene: BABYLON.Scene, cubieMaterial: BABYLON.StandardMaterial, coloredFaces: number[]) {
        this.holder = BABYLON.Mesh.CreateBox('cubie', 0.1, scene, true);
        this.holder.isPickable = false;
        this.holder.isVisible = false;

        for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
            const material = cubieMaterial.clone('material');
            material.diffuseColor = coloredFaces.includes(faceIndex)
                ? Cubie.getColor(faceIndex)
                : BABYLON.Color3.Black();

            const face = BABYLON.Mesh.CreatePlane('face', 1.0, scene, true);
            face.parent = this.holder;
            face.material = material;
            face.position = Cubie.getPosition(faceIndex);
            face.rotation = Cubie.getRotation(faceIndex);

            this.faces.push(face);
        }
    }
}
