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