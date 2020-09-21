var express = require('express');
var router = express.Router();
var mysql=require('../database')
var moment=require('moment')

var sql_interface=require('../myInterface')
var sql_func=new sql_interface();
var get_interface=require('../getInterface')
var get_func=new get_interface()

/**
 * 最近的竞赛
 * 返回 竞赛id，竞赛名称，竞赛概要，竞赛事件，竞赛状态
 */
router.get("/latest",function(req,res){
 
    let size=req.query.size||5
    size=parseInt(size)
    let limit={
        'start':0,
        'end':size
    }
    if(req.query.status===undefined)
    {
        res.status(500).send({
            'result':'error'
        })
        return
    }
    let status=parseInt(req.query.status)
    get_func.LatestComps(status,limit).then(result=>{
        res.status(200).send({
            state:"success",
            data:result
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send({
            'result':'error'
        })
    })
})

/*显示报名中的竞赛*//*显示进行中的竞赛*//*显示已经结束的竞赛*/
/*
未开始：0 ||删除，无此项
报名中：1
进行中：2
已结束：3
* */
router.get('/show',function (req,res) {
    //查询数据：竞赛名称，指导老师，竞赛状态
    //查询条件，compstatusID
    console.log(req.query)
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
    //console.log('status: '+req.query.status)
    console.log(limit)
    if(req.query.status===undefined)
    {
        res.status(500).send({
            'result':'error'
        })
        return
    }
    let status=parseInt(req.query.status)
   get_func.Comps(status,limit).then(results=>{
       data=results
       return get_func.CompSum(status)
   }).then(sum=>{
       Sum=sum
       res.status(200).send({
           result:'success',
           data,Sum
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

   // let compStateID=parseInt(req.query.status)+6;
    let compName='%'+content+'%'
    let teacher='%'+content+'%'
    let TypeName=content
    let sql='SELECT a.CompId,a.compName,a.teacher,b.CompStateName,c.CompName '
        +' FROM competition a INNER JOIN compstatus b '
        +' ON a.compStateID=b.compStateID  '
        +'INNER JOIN  compcode c '
        +'ON a.CompTypeid=c.CompTypeid'
        +" WHERE (a.compName LIKE ? OR a.teacher LIKE ?) OR c.CompName=?"
    let params=[compName,teacher,TypeName]
   /* if(compStateID-6!==-1){
        sql=sql+" AND a.compStateID LIKE ?"
        params.push(compStateID)
    }*/
    console.log(sql)
    console.log(params)
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

/*竞赛详情页面*/
router.get ('/detail',function (req,res,next) {
    //返回竞赛名称、类型，起止时间、人数限制、指导老师、竞赛描述
    let CompId=req.query.CompId
    let akeys=['compName','obstartTime','obendTime','teacher','compIntro','personNum']
    let bkeys=['CompName']
    let condition={CompId:CompId}
    let sql=sql_func.query_multiple('competition','compcode',akeys,bkeys,{CompTypeid:'CompTypeid'},condition)
    mysql.query(sql[0],sql[1],function (err,rows) {
        if(err)
        {
            console.log(err)
            res.status(500).send(
                {
                    result:'error'
                }
            )
            return
        }
        rows[0].startTime=moment(rows[0].obstartTime).format("YYYY-MM-DD HH:mm:ss")
        rows[0].endTime=moment(rows[0].obendTime).format("YYYY-MM-DD HH:mm:ss")
        res.status(200).send({
            result:'success',
            data:rows[0]
        })

    })
})


module.exports=router
