let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
c.imageSmoothingEnabled = false
class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(that) {
        return new Vector2(this.x + that.x, this.y + that.y)
    }
    multiply(that) {
        return new Vector2(this.x * that, this.y * that)
    }
    toPolar() {
        return {
            a: Math.atan2(this.y, this.x),
            r: Math.sqrt(this.x ** 2 + this.y ** 2)
        }
    }
    normalize() {
        return this.multiply(1 / (Math.sqrt(this.x ** 2 + this.y ** 2)))
    }
    inBoundsRect(thatMin, thatMax) {
        let relativeThis = this.add(thatMin.multiply(-1))
        return (
            (
                0 < relativeThis.x
                &&
                relativeThis.x < thatMax.x
            )
            &&
            (
                0 < relativeThis.y
                &&
                relativeThis.y < thatMax.y
            )
        )
    }
    floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y))
    }
}
Vector2.unit = new Vector2(1, 1)
Vector2.zero = new Vector2(0, 0)
Vector2.polar = (a, r) => {
    return new Vector2(Math.cos(a), Math.sin(a)).multiply(r)
}
function drawRect(pos, dim, r, g, b, a) {
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}
function drawLine(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
}
function drawPoly(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
    c.fill()
}
function drawArc(pos, rad, sa, ea, clock, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.arc(pos.x, pos.y, rad, sa, ea, !clock)
    c.stroke()
    c.fill()
}
function drawImg(img, cropPos, cropDim, pos, dim) {
    c.drawImage(img, cropPos.x, cropPos.y, cropDim.x, cropDim.y, pos.x, pos.y, dim.x, dim.y)
}
function write(text, pos, r, g, b, a) {
    c.font = '20px Arial'
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillText(text, pos.x, pos.y)
}
function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}
let tilemap = []
let yLen = +prompt()
let xLen = +prompt()
for (let y = 0; y < +yLen; y++) {
    tilemap[y] = []
    for (let x = 0; x < +xLen; x++) {
        tilemap[y][x] = '.....'
    }
}
/*
    First Character: Object element
P: player
C: crate
M: multipush
I: ice
.: nothing

Second Character: Wall element
#: wall
S: semiwall

Last three characters: Floor element
—: null (not done yet)
…: floor
B1.: button class 1
B2.: button class 2
B3.: button class 3
BM.: button master
D1.: door class 1
D2.: door class 2
D3.: door class 3
DM.: door master
DA: door all (almost done implementing)
*/
let mouse = Vector2.zero
let tileType = '.#...'
let tileList = []
let actions = []
let objs = [
    'P',
    'C',
    'M',
    'I',
    '.',
    '?'
]
let wals = [
    '#',
    'S',
    '^',
    '.',
    '?'
]
let flos = [
    '---',
    '...',
    'T..',
    'TW.',
    'B0.',
    'B1.',
    'B2.',
    'B3.',
    'B4.',
    'B5.',
    'B6.',
    'B7.',
    'B8.',
    'B9.',
    'BM.',
    'BA.',
    'D0.',
    'D1.',
    'D2.',
    'D3.',
    'D4.',
    'D5.',
    'D6.',
    'D7.',
    'D8.',
    'D9.',
    'DM.',
    'DA.',
    'D0I',
    'D1I',
    'D2I',
    'D3I',
    'D4I',
    'D5I',
    'D6I',
    'D7I',
    'D8I',
    'D9I',
    'DMI',
    'DAI',
    'C0U',
    'C1U',
    'C2U',
    'C3U',
    'C4U',
    'C5U',
    'C6U',
    'C7U',
    'C8U',
    'C9U',
    'CMU',
    'CAU',
    'C0D',
    'C1D',
    'C2D',
    'C3D',
    'C4D',
    'C5D',
    'C6D',
    'C7D',
    'C8D',
    'C9D',
    'CMD',
    'CAD',
    'C0L',
    'C1L',
    'C2L',
    'C3L',
    'C4L',
    'C5L',
    'C6L',
    'C7L',
    'C8L',
    'C9L',
    'CML',
    'CAL',
    'C0R',
    'C1R',
    'C2R',
    'C3R',
    'C4R',
    'C5R',
    'C6R',
    'C7R',
    'C8R',
    'C9R',
    'CMR',
    'CAR',
    '???'
]
let sprites = [
    {
        'P': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/player.png',
        'C': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/crate.png',
        'M': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/multipush.png',
        'I': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/ice.png',
        '.': ''
    },
    {
        '#': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/wall.png',
        'S': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/semiwall.png',
        '^': 'https://kufbsrieewz.github.io/Semiban/static/assets_png/spike.png',
        '.': ''
    }
]
for (let i of objs) {
    for (let j of wals) {
        for (let k of flos) {
            tileList.push(i + j + k)
        }
    }
}
function draw() {
    clear()
    for (let y = 0; y < tilemap.length; y++) {
        for (let x = 0; x < tilemap[y].length; x++) {
            let tile = tilemap[y][x]
            let img = new Image()
            if (tile.slice(2, 5) == '...') {
                img = new Image()
                img.src = 'https://kufbsrieewz.github.io/Semiban/static/assets_png/floor.png'
                drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            }
            if (tile[2] == 'B') {
                img = new Image()
                img.src = `https://kufbsrieewz.github.io/Semiban/static/assets_png/button/${tile[3]}.png`
                drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            }
            if (tile[2] == 'D') {
                img = new Image()
                img.src = `https://kufbsrieewz.github.io/Semiban/static/assets_png/closed/${tile[3]}.png`
                drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            }
            if (tile.slice(2, 5) == 'T..') {
                img = new Image()
                img.src = `https://kufbsrieewz.github.io/Semiban/static/assets_png/target.png`
                drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            }
            if (tile.slice(2, 5) == 'TW.') {
                img = new Image()
                img.src = `https://kufbsrieewz.github.io/Semiban/static/assets_png/win_tile.png`
                drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            }
            img = new Image()
            img.src = sprites[0][tile[0]]
            drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
            img = new Image()
            img.src = sprites[1][tile[1]]
            drawImg(img, Vector2.zero, Vector2.unit.multiply(64), new Vector2(x, y).multiply(35), Vector2.unit.multiply(35))
        }
    }
}
setInterval(draw, 1)
let isDragging = false
window.addEventListener('mousedown', (e) => {
    isDragging = true
})

window.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false
    }
})
window.addEventListener('mousemove', function (event) {
    mouse = new Vector2(event.x, event.y)
    if (isDragging && mouse.inBoundsRect(Vector2.zero, new Vector2(tilemap[0].length, tilemap.length).multiply(35))) {
        if (tileType != tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x]) {
            actions.push([mouse.multiply(1 / 35).floor(), tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x]])
        }
        if (tileType.includes('?')) {
            newTile = tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x].split('')
            for (let i = 0; i < 5; i++) {
                if (tileType[i] != '?') {
                    newTile[i] = tileType[i]
                }
            }
            tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x] = newTile.join('')
        } else {
            tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x] = tileType
        }
    }
})
window.addEventListener('click', function (event) {
    mouse = new Vector2(event.x, event.y)
    if (mouse.inBoundsRect(Vector2.zero, new Vector2(tilemap[0].length, tilemap.length).multiply(35))) {
        if (tileType != tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x]) {
            actions.push([mouse.multiply(1 / 35).floor(), tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x]])
        }
        if (tileType.includes('?')) {
            newTile = tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x].split('')
            for (let i = 0; i < 5; i++) {
                if (tileType[i] != '?') {
                    newTile[i] = tileType[i]
                }
            }
            tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x] = newTile.join('')
        } else {
            tilemap[mouse.multiply(1 / 35).floor().y][mouse.multiply(1 / 35).floor().x] = tileType
        }
    }
})
window.addEventListener('keypress', function (event) {
    switch (event.key) {
        case ' ':
            let nextTileType = this.prompt('Which tile would you like to draw next? Enter a space character to see the options.')
            while (!(tileList.includes(nextTileType))) {
                if (nextTileType == ' ') {
                    this.open('https://kufbsrieewz.github.io/Semiban/tileList.txt')
                    nextTileType = this.prompt('Which tile would you like to draw next? Enter a space character to see the options.')
                }
                if (!(tileList.includes(nextTileType))) {
                    if (nextTileType == 'e') {
                        // exprot
                        let exportData = []
                        for (let y = 0; y < tilemap.length; y++) {
                            exportData.push(tilemap[y].join(' '))
                        }
                        this.document.body.innerHTML = JSON.stringify(exportData)
                        navigator.clipboard.writeText(JSON.stringify(exportData))
                            .then(() => alert("Level data copied to clipboard!"))
                            .catch(err => {
                                console.error("Copy failed:", err)
                                alert("Failed to copy level data.")
                            }
                            )
                        break
                    } else if (nextTileType == 'exit' || nextTileType == '' || nextTileType == null || nextTileType == undefined) {
                        break
                    } else {
                        this.alert('Sorry, I don\'t think that is a legitimate tile! It is kace censcativ!')
                        nextTileType = this.prompt('Which tile would you like to draw next? Enter a space character to see the options.')
                    }
                }
            }
            if (nextTileType == 'e' || nextTileType == 'exit' || nextTileType == '' || nextTileType == null || nextTileType == undefined) {
                break
            } else {
                tileType = nextTileType
                break
            }
        case 'e':
            // exprot
            let exportData = []
            for (let y = 0; y < tilemap.length; y++) {
                exportData.push(tilemap[y].join(' '))
            }
            this.document.body.innerHTML = JSON.stringify(exportData)
            navigator.clipboard.writeText(JSON.stringify(exportData))
                .then(() => alert("Level data copied to clipboard!"))
                .catch(err => {
                    console.error("Copy failed:", err)
                    alert("Failed to copy level data.")
                }
                )
            break
        case 'z':
            // undo
            let i = actions[actions.length-1][0]
            tilemap[i.y][i.x] = actions[actions.length-1][1]
            actions.splice(actions.length-1, 1)
            break
        case '-':
            tileType = '..---'
            break
        case '.':
            tileType = '.....'
            break
        case 'p':
            tileType = 'P????'
            break
        case 'P':
            tileType = 'P????'
            break
        case 'c':
            tileType = 'C????'
            break
        case 'C':
            tileType = 'C????'
            break
        case 'i':
            tileType = 'I????'
            break
        case 'I':
            tileType = 'I????'
            break
        case 'm':
            tileType = 'M????'
            break
        case 'M':
            tileType = 'M????'
            break
        case '#':
            tileType = '?#???'
            break
        case '^':
            tileType = '?^???'
            break
        case 's':
            tileType = '?S???'
            break
        case 'S':
            tileType = '?S???'
            break
        case 'w':
            tileType = '??TW.'
            break
        case 'W':
            tileType = '??TW.'
            break
        case 't':
            tileType = '??T..'
            break
        case 'T':
            tileType = '??T..'
            break
    }
})
