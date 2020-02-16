import { Game } from './classes/Game';

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('root') as HTMLCanvasElement;
    const game = (window as any).game = new Game(canvas);

    game.createScene();
    game.doRender();
});

