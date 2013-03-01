


function Error(){
};

Error.EC_SUCCESS = '成功';
Error.EC_FAILED = '失败';
Error.EC_DB_INSERT_FAILED = '插入数据失败';
Error.EC_DB_INSERTTRANS_FAILED = '插入数据事务失败';
Error.EC_DB_UPDATE_FAILED = '更新数据失败';
Error.EC_DB_UPDATETRANS_FAILED = '更新数据事务失败';
Error.EC_DB_DELETE_FAILED = '删除数据失败';
Error.EC_DB_DELETETRANS_FAILED = '删除数据事务失败';
Error.EC_DB_EXPORT_DATA = '导出数据失败';
Error.EC_DB_QUERY_FAILED = '查询数据失败';
Error.EC_DB_EXIST_FAILED = '数据已经存在';
Error.EC_DB_UNEXIST_FAILED = '数据不存在';

Error.EC_DELETE_SESSION = '删除会话错误';


exports = module.exports = Error;