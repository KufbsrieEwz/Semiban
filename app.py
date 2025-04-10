from flask import Flask, jsonify, request, send_from_directory, render_template
from logic import SemibanLogic
import os
import re

app = Flask(__name__)
game = SemibanLogic()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/assets/<path:filename>')
def assets(filename):
    try:
        paths = filename.split('/')
        if len(paths) > 1:
            asset_path = os.path.join('assets', *paths[:-1])
            file = paths[-1]
        else:
            asset_path = 'assets'
            file = filename
        return send_from_directory(asset_path, file)
    except Exception as error:
        return f"where tf is this asset: {str(error)}", 404

@app.route('/board')
def get_board():
    board = game.board
    return jsonify(board)

@app.route('/keypress', methods=['POST'])
def handle_keypress():
    data = request.json
    key = data.get('key')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
