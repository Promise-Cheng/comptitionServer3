var express = require('express');
var router = express.Router();
var mysql=require('../database')
var moment=require('moment')
var sql_interface=require('../myInterface')
var sql_func=new sql_interface();
var get_interface=require('../getInterface')
var get_func=new get_interface()

router.get('/sum',function(req,res,next){
    let teamId=req.query.teamId
    let CompId=req.query.CompId


    let num=null
    let limit=null
    get_func.get_members_sum(teamId).then(results=>{
        num=results
        return get_func.get_members_limit(CompId)
    }).then(results=>{
        limit=results
        res.send({
            num,limit
        })
    })

})

router.get('/Comptype',function (req,res,next) {
    //CompName 竞赛名称
    //CompIntr  竞赛介绍
})
router.post('/Competitions',function (req,res,next) {
    //compName 竞赛名称
    //CompTypeid 竞赛类别id =》竞赛类别表
    //startTime 开始时间
    //endTime  结束时间
    //compIntro
    //personNum 人数限制
    //compStateID   竞赛状态=》状态表
    //teacher
    //obStartTime   具体开始时间
    //obEndTime      具体结束时间
    let i=0


    let datas=[]
    while(i++<2) {
        let data = [
            '竞赛(new)' + i,
             7,
             3,
             i % 3 + 9,
             'caoqiubin',
            new Date(),
            '2019-9-25',
            '2020-9-26'
       ]



        datas.push(data)

    }
    let sql="INSERT INTO competition (compName,CompTypeid,personNum,compStateID,teacher,startTime,obstartTime,obendTime) VALUES ?"
    console.log(sql)
        mysql.query(sql,[datas],function (err,rows,fields) {
            if(err)
            {
                console.log(err)
                return
            }
            console.log(rows)
            res.send({
                'result':true
                }
            )
        })

})
router.post('/time',function (req,res) {
    let s=moment(req.body.t,"YYYY-MM-DD HH:mm:ss")
    console.log(s)
    res.send()
})
//批量注册
router.post('/regist',function (req,res,next) {
    let sql='INSERT INTO student(stuNum,stuName,password,class,phoneNum,QQ,email) VALUES ?'
    let values=[]
    let stuNum='2017'
    for(let i=0;i<20;i++){
        let val=[]
        val.push(stuNum+(i>10?i:'0'+i))
        val.push(i+'号测试员')
        val.push('123456')
        val.push('测试班')
        val.push('110')
        val.push('2833')
        val.push('qqmail')
        console.log(val)
        values.push(val)
    }
    mysql.query(sql,[values],function (err,rows) {
        if(err)
        {
            console.log(err)
            res.status(500).send()
            return
        }
        res.status(200).send()

    })

})

function get_members_test(teamId){
    return new Promise((resolve,reject)=>{
        let akeys=[]
        let bkeys=['stuName','stuNum','stuId']
        let condition_on={stuId:'stuId'}
        let condition_where={teamId}
        let sql=sql_func.query_multiple('stu_team','student',akeys,bkeys,condition_on,condition_where)
        console.log(sql)
        mysql.query(sql[0],sql[1],function (err,rows) {
            err&&reject(err)
            console.log(rows)
            resolve(rows)
        })
    })
}
/*给一个竞赛插入测试结果数据，需要CompId（要是结束的）*/
router.post('/addtolist',function (req,res) {
    let CompId=req.body.CompId
        new Promise((resolve,reject)=>{
       let akeys=null
       let bkeys=['teamId','teamName']


        let condition={CompId}
        let sql=sql_func.query_multiple('teamcompetion','team',akeys,bkeys,{teamId:'teamId'},condition)
       console.log(sql)
        mysql.query(sql[0],sql[1],function (err,rows) {

            err&&reject(err)
            resolve(rows)
        })
    }).then(results=>{
        let promise=null
            let teams=results
            let rank=1
            let Score=90
        teams.forEach(team=>{
            promise=get_members_test(team.teamId).then(results=>{


                let members=[]
                let ids=[]
                results.forEach(result=>{members.push(result.stuName)
                ids.push(result.stuId)})
                console.log(ids)
                console.log(members)
                team.teamMembers=members.join(';')
                team.teamMembersId=ids.join(';')
                team.Rank=rank++
                team.Score=Score--
                team.CompId=CompId
                team.Comment='test'

                data={Score:team.Score,rank:team.Rank,compId:team.CompId,teamId:team.teamId,teamName:team.teamName,teamMembersName:team.teamMembers,tips:team.Comment,teamMembersId:team.teamMembersId}
                console.log(data)
                let sql=sql_func.insert('complist',data)
                console.log(sql)
                mysql.query(sql[0],sql[1],function (err,rows) {
                    if(err){
                        console.log(err)
                        res.status(500).send()
                        return
                    }
                    res.status(200).send()
                })

            })
        })
   }).catch(err=>{
       console.log(err)
       res.status(200).send(err)
   })
})
/*给进行中竞赛插入竞赛题目*/
router.post('/addtoquestions',function (req,res) {
   // let CompId=req.body.CompId
    let status=8
    new Promise((resolve,reject)=>{
        let keys=['*']
        let sql=sql_func.query_c('competition',keys,{compStateID:status})
        mysql.query(sql[0],sql[1],function (err,rows) {
            err&&reject(err)
            resolve(rows)
        })
    }).then(results=>{
        let competitions=results
        let promise=null
        let i=0
        competitions.forEach(competition=>{
            promise=new Promise((resovle,reject)=>{
                let questionName='testName'+i
                let questionIntro='test'
                let questionNum=1
                let CompId=competition.CompId
                let fileDesc='testfiledesc'+i
                let fileName='testfileName'+i
                i++
                let data={questionName,questionIntro,questionNum,CompId,fileDesc,fileName}
                let sql=sql_func.insert('question',data)
                console.log(sql)
                mysql.query(sql[0],sql[1],function (err,rows) {
                    err&&reject(err)
                    resovle(rows)
                })
            }).then(results=>{})
        })
        res.status(200).send()
        }
    ).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
/*批量建立队伍/每个人建一支队伍*/
router.post('/createteams',function (req,res) {

})
//批量报名
router.get('/sign',function (req,res,next) {
    //查总共几个人可以测试

    //查总共几个队可以测试 l
    let people=null
    let teams=null
    new Promise((resolve,reject)=>{
        let sql=sql_func.query_c('student',['*'])
        mysql.query(sql[0],sql[1],function (err,rows) {
            err&&reject(err)
            resolve(rows)
        })
    }).then(function (results) {
        people=results
        return new Promise((resolve,reject)=>{
            let sql=sql_func.query_c('team',['*'])
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    },function (err) {
        console.log(err)
    }).then(function (results) {
        teams=results
        let sql='INSERT INTO stu_team(stuId,teamId,leader,IsPass,Role) VALUES ?'
        let values=[]
        for(let i in people)
        {
            if(teams[i%teams.length].teamLeader===people[i].stuId)
                continue;
            let val=[]
            val.push(people[i].stuId)
            val.push(teams[i%teams.length].teamId)
            val.push(0)
            val.push(0)
            val.push("队员（测试）")
            values.push(val)
        }
        console.log(sql)
        console.log(values)
        mysql.query(sql,[values],function (err,rows) {
            if(err)
            {
                console.log(err)
                res.send()
                return;
            }
            res.send({
                result:'success'
            })

        })


    },err=>{
        console.log(err)
        res.send()})
})

/*给每一个竞赛团队查一条作品*/
router.post('/addwork',function (req,res) {
    let sql='SELECT * FROM teamcompetion'
    let teamcompetions
    mysql.query(sql,null,function (err,rows) {
        teamcompetions=rows
        sql='INSERT INTO works(teamCompId,workName,introduction) VALUES ?'
        let vals=[]
        for(let i in teamcompetions){
            let val=[]
            val.push(teamcompetions[i].teamCompId)
            val.push(teamcompetions[i].teamCompId+'#测试作品')
            val.push('test')
            vals.push(val)
        }
        mysql.query(sql,[vals],function (err,rows) {
            if(err)
                console.log(err)
            res.send({
                result:'ok'
            })
        })
    })
})
/*给每一个竞赛插一个题目*/
router.post('/addquestion',function (req,res) {
    let sql='SELECT * FROM competition'
    let competitions
    mysql.query(sql,null,function (err,rows) {
        competitions=rows
        sql='INSERT INTO question(CompId,questionName,questionIntro,questionNum) VALUES ?'
        let vals=[]
        for(let i in competitions){
            let val=[]
            val.push(competitions[i].CompId)
            val.push(competitions[i].CompId+'#测试作品')
            val.push('test')
            val.push('10.20')
            vals.push(val)
        }
        mysql.query(sql,[vals],function (err,rows) {
            if(err)
                console.log(err)
            res.send({
                result:'ok'
            })
        })
    })
})
module.exports=router
