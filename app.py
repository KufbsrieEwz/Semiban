from flask import Flask, render_template
from logic import SemibanLogic

app = Flask(__name__)
game = SemibanLogic()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)