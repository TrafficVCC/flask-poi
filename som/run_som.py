import numpy as np
import som.reader as rd
from som.class_som import Som

"""
读取整理好的事故点poi向量数据
运行SOM聚类算法
获得类群，类所代表的特征向量，属于该类的事故点id
"""

read_path = "./testdata.json"
id_list,vector_list = rd.read_vector_json(read_path)
vectors = np.mat(vector_list)
vectors_old = vectors.copy()

som = Som(vectors,(6,6),1,3)
clusters = som.do_som()

for c in clusters:
    points_id = []
    for p in c['points']:
        points_id.append(id_list[p])
    c['points'] = points_id.copy()
print(clusters)


