from flask import Flask
from flask_mysqldb import MySQL
from flask import render_template, request, jsonify
import models

app = Flask(__name__)
app.config.from_object('config')
mysql = MySQL(app)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/cluster')
def cluster():
    return render_template('bmap.html')

@app.route('/mapbox')
def mapbox():
    return render_template('mapbox.html')

@app.route('/som')
def poi_page():
    return render_template('cluster.html')

@app.route('/area', methods=['GET', 'POST'])
def area():
    # 获取Get数据
    xzqh = request.args.get('xzqh', None)
    res = []
    print(xzqh)
    if xzqh is None:
        return res
    elif xzqh == 'all':
        res = models.getAllArea()
    else:
        res = models.getAreaByName(xzqh)
    print(len(res))
    return jsonify(res)

@app.route('/poi', methods=['GET', 'POST'])
def poi():
    # 获取poi数据
    xzqh = request.args.get('xzqh', None)
    if xzqh is None:
        return
    res = models.getPoiByArea(xzqh)
    print(len(res))
    return jsonify(res)

if __name__ == '__main__':
    app.run(debug=True)