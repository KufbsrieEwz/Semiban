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

@app.route('/api/info')
def get_info():
    info = game.get_info()
    return jsonify(info)

@app.route('/api/move', methods=['POST'])
def move():
    data = request.json
    direction = data.get('direction')
    success = game.move_player(direction)
    state = game.get_info()
    
    return jsonify({
        'success': success,
        'state': state,
        'completed': game.is_completed()
    })

@app.route('/api/restart', methods=['POST'])
def restart():
    game.restart_level()
    state = game.get_info()
    return jsonify({
        'success': True,
        'state': state
    })

@app.route('/api/undo', methods=['POST'])
def undo():
    success = game.undo_move()
    state = game.get_info()
    return jsonify({
        'success': success,
        'state': state
    })

@app.route('/api/next', methods=['POST'])
def next_level():
    success = game.next_level()
    state = game.get_info()
    return jsonify({
        'success': success, 
        'state': state
    })

@app.route('/api/previous', methods=['POST'])
def previous_level():
    success = game.previous_level()
    state = game.get_info()
    return jsonify({
        'success': success, 
        'state': state
    })

@app.route('/api/import', methods=['POST'])
def import_level():
    data = request.json
    level_code = data.get('level_code')
    
    if not level_code:
        return jsonify({
            'success': False,
            'message': 'where is bros level code'
        }), 400
    
    try:
        success = game.import_level(level_code)
        if success:
            state = game.get_info()
            return jsonify({
                'success': True,
                'state': state,
                'message': 'theres no way u got this first try'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'bad format'
            }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'import error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
