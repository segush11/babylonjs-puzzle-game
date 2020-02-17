import * as BABYLON from 'babylonjs';

export class Animator {
    private fps = 60;

    createAnimation(props: {
        mesh: BABYLON.TransformNode; property: string; from: number; to: number; duration: number;
    }): Promise<void> {
        const { mesh, property, from, to, duration } = props;
        const frames = duration / this.fps;
        const easing = undefined;

        return new Promise(resolve => {
            BABYLON.Animation.CreateAndStartAnimation(
                'animation', mesh, property, this.fps, frames, from, to, 0, easing, () => resolve()
            );
        })
    }
}