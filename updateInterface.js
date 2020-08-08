var mysql=require('./database')
var sql_interface=require('./myInterface')
var sql_func=new sql_interface();
var moment=require('moment')
class updateInterface{
    constructor(){}
    password(password,stuId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('student',{password},{stuId})
            console.log(sql)

            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    stuIsPass(IsPass,stuId,teamId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('stu_team',{IsPass},{stuId,teamId})
            console.log(sql)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    teamcompIsPass(IsPass,teamId,CompId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('teamcompetion',{IsPass},{teamId,CompId})
            console.log(sql)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
}



module.exports=updateInterface
