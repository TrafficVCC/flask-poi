from flask import Flask
from flask_mysqldb import MySQL
from flask import render_template, request, jsonify
import models

app = Flask(__name__)
app.config.from_object('config')
mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('bmap.html')

@app.route('/area', methods=['GET', 'POST'])
def area():
    # 获取Get数据
    xzqh = request.args.get('xzqh', 'no data')
    res = models.getAllArea()
    print(len(res))
    return jsonify(res)

if __name__ == '__main__':
    app.run(debug=True)