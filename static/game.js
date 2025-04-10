document.addEventListener('DOMContentLoaded', (event) => {
    /*
    use fetch and then the route from app.py
    python cant be that hard to read right
    if ur confused about something or you need something added lmk
    */
    // here is some working code
    function getBoard() {
        fetch('/board')
            .then(response => response.json())
            .then(data => {
                board = data
                console.log(board)
            })
            .catch(error => {
                console.log('nice error', error)
            });
    };

    getBoard();
});