import pymysql
import os

class MysqlUtil:
    '''
    mysql工具类
    '''

    def __init__(self, host, user, password, database, port=3306, charset='utf8'):
        '''
        初始化参数
        :param host:        主机
        :param user:        用户名
        :param password:    密码
        :param database:    数据库
        :param port:        端口号，默认是3306
        :param charset:     编码，默认是utf8
        '''
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password
        self.charset = charset

    def getConnect(self):
        '''
        返回连接和游标
        '''
        self.conn = pymysql.connect(host=self.host,
                                    user=self.user,
                                    password=self.password,
                                    database=self.database,
                                    port=self.port,
                                    charset=self.charset,
                                    cursorclass=pymysql.cursors.DictCursor
                                    )
        self.cur = self.conn.cursor()
        return (self.conn, self.cur)

    def fetchone(self, sql, params=None):
        '''
        根据sql和参数获取一行数据
        :@sql:  sql语句
        :@params:       sql语句对象的参数元组，默认值为None
        :return:             查询的一行数据
        '''
        dataOne = None
        try:
            count = self.cur.execute(sql, params)
            if count != 0:
                dataOne = self.cur.fetchone()
        except Exception as ex:
            print(ex)
        return dataOne

    def fetchall(self, sql, params=None):
        '''
        获取所有行
        '''
        dataAll = None
        try:
            count = self.cur.execute(sql, params)
            if count != 0:
                dataAll = self.cur.fetchall()
        except Exception as ex:
            print(ex)
        return dataAll

    def __item(self, sql, params=None, batch=0):
        '''
        执行增删改
        @sql:   sql语句
        @params:   参数列表(批量执行时为序列: [(),(),...])
        @batch: 是否批量执行：0为单条执行, 1为批量执行
        注:需要自己commit
        '''
        count = 0
        try:
            if batch == 0:
                count = self.cur.execute(sql, params)
            elif batch == 1:
                count = self.cur.executemany(sql, params)
            #self.conn.commit()
        except Exception as ex:
            print(ex)
        return count

    def update(self, sql, params=None, batch=0):
        return self.__item(sql, params, batch)

    def insert(self, sql, params=None, batch=0):
        return self.__item(sql, params, batch)

    def delete(self, sql, params=None, batch=0):
        return self.__item(sql, params, batch)

    def __close(self):
        '''
        关闭执行工具和连接对象
        '''
        if self.cur != None:
            self.cur.close()
        if self.conn != None:
            self.conn.close()

    def close(self, conn, cur):
        self.__close()
        # if cur != None:
        #     cur.close()
        # if conn != None:
        #     conn.close()
