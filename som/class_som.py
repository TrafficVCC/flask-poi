import numpy as np

class Som(object):
    def __init__(self, X, output, iteration, batch_size):
        """
        :param X:  形状是N*D， 输入样本有N个,每个D维
        :param output: (n,m)一个元组，为输出层的形状是一个n*m的二维矩阵
        :param iteration:迭代次数
        :param batch_size:每次迭代时的样本数量
        初始化一个权值矩阵，形状为D*(n*m)，即有n*m权值向量，每个D维
        """
        self.X = X
        self.X_old = X.copy()
        self.output = output
        self.iteration = iteration
        self.batch_size = batch_size
        self.W = np.random.rand(X.shape[1], output[0] * output[1])

    def get_N(self, t):
        """
        :param t:时间t, 这里用迭代次数来表示时间
        :return: 返回一个整数，表示拓扑距离，时间越大，拓扑邻域越小
        """
        a = min(self.output)
        return int(a-float(a)*t/self.iteration)

    def get_eta(self, t, n):
        """
        :param t: 时间t, 这里用迭代次数来表示时间
        :param n: 拓扑距离
        :return: 返回学习率，
        """
        return np.power(np.e, -n)/(t+2)

    def updata_W(self, X, t, winner):
        """
        根据获胜神经元更新权重矩阵
        公式：
        """
        N = self.get_N(t)
        for x, i in enumerate(winner):
            to_update = self.get_neighbor(i[0], N)
            for j in range(N+1):
                e = self.get_eta(t, j)
                for w in to_update[j]:
                    self.W[:, w] = np.add(self.W[:,w], e*(X[x,:] - self.W[:,w]))

    def get_neighbor(self, index, N):
        """
        :param index:获胜神经元的下标
        :param N: 邻域半径
        :return ans: 返回一个集合列表，分别是不同邻域半径内需要更新的神经元坐标
        """
        a, b = self.output
        length = a*b
        def distence(index1, index2):
            i1_a, i1_b = index1 // a, index1 % b
            i2_a, i2_b = index2 // a, index2 % b
            return np.abs(i1_a - i2_a), np.abs(i1_b - i2_b)

        ans = [set() for i in range(N+1)]
        for i in range(length):
            dist_a, dist_b = distence(i, index)
            if dist_a <= N and dist_b <= N: ans[max(dist_a, dist_b)].add(i)
        return ans

    def normal_X(self, X):
        """
        :param X:二维矩阵，N*D，N个D维的数据
        :return: 将X归一化的结果
        """
        N, D = X.shape
        for i in range(N):
            temp = np.sum(np.multiply(X[i], X[i]))
            X[i] /= np.sqrt(temp)
        return X

    def normal_W(self, W):
        """
        :param W:二维矩阵，D*(n*m)，D个n*m维的数据
        :return: 将W归一化的结果
        """
        for i in range(W.shape[1]):
            temp = np.sum(np.multiply(W[:,i], W[:,i]))
            W[:, i] /= np.sqrt(temp)
        return W

    def train(self):
        """
        train_Y:训练样本与形状为batch_size*(n*m)
        winner:一个一维向量，batch_size个获胜神经元的下标
        :return:返回值是调整后的W
        """
        count = 0
        while self.iteration > count:
            train_X = self.X[np.random.choice(self.X.shape[0], self.batch_size)]
            self.normal_W(self.W)
            self.normal_X(train_X)
            train_Y = train_X.dot(self.W)
            winner = np.argmax(train_Y, axis=1).tolist()
            self.updata_W(train_X, count, winner)
            count += 1
        return self.W

    def train_result(self):
        self.normal_X(self.X)
        train_Y = self.X.dot(self.W)
        winner = np.argmax(train_Y, axis=1).tolist()
        return winner

    def do_som(self):
        self.train()
        res = self.train_result()
        print(self.W)
        classify = {}
        classes_W = {}
        for i, win in enumerate(res):
            if not classify.get(win[0]):
                classify.setdefault(win[0], [i])
                wins = []
                for one in self.W:
                    wins.append(one[win[0]])
                classes_W.setdefault (win[0], wins)
            else:
                classify[win[0]].append(i)
        
        classes = list(classify.keys())
        points  = list(classify.values())
        winners = list(classes_W.values())
        clusters = []
        for i, c in enumerate(classes):
            clusters.append({'class':c, 'points':points[i], 'W':winners[i]})
        return clusters
        # print(clusters)



        



    