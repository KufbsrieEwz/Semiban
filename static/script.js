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
let tilemap
function getBoard() {
    fetch('https://uphri.pythonanywhere.com/board')
        .then(response => response.json())
        .then(data => {
            tilemap = data
            console.log(tilemap)
        })
        .catch(error => {
            console.log('nice error', error)
        })
}
getBoard()
function draw() {
    clear()
    getBoard()
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
            if (tile[2] == 'd') {
                img = new Image()
                img.src = `https://kufbsrieewz.github.io/Semiban/static/assets_png/open/${tile[3]}.png`
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
    requestAnimationFrame(draw)
}
draw()
window.addEventListener('keypress', async function (event) {
    await this.fetch('/keypress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({key: event.key})
    })
})
