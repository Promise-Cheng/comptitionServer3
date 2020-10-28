var express = require('express');
var router = express.Router();
var mysql=require('../database')
// var multiparty=require('multiparty')
var teacherInterface=require('../teacherInterface')
var tc=new teacherInterface()
var fs=require('fs')
var moment=require('moment')
var fileConfig=require("../fileConfig")
/*登录*/
router.post('/login',function (req,res) {
        let teaId=req.body.teaId
        let password=req.body.password
        if(teaId===undefined||password===undefined){
            res.status(500).send()
            return
        }
        let info
        tc.get_confirm(['*'],teaId,password).then(results=>{
            if(!results){
                throw 1
            }
            info=results
            return tc.get_CompTypebyId(info.CompTypeid)
        }).then(results=>{
            info.CompName=results.CompName

            req.session.teaId=info.teaId
            req.session.teaName=info.teaName
            console.log( req.session.teaName+'登录')
            res.status(200).send({
                result:'success',
                data:info
            })
        }).catch(err=>{
            if(err===1){
                res.status(200).send({
                    result:'null',
                })
                return
            }
            console.log(err)
            res.status(500).send()
        })
})
/*注册*/

router.post('/regist',function (req,res) {
    let teaId=req.body.teaId
    let password=req.body.password
    let CompTypeid=req.body.CompTypeid
    let phoneNum=req.body.phoneNum
    let teaName=req.body.teaName

    if(teaId===undefined||password===undefined|| CompTypeid===undefined||phoneNum===undefined||teaName===undefined){
        res.status(500).send()
        console.log(teaId+' '+password+' '+CompTypeid+' '+' '+phoneNum+' '+teaName)
        return
    }

    tc.get_info(['*'],teaId).then(results=>{
        if(results){
            throw 1
        }
        /*不存在则插入新数据*/
        let data={teaId,password,CompTypeid,phoneNum,teaName}
        return tc.insert_info(data)
    }).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        if(err===1){
            res.status(200).send({
                result:'exist'
            })
            return
        }
        console.log(err)
        res.status(500).send()
    })


})
router.get('/CompTypes',function (req,res) {
    tc.get_CompTypes().then(results=>{
        res.status(200).send({
            result:'success',
            data:results
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
/*发布竞赛*/
router.post('/submit',function (req,res) {
    let compName=req.body.compName
    let CompTypeid=req.body.CompTypeid
    let obstartTime=req.body.startTime
    let obendTime=req.body.endTime
    let compIntro=req.body.compIntro
    let personNum=req.body.personNum
    let teacher=req.session.teaName
    let startTime=new Date()

    let compStateID=1
    if(compName===undefined||CompTypeid===undefined||compStateID===undefined||obstartTime===undefined||obendTime===undefined||personNum===undefined||teacher===undefined){
        let temp={compName,CompTypeid,obstartTime,obendTime,compIntro,personNum,compStateID,startTime,teacher}
        console.log(temp)
        res.status(500).send()
        return
    }
   startTime=moment(startTime).format("YYYY-MM-DD HH:mm:ss")
    let data={compName,CompTypeid,obstartTime,obendTime,compIntro,personNum,compStateID,startTime,teacher}
    tc.insert_comp(data).then(results=>{

        return tc.get_comp(data)
    }).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success',
           CompId:results[0].CompId
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

/*信息管理*/
router.post('/manageInfo',function (req,res) {
    let teaId=req.session.teaId
    let teaName=req.body.teaName
    let phoneNum=req.body.phoneNum
    let password=req.body.password
    if(teaName===undefined||phoneNum===undefined||password===undefined||teaId===undefined){
        res.status(500).send()
        return
    }
    let data={teaName,phoneNum,password}
    let condition={teaId}
    tc.updata_info(data,condition).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        res.status(500).send()
    })



})

/*竞赛管理*/
router.get('/manageComp',function (req,res) {
    let teaId=req.session.teaId
    if(teaId===undefined){
        res.status(500).send()
        return
    }
    let page=req.query.page||1
    let size=req.query.size||5
    page=parseInt(page)
    size=parseInt(size)
    let limit={
        'start':(page-1)*size,
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
    let data=null
    let Sum=null
    let CompTypeid=null
    tc.get_info(['CompTypeid'],teaId).then(results=>{
        CompTypeid=results.CompTypeid
        if(!results.CompTypeid){
            throw 1
        }
        return tc.manageComps(status,CompTypeid,limit)
    }).then(results=>{
        data=results
        return tc.get_CompTypeSum(CompTypeid,status)
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
/*竞赛管理=》竞赛信息修改*/
router.post('/manageComp/updateInfo',function (req,res) {
    let CompId=req.body.CompId
    let compName=req.body.compName
    let CompTypeid=req.body.CompTypeid
    let obstartTime=req.body.startTime
    let obendTime=req.body.endTime
    let compIntro=req.body.compIntro
    let personNum=req.body.personNum
   // let compStateID=req.body.compStateID
    if(compName===undefined||CompTypeid===undefined||obstartTime===undefined||obendTime===undefined||personNum===undefined||CompId===undefined||compIntro===undefined){
        res.status(500).send()
        return
    }
    let data={compName,CompTypeid,obstartTime,obendTime,compIntro,personNum}
    let condition={CompId}
    tc.update_CompInfo(data,condition).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
/*竞赛管理=》管理团队*/
router.get('/manageTeam',function (req,res) {
    let CompId=req.query.CompId
    let compStateID
    if(CompId===undefined){
        res.status(500).send()
        return
    }

    tc.get_compStateID(CompId).then(results=>{
        compStateID=results
        return tc.get_teambyComp(['teamId','teamName'],CompId)
    }).then(results=>{
        let ps=['未通过','通过','已拒绝']
        for(let i in results){
            results[i].PassState=ps[results[i].IsPass]
        }
        res.status(200).send({
            result:'success',
            compStateID,
            data:results
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})


router.get('/manageTeam/detail',function (req,res){
    let teamId=req.query.teamId
    if(teamId===undefined){
        res.status(500).send()
        return
    }
    tc.get_teamMember1(teamId).then(results=>{
     res.status(200).send({
         result:'success',
         data:results
     })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })

})
/*老师通过队伍或者拒绝队伍*/
router.post('/Passteam',function (req,res) {
    let passState=req.body.passState
    let teamCompId=req.body.teamCompId          //更改为teamCompId
    let ps={'Pass':1,'reject':2}
    if(passState===undefined||teamCompId===undefined){
        res.status(500).send()
        return
    }
    let IsPass=ps[passState]
    console.log("teamCompId:"+teamCompId)
    tc.update_teamState(teamCompId,IsPass).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })

})
/*批量管理*/
router.post('/Passteams',function (req,res) {
    let passState=req.body.passState
    let teamCompId=req.body.teamCompId.split(',')
    console.log(teamCompId)
    let ps={'Pass':1,'reject':2}
    if(passState===undefined||teamCompId===undefined){
        res.status(500).send()
        return
    }
    let IsPass=ps[passState]
    let pArr=[]
    for(let  i  in teamCompId){
        pArr.push(tc.update_teamState(teamCompId[i],IsPass))
    }
    Promise.all(pArr).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

/*获取竞赛下已通过申请的团队*/
router.get('/getPassedteam',function (req,res) {
    let CompId=req.query.CompId
    if(CompId===undefined){
        res.status(500).send()
        return
    }
    tc.get_Passedteam(CompId).then(results=>{

        console.log(results)
        res.status(200).send({
            result:'success',
            data:results
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })

})

/*查看题目*/

/*给分页面，显示作品以及对应分数*/
router.get('/getWorks',function (req,res) {
    let teamCompId=req.query.teamCompId
    let totalScore=0
    tc.get_teamcompetion(teamCompId).then(teamcompetion=>{
        return tc.get_complist(teamcompetion.teamId,teamcompetion.CompId)

    }).then(complist=>{
        if(complist){
            totalScore=complist.Score
        }

        return tc.get_WorksWithQuestion(teamCompId)
    }).then(results=>{

        console.log(results)
        res.status(200).send({
            result:'success',
            data:results,
            totalScore
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
router.post('/GiveScore',function (req,res) {
    let teamCompId=req.body.teamCompId
    let workId=req.body.workId
    let Score=req.body.Score
    let teamId
    let CompId
    let totalScore
    let teamName
    /*逻辑：获得请求时更新对应作品的分数，然后更新对应榜单中竞赛团队的总分数，若不存在则插入一条竞赛团队的榜单信息*/
    /*插入了一条新信息后，需要对榜单进行排序操作*/
    tc.update_Score(workId,Score).then(results=>{
        console.log(results)
        /*计算总分*/
        return tc.get_totalScore(teamCompId)


    }).then(result=>{
        totalScore=result.totalScore
        console.log(totalScore)
        /*获取teamcompetion的teamId以及CompId*/
        return tc.get_teamcompetion(teamCompId)
    }).then(teamcompetion=>{
        console.log(teamcompetion)
        teamId=teamcompetion.teamId
        CompId=teamcompetion.CompId
        return tc.get_complist(teamId,CompId)
    }).then(complist=>{

        if(complist){
            console.log(complist)
            complist.Score=totalScore
            return tc.update_complist(complist)
        }
        else{
          return   tc.get_team(teamId).then(team=>{
                console.log(team)
                teamName=team.teamName
              console.log('teamNmae'+teamName)
                return tc.get_teamMember(teamId).then(students=>{

                    let Names=[]
                    let IDS=[]
                    for(let i in students){
                        Names.push(students[i].stuName)
                        IDS.push(students[i].stuId)
                    }
                    let complist={}
                    complist.teamMembersName=Names.join(';')
                    complist.teamMembersId=IDS.join(';')
                    complist.Score=totalScore
                    complist.compId=CompId
                    complist.teamId=teamId
                    complist.teamName=teamName
                    console.log(complist)
                    tc.insert_complist(complist)
                })
            })

        }
    }).then(results=>{
        return tc.sort_complist(CompId)
    }).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

/*预生成榜单*/
router.get('/preGrade',function (req,res) {
    let compId=req.query.CompId
    let rank=1
    let pArr=[]
    tc.get_complistOrder(compId).then(complists=>{
        if(complists[0]==null){
            return  tc.addtocomplist(compId).then(results=>{
                 console.log('After addtocomplist'+results)
                 return tc.sort_complist(compId)
             }).then(results=>{
                 console.log('After sort'+results)
                return tc.get_complistOrder(compId)
             })
        }else{
           return tc.sort_complist(compId).then(results=>{
               console.log('After sort'+results)
               return tc.get_complistOrder(compId)
           })
        }
    }).then(complists=>{
        res.status(200).send({
            result:'success',
            data:complists
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })

})

/*添加成绩*/
router.post('/addComplist',function (req,res) {
    let compId=req.body.CompId
    let teamName=req.body.teamName
    let teamMembersName= req.body.teamMembersName
    let tips=req.body.tips
    let Score=req.body.Score
    let complist=null
    //console.log("ssss:"+req.body.teamId)
    if(req.body.teamId===undefined||req.body.teamId==="")
    {
        complist={compId,teamName,teamMembersName,tips,Score}
    }else{
        let teamId=parseInt(req.body.teamId)
        complist={compId,teamName,teamMembersName,tips,Score,teamId}
    }

    tc.insert_complist(complist).then(results=>{
        return tc.sort_complist(compId)
    }).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
/*重新生成榜单*/
router.post('/resetComplist',function (req,res) {
    let compId=req.body.CompId
    tc.delete_complists(compId).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})
/*修改榜单信息*/
router.post('/Changecomplist',function (req,res) {
    let CompListId=req.body.CompListId
    let Score=req.body.Score
    let tips=req.body.tips
    complist={Score,tips,CompListId}
    console.log(complist)
    tc.update_complist(complist).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

/*改变竞赛状态*/
router.post('/ChangeCompState',function (req,res) {
    let compStateID=parseInt(req.body.compStateID)
    let CompId=req.body.CompId
    if(compStateID===undefined||CompId===undefined){
        res.status(500).send()
        return
    }
    tc.update_CompState(CompId,compStateID).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        switch (err) {
            case 1:
                res.status(200).send({
                    result:'error'
                })
                break;
            default:
                console.log(err)
                res.status(500).send()

        }
    })
})
/*递减竞赛状态*/
router.post('/ChangeCompStateMinus',function (req,res) {
    let compStateID=parseInt(req.body.compStateID)
    let CompId=req.body.CompId
    if(compStateID===undefined||CompId===undefined){
        res.status(500).send()
        return
    }
    tc.update_CompStateMinus(CompId,compStateID).then(results=>{
        res.status(200).send({
            result:'success'
        })
    }).catch(err=>{
        switch (err) {
            case 1:
                res.status(200).send({
                    result:'error'
                })
                break;
            default:
                console.log(err)
                res.status(500).send()

        }
    })
})

// router.post('/createTopic',(req,res)=>{

//     let form=new multiparty.Form()
//    form.uploadDir='uploads/'
//     form.maxFieldsSize=2*1024*1024


//     form.parse(req,function (err,fields,files) {
//             if(err){
//                 console.log('错误');
//                 msg.info = '上传失败';
//                 res.send(msg);
//                 return ;
//             }
//         //   console.log(req.body)
//         //console.log(fields)
//             let questionName=fields.questionName[0]
//             let questionIntro=fields.questionIntro[0]
//             let questionAnsw=fields.questionAnsw[0]
//             let CompId=parseInt(fields.CompId[0])
//               //  console.log(CompId)
//             console.log(files)
//             let f=files['null']
//         /*对文件名称进行处理，存入数据库*/
//         let fileNames=[]
//         let names=[]
//         for(let i in f){
//             fileNames.push(f[i].originalFilename)
//             names.push(f[i].originalFilename.substring(0,f[i].originalFilename.lastIndexOf('.')))
//         }
//         let fileDesc=fileNames.join(';')
//         let fileName=names.join(';')

//         tc.get_compTopicSum(CompId).then(results=>{
//             console.log(results)
//             let questionNum=results+1
//             let data={questionIntro,questionName,questionAnsw,CompId,fileDesc,fileName,questionNum}
//             console.log(data)
//             return tc.insert_ques(data)
//         }).then(results=>{
//             console.log(results)

//             //同步重命名文件名
//             for (let i in f) {
//                 fs.renameSync(f[i].path,form.uploadDir+f[i].originalFilename);
//             }
//             console.log('上传成功')
//             res.status(200).send({
//                 result:'success'
//             });
//         }).catch(err=>{
//             console.log(err)
//             res.status(500).send()
//         })

//     }

//     )


// })

/*获取某竞赛下所有的题目*/
router.get('/Topics',function (req,res) {
    let CompId=req.query.CompId
    if(CompId===undefined){
        res.status(500).send()
        return
    }
    let keys=['questionId','questionName','questionNum']
    let teamSum=0;

    tc.get_TeamSumByCompId(CompId).then(sum=>{
        teamSum=sum;
        return tc.get_Topics(CompId,keys)
    }).then(results=>{
        console.log(results)
        res.status(200).send({
            result:'success',
            data:results,
            teamSum
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

/*获取题目详情以及附加文件*/
router.get('/TopicDetail',function (req,res) {
    let questionId=req.query.questionId
    tc.get_TopicDetail(questionId).then(results=>{
        console.log(results)
        res.status(200).send({
            results:'success',
            data:results
        })
    }).catch(err=>{
        console.log(err)
        res.status(500).send()
    })
})

router.get('/downloadfile',function (req,res) {
    let savedPath=req.query.savedPath
    let realName=req.query.realName;
    // let basePath='./uploads/'
    let realPath=fileConfig.basePath+savedPath
    console.log(realPath)
    var size = fs.statSync(realPath).size;
    var f = fs.createReadStream(realPath);
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + realName,
        'Content-Length': size
    });
    f.pipe(res);
})
module.exports=router
