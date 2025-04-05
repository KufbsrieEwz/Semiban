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
        'doorOpen': '/static/doors/open.svg', // if you oever find out how to make it dynamic that would be like 99x better
        'doorClosed': '/static/doors/close.svg', // see above
        'button': '/static/button.svg', // see above
    };
});
