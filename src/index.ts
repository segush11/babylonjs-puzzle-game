import { Game } from './classes/Game';

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('root') as HTMLCanvasElement;
    const game = new Game(canvas);

    window.addEventListener('resize', function () {
        game.resize();
    });
});

