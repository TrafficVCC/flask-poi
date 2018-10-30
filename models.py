from app import mysql

def getAllArea():
    """
    查询所有事故点
    :return: [{},{},...]
    """
    cur = mysql.connection.cursor()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
           where precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    cur.execute(sql)
    rv = cur.fetchall()
    return rv

def getAreaByName(name):
    """
    根据行政区划名称查询
    :param name:
    :return:
    """
    cur = mysql.connection.cursor()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
           where xzqhms = %s and precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    cur.execute(sql, (name,))
    rv = cur.fetchall()
    return rv

def getPoiBySgdd(sgdd, xzqh):
    """
    根据事故地点获取其附近POI
    :param sgdd:
    :return:
    """
    cur = mysql.connection.cursor()
    sql = "select type, distance from poi where sgdd = %s and xzqhms = %s"
    cur.execute(sql, (sgdd, xzqh))
    rv = cur.fetchall()
    return rv

def getPoiByArea(xzqh):
    """
    获取行政区划下事故地点的POI
    :param xzqh:
    :return: [{'center': {'sgdd': 'aa', 'lng': 11, 'lat': 22},
               'poi': [{'type': xx, 'dis': 123}, {}, ...] }]
    """
    sgdd_list = []
    if xzqh == "all":
        sgdd_list = getAllArea()
    else:
        sgdd_list = getAreaByName(xzqh)
    poi_list = []
    count = 0   #有的事故地点没有poi点
    for item in sgdd_list:
        sgdd = item['sgdd']
        rv = getPoiBySgdd(sgdd, xzqh)
        pp = {}
        if rv:
            pp['center'] = {'sgdd': sgdd, 'lng': item['lng'], 'lat': item['lat']}
            pp['poi'] = rv
            poi_list.append(pp)
            print(pp)
        else:
            count += 1
    print(count)
    print(len(poi_list))
    return poi_list

def getAreaByType(xzqh, type):
    """
    按行政区划和类别查询
    :param xzqh:
    :param type:
    :return:
    """
    cur = mysql.connection.cursor()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
              where xzqhms = %s and type is not null and type = %s and precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    cur.execute(sql, (xzqh, type,))
    rv = cur.fetchall()
    return rv

def getPoiByType(xzqh, sgdd):
    cur = mysql.connection.cursor()
    sql = "select type, count(*) as count from poi \
           where xzqhms = %s and sgdd = %s group by type"
    cur.execute(sql, (xzqh, sgdd))
    rv = cur.fetchall()
    return rv

def poiType(xzqh, type):
    """
    获取某一类事故点的poi
    :param xzqh:
    :param type:
    :return: [{'center': {'sgdd': 'aa', 'lng': 11, 'lat': 22, 'count': 1},
               'poi': [{'type': '学校', 'count': 10}, {}, ...] }]
    """
    sgdd_list = getAreaByType(xzqh, type)
    poi_list = []
    count = 0  # 有的事故地点没有poi点
    poiType = ['交通设施', '休闲娱乐', '教育培训', '旅游景点', '美食', '购物']
    for item in sgdd_list:
        sgdd = item['sgdd']
        rv = getPoiByType(xzqh, sgdd)
        pp = {}
        if rv:
            #为了更好转换成geojson,其实不需要'center'
            pp = {'sgdd': sgdd, 'lng': item['lng'], 'lat': item['lat'], 'count': item['count']}
            pp['poi'] = rv
            poi_list.append(pp)
            print(pp)
        else:
            count += 1
    print(count)
    print(len(poi_list))
    return poi_list

if __name__ == '__main__':
    getPoiByArea('瑶海区')

