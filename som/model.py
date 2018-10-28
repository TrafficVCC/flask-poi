from som import MysqlUtil
import os

mysqlHelper = MysqlUtil.MysqlUtil('127.0.0.1', 'root', 'asdf', 'vccp')

def getAllArea():
    """
    查询所有事故点
    :return: [{},{},...]
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
           where precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    rv = mysqlHelper.fetchall(sql)
    mysqlHelper.close(conn, cur)
    return rv

def getAreaByName(name):
    """
    根据行政区划名称查询
    :param name:
    :return:
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select xzqhms, sgdd, lng_bmap as lng, lat_bmap as lat, count(*) as count from ybsg \
              where xzqhms = %s and precise = 1 group by xzqhms, sgdd, lng_bmap, lat_bmap"
    rv = mysqlHelper.fetchall(sql, name)
    mysqlHelper.close(conn, cur)
    return rv

def getPoiBySgdd(sgdd, xzqh):
    """
    根据事故地点获取其附近POI
    :param sgdd:
    :return:
    """
    conn, cur = mysqlHelper.getConnect()
    sql = "select type, distance from poi where sgdd = %s and xzqhms = %s"
    rv = mysqlHelper.fetchall(sql, (sgdd, xzqh,))
    mysqlHelper.close(conn, cur)
    return rv

def getPoiByArea(xzqh):
    """
    获取行政区划下事故地点的POI
    :param xzqh:
    :return: [{'center': {'sgdd': 'aa', 'lng': 11, 'lat': 22, count: 4},
               'poi': [{'type': xx, 'dis': 123}, {}, ...] }]
    """
    sgdd_list = getAreaByName(xzqh)
    poi_list = []
    count = 0   #有的事故地点没有poi点
    for item in sgdd_list:
        sgdd = item['sgdd']
        rv = getPoiBySgdd(sgdd, xzqh)
        pp = {}
        if rv:
            pp['center'] = {'sgdd': sgdd, 'lng': item['lng'], 'lat': item['lat'], 'count': item['count']}
            pp['poi'] = rv
            poi_list.append(pp)
            print(pp)
        else:
            count += 1
    print(count)
    return poi_list

if __name__ == '__main__':
    getPoiByArea('瑶海区')
