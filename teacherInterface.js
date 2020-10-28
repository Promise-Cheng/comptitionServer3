var mysql=require('./database')
var sql_interface=require('./myInterface')
var sql_func=new sql_interface();
var moment=require('moment')
class teacherInterface{
    constructor(){}
    /**获取竞赛下参与队伍数量 */
    get_TeamSumByCompId(CompId){
        return new Promise((resolve,reject)=>{
            let sql="SELECT COUNT(*) as teamSum FROM teamcompetion tc WHERE tc.CompId=? AND tc.IsPass=1"
            let params=[CompId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                // rows=rows.filter((item)=>{
                //     return item.questionId!==null
                // })
                resolve(rows[0].teamSum)
            })
        })
        
    }
    /*获取竞赛下的题目列表*/
    get_Topics(CompId,keys){
        return new Promise((resolve, reject) => {

            let sql="SELECT q.questionId,q.questionName,q.questionIntro,COUNT(w.workId) as subWorkSum,COUNT(DISTINCT(tc.teamCompId)) subTeamSum FROM question q LEFT JOIN works w on q.questionId=w.question LEFT JOIN teamCompetion tc on w.teamCompId=tc.teamCompId WHERE q.CompId=? group by q.questionId"
            // let sql=sql_func.query_c('question',keys,{CompId})
            let params=[CompId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                // rows=rows.filter((item)=>{
                //     return item.questionId!==null
                // })
                resolve(rows)
            })

        })

    }
    get_compStateID(CompId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('competition',['compStateID'],{CompId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                if(rows[0]){
                    resolve(rows[0].compStateID)
                }else{
                    reject(null)
                }


            })
        })
    }
    /*获取某题目的详细信息*/
    get_TopicDetail(questionId){
        return  new Promise((resolve, reject) => {
            let sql=sql_func.query_c('question',['*'],{questionId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                let savedPath=rows[0].fileDesc.split(';')   //硬盘中保存的名称
                let realName=rows[0].fileName.split(';')     //实际名称，不带后缀
                let files={}       //文件列表： fileName:filePath 这里的path只多了类型后缀
                for(let i in savedPath){
                    if(!savedPath[i]||!realName[i]){
                        continue
                    }
                    files[realName[i]]=savedPath[i]
                }
                rows[0]['files']=files
                resolve(rows[0])

            })
        })
    }
    /*获取某竞赛下题目的数量*/
    get_compTopicSum(CompId){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as questionNum FROM question WHERE CompId=?'
            let param=[CompId]
            mysql.query(sql,param,function (err,rows) {

                err&&reject(err)
                resolve(rows[0].questionNum)
            })
        })
    }
    /*获取所有竞赛种类*/
    get_CompTypes(){
        return new Promise((resolve, reject) => {
            let sql='SELECT  CompTypeid,CompName FROM compcode'
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*更新团队申报的通过状态*/
    update_teamState(teamCompId,IsPass){
        return  new Promise((resolve, reject) => {
            let data={IsPass}
            console.log(data)
            let condition={teamCompId}
            let sql=sql_func.update('teamcompetion',data,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*账号密码验证*/
    get_confirm(keys,teaId,password){
        return new Promise((resolve,reject)=>{

            let condition={teaId,password}
            let sql=sql_func.query_c('teacher',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*获取管理的竞赛类型*/
    get_CompTypebyId(CompTypeid){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('compcode',['*'],{CompTypeid})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })

    }
    /*通过密码获取教师信息*/
    get_info(keys,teaId){
        return new Promise((resolve,reject)=>{

            let condition={teaId}
            let sql=sql_func.query_c('teacher',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*插入教师信息*/
    insert_info(data){
        return new Promise((resolve,reject)=>{
            let sql=sql_func.insert('teacher',data)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }

    /*插入竞赛信息*/
    insert_comp(data){
        return new Promise((resolve, reject)=>{
            let sql=sql_func.insert('competition',data)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*获取竞赛信息*/
    get_comp(data){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('competition',['*'],data)
            console.log(sql)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*插入题目信息*/
    insert_ques(data){
        return new Promise((resolve, reject) => {
            let sql=sql_func.insert('question',data)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*更新教师数据*/
    updata_info(data,condition){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('teacher',data,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    /*更新竞赛状态*/
    update_CompState(CompId,compStateID){
        return new Promise((resolve, reject) => {
            if(compStateID<=0||compStateID>=6)
            {
                reject(1)
                return
            }
            compStateID=compStateID+1
            let data={compStateID}
            let condition={CompId}
            let sql=sql_func.update('competition',data,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /**递减更新竞赛状态 */
    update_CompStateMinus(CompId,compStateID){
        return new Promise((resolve, reject) => {
            if(compStateID<=0||compStateID>=6)
            {
                reject(1)
                return
            }
            compStateID=compStateID-1
            let data={compStateID}
            let condition={CompId}
            let sql=sql_func.update('competition',data,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*g更新竞赛信息*/
    update_CompInfo(data,condition){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('competition',data,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*通过竞赛类型获得竞赛*/
    get_CompbyType(CompTypeid,limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.CompId,c.compName,c.obStartTime,c.obEndTime,c.compStateID,s.CompStateName'+
                ' FROM competition  c INNER JOIN compstatus s '+
                ' ON c.compStateID=s.compStateID '+
                ' WHERE c.CompTypeid=? '+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
          let params=[CompTypeid,limit.start,limit.end]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                for(let i in rows){
                    rows[i].startTime=moment(rows[i].obstartTime).format("YYYY-MM-DD")
                    rows[i].endTime=moment(rows[i].obendTime).format("YYYY-MM-DD")
                }
                resolve(rows)
            })
        })
    }
    get_ApplyCompbyType(CompTypeid,limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.CompId,c.compName,c.obStartTime,c.obEndTime,c.compStateID,s.CompStateName'+
                ' FROM competition  c INNER JOIN compstatus s '+
                ' ON c.compStateID=s.compStateID '+
                ' WHERE c.CompTypeid=? AND s.compStateID=1'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            let params=[CompTypeid,limit.start,limit.end]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                for(let i in rows){
                    rows[i].startTime=moment(rows[i].obstartTime).format("YYYY-MM-DD")
                    rows[i].endTime=moment(rows[i].obendTime).format("YYYY-MM-DD")
                }
                resolve(rows)
            })
        })
    }
    get_RunningCompbyType(CompTypeid,limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.CompId,c.compName,c.obStartTime,c.obEndTime,c.compStateID,s.CompStateName'+
                ' FROM competition  c INNER JOIN compstatus s '+
                ' ON c.compStateID=s.compStateID '+
                ' WHERE c.CompTypeid=? AND (s.compStateID=2 OR s.compStateID=3)'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            let params=[CompTypeid,limit.start,limit.end]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                for(let i in rows){
                    rows[i].startTime=moment(rows[i].obstartTime).format("YYYY-MM-DD")
                    rows[i].endTime=moment(rows[i].obendTime).format("YYYY-MM-DD")
                }
                resolve(rows)
            })
        })
    }
    get_EndCompbyType(CompTypeid,limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.CompId,c.compName,c.obStartTime,c.obEndTime,c.compStateID,s.CompStateName'+
                ' FROM competition  c INNER JOIN compstatus s '+
                ' ON c.compStateID=s.compStateID '+
                ' WHERE c.CompTypeid=? AND (s.compStateID=4 OR s.compStateID=5)'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            let params=[CompTypeid,limit.start,limit.end]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                for(let i in rows){
                    rows[i].startTime=moment(rows[i].obstartTime).format("YYYY-MM-DD")
                    rows[i].endTime=moment(rows[i].obendTime).format("YYYY-MM-DD")
                }
                resolve(rows)
            })
        })
    }
    /*管理的竞赛*/
    manageComps(status,CompTypeid,limit){
        switch (status) {
            case -1:return this.get_CompbyType(CompTypeid,limit);
                break;
            case 0:return this.get_CompbyType(CompTypeid,limit);
                break;
            case 1:return this.get_ApplyCompbyType(CompTypeid,limit);
                break;
            case 2:return this.get_RunningCompbyType(CompTypeid,limit);
                break;
            case 3:return this.get_EndCompbyType(CompTypeid,limit);
                break;

    }
    }
    /*获取某竞赛类别下的总记录数*/
    get_CompTypeSum(CompTypeid,status){
        return new Promise((resolve, reject) => {
            let sql='SELECT count(*) as Sum FROM competition WHERE CompTypeid=?'
            if(status){
                switch (status) {
                    case  1:sql=sql+' AND compStateID=1';
                        break;
                    case  2:sql=sql+' AND (compStateID=2 OR compStateID=3)';
                        break;
                    case  3:sql=sql+' AND (compStateID=4 OR compStateID=5)';
                        break;
                }
            }
            console.log(sql)
            let params=[CompTypeid]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    /*通过竞赛获取队伍*/
    get_teambyComp(keys,CompId,limit){
        return new Promise((resolve, reject) => {
            let bkeys=keys
            let akeys=['IsPass','teamCompId']
            let on={teamId:'teamId'}
            let condition={CompId}
            let sql=sql_func.query_multiple('teamcompetion','team',akeys,bkeys,on,condition,limit)
          //  sql[0]=sql[0]+' AND IsPass!=2'
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }

    /*获取竞赛下已经通过的队伍,以及返回提交作品状况*/
    get_Passedteam(CompId){
        return new Promise((resolve, reject) => {
          let sql='SELECT a.teamId,a.teamName,b.teamCompId,COUNT(c.workId) as workSum,COALESCE(SUM(c.Score),0) as totalScore FROM team a INNER JOIN teamcompetion b ON a.teamId=b.teamId LEFT JOIN works c ON b.teamCompId=c.teamCompId'+
              ' WHERE b.CompId=? AND b.IsPass=1 group by a.teamId,a.teamName,b.teamCompId'
            let params=[CompId]
            mysql.query(sql,params, function (err, rows) {
                err && reject(err)

                for(let i in rows){
                    if(rows[i].workSum===0){
                        rows[i].workState='未提交'
                    }
                    if(rows[i].workSum>0){
                        rows[i].workState='已提交'
                    }

                }
                resolve(rows)
            })
        })
    }
    /*获取一个竞赛团队下的作品及其对应分数*/
    get_Works(teamCompId){
        return new Promise((resolve, reject) => {
            let keys=['workId','workName','Score']
            let sql=sql_func.query_c('works',keys,{teamCompId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /**2020/10/28 */
    get_WorksWithQuestion(teamCompId){

        return new Promise((resolve, reject) => {
            let sql='SELECT w.workId,w.workName,w.Score,w.introduction,q.questionId,q.questionNum,q.questionName,q.questionIntro FROM works w '
            +' INNER JOIN question q ON w.question=q.questionId WHERE w.teamCompId=?;'
            let params=[teamCompId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    
    }
    /*计算总分*/
    get_totalScore(teamCompId){
        return new Promise((resolve, reject) =>{
            let sql='SELECT SUM(Score) as totalScore FROM works WHERE teamCompId=?'
            let params=[teamCompId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*更新作品分数*/
    update_Score(workId,Score){
        return new Promise((resolve, reject) => {
            let sql=sql_func.update('works',{Score},{workId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }


    /*通过teamCompId获得teamcompetion信息*/
    get_teamcompetion(teamCompId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('teamcompetion',['*'],{teamCompId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*插入complist*/
    insert_complist(complist){
        return new Promise((resolve, reject) => {
            let sql=sql_func.insert('complist',complist)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }

    /*根据teamId与CompId获得榜单中的*/
    get_complist(teamId,compId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('complist',['*'],{teamId,compId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*给榜单排序*/
    sort_complist(compId){
        return new Promise((resolve, reject) => {
            this.get_complistOrder(compId).then(complists=>{
                //获取数据库中的complists，以分数降序

                let rank=1;
                let pArr=[]

                for(let i in complists){
                    if(i==0) {
                        complists[i].rank = 1
                        pArr.push(this.update_complist(complists[i]))
                    }else{
                        //相同分数则排名相同
                        if(complists[i].Score!==complists[i-1].Score){
                            rank=rank+1
                        }
                        complists[i].rank=rank
                        console.log(complists[i])
                        pArr.push(this.update_complist(complists[i]))
                    }
                }
                Promise.all(pArr).then(results=>{
                    console.log('sort_complist:')
                    console.log(results)
                    resolve(results)
                    }).catch(err=>{
                        console.log(err)
                        reject(err)
                })
            })
        })
    }
    /*删除某竞赛下的榜单*/
    /*将竞赛下所有的队伍的总成绩生成complist插入表中
    * 从ComId再团队竞赛表中找到所有teamCompId
    * 每一个的teamCompId匹配的作品的总分生成complist，并插入表中*/
    addtocomplist(compId){

        return new Promise((resolve, reject) => {
            let sql='SELECT tc.teamCompId,tc.teamId,tc.CompId,t.teamName,SUM(w.Score) as totalScore '
            +' FROM teamcompetion tc '
            +' INNER JOIN team t  '
            +' ON tc.teamId=t.teamId '
            +' Left JOIN works w '
            +' ON tc.teamCompId=w.teamCompId '
            +' WHERE  tc.CompId=? AND tc.IsPass=1 '
            +' GROUP BY tc.teamCompId '
            let params=[compId]
            mysql.query(sql,params,(err,rows)=> {
                if(err){
                    reject(err)
                    return
                }
                let pArr1=[]
                let pArr2=[]
                /*对每一条结果获得的teamId，获取团队成员，放入promise队列*/
                for(let i in rows){
                    pArr1.push(this.get_teamMember(rows[i].teamId))
                }
                Promise.all(pArr1).then(results=>{
                    console.log('pArr1:')
                    console.log(results)
                    for(let i in results){
                        let students=results[i]
                            let Names=[]
                            let IDS=[]
                            for(let z in students){
                                Names.push(students[z].stuName)
                                IDS.push(students[z].stuId)
                            }
                            let complist={}
                            complist.teamMembersName=Names.join(';')
                            complist.teamMembersId=IDS.join(';')
                            complist.Score=rows[i].totalScore||0
                            complist.compId=rows[i].CompId
                            complist.teamId=rows[i].teamId
                            complist.teamName=rows[i].teamName
                            console.log(complist)
                            pArr2.push(this.insert_complist(complist))
                        }
                    return Promise.all(pArr2)
                }).then(results=>{
                    console.log('pArr2:')
                    console.log(results)
                    resolve(results)
                }).catch(err=>{
                    reject(err)
                })

            })
        })
    }
    delete_complists(compId){
        return new Promise((resolve, reject) => {

            let sql='DELETE FROM complist WHERE compId=?'
            let params=[compId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    /*获取竞赛的榜单列表按分数降序*/
    get_complistOrder(compId){
        return new Promise((resolve, reject) => {
        let sql=sql_func.query_c('complist',['*'],{compId})
        sql[0]=sql[0]+' ORDER BY Score DESC'
        mysql.query(sql[0],sql[1],function (err,rows) {
            err&&reject(err)
            resolve(rows)
        })
        })
    }
    /*更新complist中的Score*/
    update_complist(complist){
        return new Promise((resolve, reject) => {
            let Score=complist.Score
            let rank=complist.rank
            let CompListId=complist.CompListId
            let sql=sql_func.update('complist',{Score,rank},{CompListId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*获取队伍信息*/
    get_team(teamId){
        return new Promise((resolve, reject) => {
            let sql=sql_func.query_c('team',['*'],{teamId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }

    /*获取队伍成员new*/
    get_teamMember1(teamId){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.stuId,c.stuNum,c.stuName,c.class,c.phoneNum  '
            +'FROM team a INNER JOIN stu_team b '
            +'ON a.teamId=b.teamId '
            +'INNER JOIN student c '
            +'ON b.stuId=c.stuId '
            +'WHERE a.teamId=? AND b.IsPass=1'
            let params=[teamId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    /*获取队伍成员*/
    get_teamMember(teamId){
        return  new Promise((resolve, reject) => {
            let akeys=[]
            let bkeys=[]
            let ckeys=['stuId','stuNum','stuName','class','phoneNum']
            let onab={teamId:'teamId'}
            let onbc={stuId:'stuId'}
            let condition_a={teamId}
            let sql=sql_func.query_multiple3('team','stu_team','student',akeys,bkeys,ckeys,onab,onbc,condition_a)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })


    }
}



module.exports=teacherInterface
