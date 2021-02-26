const mysql=require('mysql')
const config=require('./configs')

const pool=mysql.createPool({
    host:config.host,
    port:config.port,
    user:config.user,
    password:config.password,
    database:config.database
})


var query=function(sql_str,sql_params,callback) {
    pool.getConnection((err, connection)=> {
        if (err) {
            callback(err, null,null)
            return
        }
        console.log('数据库连接池连接成功 id:'+connection.threadId)
        connection.query(sql_str, sql_params, (err, rows, fields)=> {
            connection.release()
            console.log('*****连接池释放 id:'+connection.threadId)
            if(err)
            {
                callback(err, null,null)
                return
            }
            callback(err, rows, fields)
        })

    })
}
module.exports={query}
