import json

def read_vector_json(path):
    #读取poi向量的json数据，返回一个id数组和向量数组
    id_list = []
    vector_list = []
    with open(path,'r',-1,'UTF-8')as file_object:
        temp = json.load(file_object)
        for one in temp:
            id_list.append(one['id'])
            vector_list.append([float(a) for a in one['vector']])
    return id_list,vector_list



