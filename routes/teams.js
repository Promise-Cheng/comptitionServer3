var express = require('express');
var router = express.Router();
var mysql=require('../database')

var sql_interface=require('../myInterface')
var sql_func=new sql_interface();
var get_interface=require('../getInterface')
var get_func=new get_interface()




/*全校团队列表*/
router.get('/show',function (req,res,next) {
    let page=req.query.page||1
    let size=req.query.size||5
    page=parseInt(page)
    size=parseInt(size)
    let limit={
        'start':(page-1)*size,
        'end':size
    }
    let data=null
    let Sum=null
    get_func.teams(limit).then(results=>{
       data=results
        return get_func.teamSum()
    }).then(sum=>{
        Sum=sum
        res.status(200).send({
            result:'success',
            data,
            Sum
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

router.get('/Search',function (req,res) {
    let content=req.query.content
    if(content===undefined){
        res.status(500).send()
        return
    }
    let teamName='%'+content+'%'
    let stuName='%'+content+'%'
    let sql="SELECT a.teamId,a.teamName,b.stuName,b.stuNum FROM team a INNER JOIN student b ON a.teamLeader=b.stuId WHERE a.teamName LIKE ? OR b.stuName LIKE ?"
    let params=[teamName,stuName]
    mysql.query(sql,params,function (err,rows) {
        if(err){
            res.status(500).send()
            return
        }
        res.status(200).send({
            result:'success',
            data:rows
        })
    })
})
/*全校团队列表-》详情*/
router.get('/show/detail',function(req,res,next){
    //接收参数，teamId
    //返回数据：teamName，teamIntro
    let teamId=req.query.teamId
    get_func.get_teamInfo(teamId).then(function (results) {
        res.status(200).send({
            retult:'success',
            data:results
        })},function (err) {
            console.log(err)
            res.status(500).send({
                result:'error'
            })
        })
    })



module.exports=router
