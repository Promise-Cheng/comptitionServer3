var mysql=require('./database')
var sql_interface=require('./myInterface')
var sql_func=new sql_interface();

class queryInterface {
    constructor(){}

    /*在学生团队表中查询有无stuId，teamId已存在数据*/
    query_stuId_teamId(stuId,teamId){
        return new Promise((resolve,reject)=>{ let keys=['*']
            let sql=sql_func.query_c('stu_team',keys,{stuId,teamId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                //console.log(rows[0])
                err&&reject(err)
                resolve(rows[0])
            })
        })

    }

    /*查询我创建的团队*/
    query_myteams(stuId){
        return new Promise((resolve,reject)=>{
            let keys=['teamId','teamName']
            let sql=sql_func.query_c('team',keys,{teamLeader:stuId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject[err]
                resolve(rows)
            })
        })
    }

    /*在团队竞赛表中查询是否有重复记录*/
    query_CompId_teamId(CompId,teamId){
        return new Promise((resolve,reject)=>{
            let keys=['*']
            let condition={CompId,teamId}
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
}

module.exports=queryInterface
