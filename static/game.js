document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/board')
        // .then
        .catch(error => console.error(error))
        
    // im gonna be honest i completely forgot how to transfer variables from python to js
    // change this if u want ig
    const assetPaths = {
        // Objects
        'player': '/static/players/player.svg',
        'crate': '/static/boxes/crate.svg',
        'ice': '/static/boxes/ice.svg',
        'multipush': '/static/boxes/multipush.svg',
        // Floor
        'floor': '/static/floor/floor.svg',
        'target': '/static/floor/target.svg',
        'winTile': '/static/floor/win_tile.svg',
        // if you ever find out how to make it dynamic that would be like 99x better
        // all: fill #aaaaaa stroke #eeeeee
        // master: fill #555555 stroke #333333
        // red, blue, green change 5 to f and 3 to b
        // others do not have set colors yet
        'doorOpen': '/static/doors/open.svg',
        'doorClosed': '/static/doors/close.svg',
        'button': '/static/button.svg',
    };
});
