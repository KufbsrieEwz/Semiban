from flask import Flask, jsonify, render_template
from logic import SemibanLogic

app = Flask(__name__)
game = SemibanLogic()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/board')
def get_board():
    board = game.board
    return jsonify(board)


if __name__ == '__main__':
    app.run(debug=True)