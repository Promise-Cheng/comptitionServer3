var mysql=require('./database')
var sql_interface=require('./myInterface')
var sql_func=new sql_interface();
var moment=require('moment')
class insertInterface{
    constructor(){}

    stu_team(stuId,teamId){
        return new Promise((resolve, reject) => {
            let data={stuId,teamId,leader:0,IsPass:0,Role:'队员'}
            let sql=sql_func.insert('stu_team',data)
            mysql.query(sql[0],sql[1],function (err,rows) {
               err&&reject(err)
                resolve(rows)
            })
    })
    }

    teamcompetion(data){
        return new Promise((resolve, reject) => {
            let sql=sql_func.insert('teamcompetion',data)
            mysql.query(sql[0],sql[1],function (err,rows){
               err&&reject(err)
                 resolve(rows)
            })
        })
    }
    work(data){
        return new Promise((resolve, reject) => {
            let sql=sql_func.insert('works',data)
            mysql.query(sql[0],sql[1],function (err,rows){
               err&&reject(err)
                 resolve(rows)
            })
        })
    }
}



module.exports=insertInterface
