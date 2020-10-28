var express = require('express');
var router = express.Router();
var mysql=require('../database')
const fs=require('fs')
// var multiparty = require('multiparty');
const formidable = require('formidable');
var fileConfig=require("../fileConfig")
// var form = new multiparty.Form({ uploadDir:fileConfig.basePath});
var sql_interface=require('../myInterface')
var sql_func=new sql_interface();
var get_interface=require('../getInterface')
var get_func=new get_interface()
var up_interface=require('../updateInterface')
var up=new up_interface()
var insert_interface=require('../insertInterface');
const { reject } = require('async');
var ins=new insert_interface()
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/password',function (req,res,next) {
    let stuId=req.session.stuId
    let password=req.body.password
  if(stuId===undefined||password==undefined){
    console.log('stuId',stuId)
    console.log('password',password)
    res.status(500).send()
    return
  }
    up.password(password,stuId).then(results=> {
      console.log(results)
      res.status(200).send({
        result: 'success'
      })
    }).catch(err=>{
      console.log(err)
      res.status(500).send()
    })
})
router.post('/information',function (req,res,next) {
  if(!req.session.stuId)
  {
    res.status(500).send({
      result:'error'
    })
    return
  }
  let stuNum=req.body.stuNum
  let stuName=req.body.stuName
  let Class=req.body.class
  let phoneNum=req.body.phoneNum
  let QQ=req.body.QQ
  let email=req.body.email
  let data={stuNum,stuName,class:Class,phoneNum,QQ,email}
  let sql=sql_func.update('student',data,{stuId:req.session.stuId})
  console.log(sql)
  mysql.query(sql[0],sql[1],function (err,rows) {
    if(err){
      console.log(err)
      res.status(500).send({
        result:'error'
          }
      )
    }
    res.status(200).send({
      result:'success'
    })
  })
})

/*c创建团队*/
router.post('/create_team',function (req,res,next) {
  //创建团队-》在学生团队表插入信息
  let stuId=req.session.stuId
  if(!stuId&&stuId!=0){
    res.status(500).send()
    return
  }
  let teamName=req.body.teamName
  let teamIntro=req.body.teamIntro

  get_func.get_teamName(teamName).then(function (results) {
    if(results){
        throw 1
    }
   return  new Promise((resolve,reject) => {
      let data = {teamName, teamLeader: stuId, teamIntro}
      let sql = sql_func.insert('team', data)
      //创建团队
      mysql.query(sql[0], sql[1], function (err, rows) {
        err && reject(err)
        resolve(rows)
      })
    })
  }).then(function (results) {
    //接下来创建学生团队表信息,需要再次查询创建的队伍获得的teamId
    return get_func.get_teamId_create(stuId,teamName)
  }).then((results)=>{
   // console.log(results)
    let data={stuId,teamId:results.teamId,leader:1,isPass:1,Role:"队长"}
    let sql=sql_func.insert('stu_team',data)
    mysql.query(sql[0],sql[1],function (err,rows) {
      if(err){
        console.log(err)
        res.status(500).send({
          result:'error'
        })
        return
      }
      res.status(200).send({
        result:'success'
      })
    })
  }).catch(err=>{
    console.log(err)
    if(err===1){
      res.status(200).send({
        result:'exist'
      })
      return
    }
    res.status(500).send({
      result:'error'
    })
  })
})

/*团队管理*/
//参与的团队
router.get('/manage',function(req,res,next) {
  //根据session中保存的stuId从学生团队表获取（Role,IsPass），从团队中获取（teamName）
  //两表的关联:teamId
  let stuId=req.session.stuId
  if(!stuId&&stuId!=0){
    res.status(500).send({
      result:'error'
    })
    return
  }
  let akeys=['Role','IsPass']
  let bkeys=['teamId','teamName']
  let condition_on={teamId:'teamId'}
  let condition_where={stuId}
  let sql=sql_func.query_multiple('stu_team','team',akeys,bkeys,condition_on,condition_where)
  sql[0]=sql[0]+" AND stu_team.IsPass !=2 AND stu_team.Role!='个人'"
  console.log(sql)
  mysql.query(sql[0],sql[1],function (err,rows) {
    if(err){
      res.status(500).send({
        result:'error'
      })
      return
    }
    //为申请状态记录
    for(let i in rows){
      if(rows[i].IsPass===0)
        rows[i].Passtatus="已申请"
      if(rows[i].IsPass===1)
        rows[i].Passtatus="已通过"
    }

    console.log(rows)
    res.status(200).send({
      result:'success',
      data:rows
    })

  })


})
router.get('/manage/detail',function (req,res,next) {

  //团队表信息（teamId，teamName,teamIntro）
  //队员列表:学生团队表-》学生表（stuName,stuNum）
  //逻辑：先查团队表信息，在进行多表联查
  let teamInfo=null       //团队表信息
  let members=null        //队员列表
  let teamId=req.query.teamId
  get_func.get_teamInfo(teamId).then(function (results) {
    teamInfo=results
    //查询队员列表信息
    return get_func.get_teamMember1(teamId)
  }).then(function (results) {
    members=results
    res.status(200).send({
      result:'success',
      teamInfo,
      members
    })
  }).catch(err=>{
    console.log(err)
    res.status(500).send({
      result:'error'
    })
  })
})

/*申请加入团队*/
router.post('/applyToteam',function (req,res,next) {
  //逻辑：先在学生团队表中查找有无stuId且teamId已存在的记录
  let stuId=req.session.stuId
  if(!stuId&&stuId!=0){
    res.status(500).send()
    return
  }
  let teamId=req.body.teamId
  get_func.get_stuId_teamId(stuId,teamId,['*']).then(function (results) {
    //在学生团队表中插入新数据，
    //存在数据，返回错误

    if(results){
      //存在申请过的记录但被拒绝过，那么更新他的isPass状态
      if(results.IsPass===2){

        return  up.stuIsPass(0,stuId,teamId)
      }
       else{
         throw 1
       }
    }

    return ins.stu_team(stuId,teamId)
  }).then(results=>{
    console.log(results)
    res.status(200).send({
      result:'success'
    })
  }).catch(err=> {
    console.log(err)
    if(err===1){
      res.status(200).send({
        result:'exist'
      })
      return
    }
    res.status(500).send({
      result:'error'
    })
  })

})


/*显示团队下申请的人*/
router.get('/teamApplyment',function (req,res) {
  let teamId=req.query.teamId
  if(teamId===undefined){
    res.status(500).send()
    return
  }
  get_func.get_teamApplyment(teamId,['*']).then(results=>{
    res.status(200).send({
      result:'success',
      data:results
    })
  }).catch(err=>{
    console.log(err)
    res.status(500).send()
  })

})
/*管理团队申报！！！*/
router.post('/manageApply',function (req,res) {
  //逻辑：先检查是有没有这个申请，再对某学生进行操作
  let leaderstuId=req.session.stuId
  let teamId=req.body.teamId
  let stuId=req.body.stuId
  let passState=req.body.passState
  let ps={'Pass':1,'reject':2}
  if(passState===undefined||teamId===undefined){
    res.status(500).send()
    return
  }
  let IsPass=ps[passState]
  get_func.get_stuId_teamId(stuId,teamId,['*']).then(results=>{
    console.log("审批",results)
    if(!results){
      throw 2
   }
    // if(results.leader==false){
    //   throw 1
    // }

  return up.stuIsPass(IsPass,stuId,teamId)
  }).then(results=>{
    console.log(results)
    res.status(200).send({
      result:'success'
    })
  }).catch(err=>{
    console.log(err)
    if(err===2){
      res.status(200).send({
          result:'null'
      })
      return
  }
    // if(err===1){
    //   res.status(200).send({
    //     result:'notleader'
    //   })
    //   return
    // }
    res.status(500).send()
  })
})

/*显示我创建的团队（我是队长）*/

router.get('/myteams',function (req,res,next) {
  console.log(req.session)
  console.log(req.session.stuId)
  let stuId=req.session.stuId
  let teams=null
  if(!stuId&&stuId!=0){
    res.status(500).send({
      result:'error'
    })
    return
  }
  get_func.get_myteams(stuId).then(function (results) {
    psArr=[]
    teams=results
    for(let i in results){
      psArr.push(get_func.get_members_sum(results[i].teamId))
    }
    Promise.all(psArr).then(values=>{
      for(i in teams){
        teams[i].sum=values[i].sum
      }
      console.log(teams)
      res.status(200).send({
        result:'success',
        data:teams
      })
    }).catch(err=>{
      console.log(err)
      res.status(500).send()
    })

  },function (err) {
    console.log(err)
    res.status(500).send({
      result:'error'
    })
  })
})

/*个人报名*/
/*找到个人的学生团队表数据
* 在竞赛团队中找是否有重复
* 若重复且被拒绝，则更新
* 若重复但没有被拒绝，则return
* 若不重复
* 就插入一条新数据
* */
router.post('/PapplyToComp',function (req,res) {
  let stuId=req.session.stuId
  let CompId=req.body.CompId  //报名的竞赛Id
  if(!stuId&&stuId!=0){
    res.status(500).send()
    return
  }
  let stuteam=null
  let teamId=null
  get_func.find_personalstuteam(stuId).then(st=>{
    stuteam=st
    teamId=stuteam.teamId
    return  get_func.get_teamcompetion(teamId,CompId)
  }).then(function (results) {
    if(results){
      if(results.IsPass===2)
      {
        return up.teamcompIsPass(0,teamId,CompId)
      }
      throw  1
    }
    //不存在的话，插入新数据
    let submitTime=new Date()
    let IsPass=0
    let data={teamId,CompId,submitTime,IsPass}
    return ins.teamcompetion(data)
  }).then(results=>{
    console.log(results)
    res.status(200).send({
      result:'success'
    })
  }).catch(err=>{
    console.log(err)
    if(err===1){
      res.status(200).send({
        result:'exist'
      })
      return
    }

    res.status(500).send({
      result:'error'
    })
  })

})
/*给自己的团队报名*/
router.post('/myteams/applyToComp',function (req,res,next) {
  //逻辑：查团队竞赛表有无重复数据=》插入数据
  let CompId=req.body.CompId  //报名的竞赛Id
  let teamId=req.body.teamId  //报名的队伍Id
  if(teamId===undefined||CompId===undefined)
  {
    res.status(500).send()
    return
  }
  let members=null
  let limit=null
  get_func.get_members_sum(teamId).then(results=>{
    members=results.sum
    return get_func.get_members_limit(CompId)
  }).then(results=>{
    limit=results.personNum
    if(members>limit){
      throw 2
    }
    return  get_func.get_teamcompetion(teamId,CompId)
  }).then(function (results) {
    if(results){
        if(results.IsPass===2)
        {
          return up.teamcompIsPass(0,teamId,CompId)
        }
        throw  1
    }
    //不存在的话，插入新数据
    let submitTime=new Date()
    let IsPass=0
    let data={teamId,CompId,submitTime,IsPass}
    return ins.teamcompetion(data)
  }).then(results=>{
    console.log(results)
    res.status(200).send({
      result:'success'
    })
  }).catch(err=>{
    console.log(err)
    if(err===1){
      res.status(200).send({
        result:'exist'
      })
      return
    }
  if(err===2){
    res.status(200).send({
      result:'over'
    })
    return
  }
    res.status(500).send({
      result:'error'
    })
  })
})

/*我的竞赛*/
/*
未开始：0
报名中：1
进行中：2
已结束：3
* */
router.get('/myComp',function (req,res,next) {
  //逻辑：我参与的竞赛团队对应的竞赛
  //通过学生竞赛表已通过的teamId对应团队竞赛表的teamId
  //团队竞赛表的CompId对应竞赛表的CompId
  let page=req.query.page||1
  let size=req.query.size||5
  page=parseInt(page)
  size=parseInt(size)
  let limit={
    'start':(page-1)*size,
    'end':size
  }
  //console.log('status: '+req.query.status)
  if(req.query.status===undefined)
  {
    res.status(500).send({
      'result':'error'
    })
    return
  }
  let status=parseInt(req.query.status)
  let stuId=req.session.stuId
  console.log(stuId)
  if(!stuId&&stuId!=0){
    res.status(500).send()
    return
  }
  let data=null
  let Sum=null
  get_func.myComps(stuId,status).then(results=>{
    data=results
    return get_func.myCompsSum(stuId,status)
  }).then(sum =>{
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

/*题目列表*/
router.get('/showTopic',function (req,res) {
  let CompId=req.query.CompId
  let keys=['questionId','questionNum','questionName']
  let condition={CompId}
  let sql=sql_func.query_c('question',keys,condition)
  mysql.query(sql[0],sql[1],function (err,rows) {
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

/*题目列表*/
router.get('/showMyTopic',async (req,res)=>{
  let CompId=req.query.CompId
  let stuId=req.session.stuId

  try{
    let rows=await get_func.get_myTopics(stuId,CompId)
    res.status(200).send({
      result:'success',
      data:rows
    })
  }catch(err){
    console.log(err)
    res.status(500).send();
  }
  // let keys=['questionId','questionNum','questionName']
  // let condition={CompId}
  // let sql=sql_func.query_c('question',keys,condition)
  // mysql.query(sql[0],sql[1],function (err,rows) {
  //   if(err){
  //     res.status(500).send()
  //     return
  //   }

  //   res.status(200).send({
  //     result:'success',
  //     data:rows
  //   })

  // })
})
/*题目详情*/
router.get('/showTopic/detail',function (req,res) {
  let questionId=req.query.questionId
  if (!questionId){
    res.status(500).send()
    return
  }
  let keys=['questionIntro','fileName','fileDesc']
  let condition={questionId}
  let sql=sql_func.query_c('question',keys,condition)
  mysql.query(sql[0],sql[1],function (err,rows) {
    if(err){
      console.log(err)
      res.status(500).send()
      return
    }
    res.status(200).send({
      result:'success',
      data:rows[0]
    })
  })


})
/*比赛结果*/
router.get('/showResult',function (req,res) {
  
    let compId=parseInt(req.query.CompId)
    if(isNaN(compId)){
        res.status(500).send()
        return
    }
    let condition={compId}
    let keys=['teamName','Score','`rank`','teamMembersName']
  let sql=sql_func.query_c('complist',keys,condition)
  sql[0]=sql[0]+" ORDER BY `rank` "
  console.log(sql)
  mysql.query(sql[0],sql[1],function (err,rows) {
    if(err){
      console.log(err)
      res.status(500).send();
      return;
    }
 //   console.log("continueedddddsx")
    res.status(200).send({
      result:'success',
      data:rows
    })
  })
})
/*退出团队*/
router.post('/quit_team',function (req,res) {
    let stuId=req.session.stuId
    let teamId=req.body.teamId
    if(!stuId||!teamId){
        res.status(500).send()
        return
    }
    get_func.get_stuId_teamId(stuId,teamId,['stuId','leader']).then(results=>{

        if(!results){
           throw 2
        }
        if(results.leader===1){
          throw 3
        }
       return new Promise((resolve,reject) =>{
           let stuId=results.stuId
            let sql=sql_func.delete('stu_team',{stuId,teamId})

            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
       } )
    }).then(results=>{
      console.log("退出团队",results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        if(err===2){
            res.status(200).send({
                result:'null'
            })
            return
        }
        if(err===3){
          res.status(200).send({
            result:'isLeader'
          })
          return
        }
        res.status(500).send()
    })

})
router.post("/uploadWorks",(req,res)=>{
  const form = formidable({ multiples: true,uploadDir:fileConfig.basePath });
 
    form.parse(req, async(err, fields, files) => {
      try{
      if(err){
        throw err;
      }
      console.log(fields);
      if(!req.session.stuId||!fields.teamCompId||!fields.workName||!fields.question){
        throw '参数错误'
      }
      console.log(files)
      let tasks=[];
      let fileDescArray=[];
      let fileNameArray=[];
      if(files['file'].length){
        files['file'].forEach((item)=>{
        let p=new Promise((resolve,reject)=>{
          fs.rename(item.path,item.path+item.name,(err)=>{
            fileDescArray.push(item.path+item.name);
            fileNameArray.push(item.name)
            err&&reject(err)
            resolve();
          })
        })
        tasks.push(p)
      })

    }else{
      let item=files['file']
      let p=new Promise((resolve,reject)=>{
        fs.rename(item.path,item.path+item.name,(err)=>{
          fileDescArray.push(item.path+item.name);
          fileNameArray.push(item.name)
          err&&reject(err)
          resolve();
        })
      })
      tasks.push(p)
    }
        let submitId=req.session.stuId;
        
        let filePath=fileDescArray.join(';');
        let fileName=fileNameArray.join(';');
        let teamCompId=fields.teamCompId;
        let workName=fields.workName;
        let question=fields.question;
        let submitTime=new Date();
        let introduction=fields.introduction;
        let fileTasks=Promise.all(tasks);
        let data={submitId,filePath,fileName,teamCompId,workName,question,submitTime,introduction}
        let rows=await ins.work(data);
        console.log(rows);
        res.status(200).send({
          status:'success',
          data:rows
        })
      }catch(err){
        console.log(err)
        res.status(500).send();
      }
    });
})
module.exports = router;
