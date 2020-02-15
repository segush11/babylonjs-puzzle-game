import { Game } from './classes/Game';

let game: Game;

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('root') as HTMLCanvasElement;
    game = new Game(canvas);

    window.addEventListener('resize', function () {
        game.resize();
    });
});

