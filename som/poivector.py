import numpy as np
import math as math
from som import model

def haversine(lng1, lat1, lng2, lat2):
    lng1, lat1, lng2, lat2 = map(math.radians, [lng1, lat1, lng2, lat2])
    dlng = lng2 - lng1 
    dlat = lat2 - lat1 
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    r = 6371    # 地球平均半径，单位为公里
    dis = round(c * r * 1000)  # 单位为米，舍去小数点
    return dis


"""
data:{  'centre':{'id':123456, 'lng':123, 'lat':123 }
        'poi':[{type:XX, 'dis':123 }]}
"""
def trans_vector(data, typelist, levellist, wl, wd, r):
    vectors = []
    pre_vector = np.zero(len(typelist))
    for d in data:
        the_id = (d['centre']['id'])
        vector = pre_vector.copy()
        for p in d['poi']:
            the_type = p['type']
            the_index = typelist.index(the_type)
            the_dis = p['dis']
            vector[the_index] += 1 + wl * levellist[the_index] + wd * (the_dis/r)
        vectors.append({'id':the_id, 'vector':vector})
    return vectors


typelist = ['美食', '购物', '旅游景点', '休闲娱乐', '教育培训', '交通设施']
levellist = [1,1,1,1,1,1]
wl = 1
wd = 1
# trans_vector(data, typelist, levellist, wl, wd, 500)

# 按行政区划获取事故点poi
poi = model.getPoiByArea('高速')
print(len(poi))
