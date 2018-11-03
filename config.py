DEBUG=True
MYSQL_HOST='localhost'
MYSQL_PORT=3306
MYSQL_USER='root'
MYSQL_PASSWORD='asdf'
MYSQL_DB='vccp'
MYSQL_CURSORCLASS='DictCursor'

class global_params:
    '''
    定义整个项目的参数变量
    '''
    pois = ['休闲娱乐', '教育培训', '旅游景点', '交通设施', '美食', '购物']
    radius = 500
    precise = 1

def set_pois(pois):
    global_params.pois = pois

def get_pois():
    return global_params.pois

def set_radius(radius):
    global_params.radius = radius

def get_radius():
    return global_params.radius

def set_precise(precise):
    global_params.precise = precise

def get_precise():
    return global_params.precise