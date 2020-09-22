var mysql=require('./database')
var sql_interface=require('./myInterface');
const { reject } = require('async');
var sql_func=new sql_interface();

/*
* 表外键相关，对另一些表进行查询
* */
class getInterface {
    constructor() {
    }

    /*获取系统使用人数*/
    get_userSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as userSum FROM ??'
            let params=['student']
            mysql.query(sql,params,function (err,rows) {
                    err&&reject(err)
                    console.log(rows)
                    resolve(rows[0].userSum)
            })
        })

    }
    /*获取队伍总数 */
    get_teamSum(){
        return new Promise((resolve,reject)=>{
            let sql="SELECT COUNT(*) as teamSum FROM team"
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                console.log(rows)
                resolve(rows[0].teamSum)
        })
        })
    }
    /*获取每一种竞赛的数量*/
    get_CompSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(a.CompTypeid) as Sum,b.CompName From ?? a inner join ?? b ON a.CompTypeid=b.CompTypeid'
                    + ' GROUP BY a.CompTypeid '
            let params=['competition','compcode']
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }


    /*获取我管理的竞赛*/
    get_myComp(stuId,compStateID){
        return new Promise((resolve, reject) => {
            this.get_CompStateName(compStateID).then(results=>{
                let akesy=[]
                let bkeys=['teamId','IsPass']
                let ckeys=['compName','teacher','CompId']
                let sql=sql_func.query_multiple3('stu_team','teamcompetion','competition',akesy,bkeys,ckeys,{teamId:'teamId'},{CompId: 'CompId'},{IsPass:1,stuId},compStateID>=8?{IsPass:1}:null,{compStateID})
                if(compStateID!==1){
                    sql[0]=sql[0]+' AND teamcompetion.IsPass!=2'
                }
                mysql.query(sql[0],sql[1],function (err,rows) {
                    err&&reject(err)
                    for(let i in rows){
                        if(rows[i].IsPass===0){
                            rows[i].Passtatus="已申请"
                        }
                        else if(rows[i].IsPass===1){
                            rows[i].Passtatus="已通过"
                        }
                        else if(rows[i].IsPass===2){
                            rows[i].Passtatus="已拒绝"
                        }
                        rows[i].CompStateName=results.CompStateName
                    }
                    resolve(rows)
                })
            })

        })
    }
    get_myAllComp(stuId){
        return new Promise((resolve, reject) => {
            let sql=' SELECT st.teamId,c.compName,t.teamName,s.CompStateName,s.compStateID,tc.IsPass,cc.CompName as TypeName,c.CompId '
            +' FROM stu_team st '
            +' INNER JOIN teamcompetion tc '
            +' ON st.teamId=tc.teamId '
            +' INNER JOIN team t '
            +' ON tc.teamId=t.teamId '
            +' INNER JOIN competition c '
            +' ON tc.CompId=c.CompId '
            +' INNER JOIN compstatus s '
            +' ON c.compStateID=s.compStateID '
            +' INNER JOIN compcode cc '
            +' ON c.CompTypeid=cc.CompTypeid '
            +' WHERE st.stuId=?  '
            + 'ORDER BY compStateID'
            let params=[stuId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(rows)
                for(let i in rows) {
                    if (rows[i].IsPass === 0) {
                        rows[i].Passtatus = "已申请"
                    } else if (rows[i].IsPass === 1) {
                        rows[i].Passtatus = "已通过"
                    } else if (rows[i].IsPass === 2) {
                        rows[i].Passtatus = "已拒绝"
                    }
                }
                resolve(rows)
            })
        })
    }
    get_myApplyComp(stuId){
        return new Promise((resolve, reject) => {
            let sql=' SELECT st.teamId,c.compName,t.teamName,s.CompStateName,tc.IsPass,cc.CompName as TypeName,c.CompId'
                +' FROM stu_team st '
                +' INNER JOIN teamcompetion tc '
                +' ON st.teamId=tc.teamId '
                +' INNER JOIN team t '
                +' ON tc.teamId=t.teamId '
                +' INNER JOIN competition c '
                +' ON tc.CompId=c.CompId '
                +' INNER JOIN compstatus s '
                +' ON c.compStateID=s.compStateID '
                +' INNER JOIN compcode cc '
                +' ON c.CompTypeid=cc.CompTypeid '
                +' WHERE st.stuId=?  AND c.compStateID=1'
            let params=[stuId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(rows)
                for(let i in rows) {
                    if (rows[i].IsPass === 0) {
                        rows[i].Passtatus = "已申请"
                    } else if (rows[i].IsPass === 1) {
                        rows[i].Passtatus = "已通过"
                    } else if (rows[i].IsPass === 2) {
                        rows[i].Passtatus = "已拒绝"
                    }
                }
                resolve(rows)
            })
        })
    }
    get_myRunningComp(stuId){
        return new Promise((resolve, reject) => {
            let sql=' SELECT st.teamId,c.compName,t.teamName,s.CompStateName,tc.IsPass,cc.CompName as TypeName,c.CompId '
                +' FROM stu_team st '
                +' INNER JOIN teamcompetion tc '
                +' ON st.teamId=tc.teamId '
                +' INNER JOIN team t '
                +' ON tc.teamId=t.teamId '
                +' INNER JOIN competition c '
                +' ON tc.CompId=c.CompId '
                +' INNER JOIN compstatus s '
                +' ON c.compStateID=s.compStateID '
                +' INNER JOIN compcode cc '
                +' ON c.CompTypeid=cc.CompTypeid '
                +' WHERE st.stuId=?  AND (c.compStateID=2 OR c.compStateID=3) AND tc.IsPass=1'
            let params=[stuId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(rows)
                for(let i in rows) {
                    if (rows[i].IsPass === 0) {
                        rows[i].Passtatus = "已申请"
                    } else if (rows[i].IsPass === 1) {
                        rows[i].Passtatus = "已通过"
                    } else if (rows[i].IsPass === 2) {
                        rows[i].Passtatus = "已拒绝"
                    }
                }
                resolve(rows)
            })
        })
    }
    get_myEndComp(stuId){
        return new Promise((resolve, reject) => {
            let sql=' SELECT st.teamId,c.compName,t.teamName,s.CompStateName,tc.IsPass,cc.CompName as TypeName,c.CompId '
                +' FROM stu_team st '
                +' INNER JOIN teamcompetion tc '
                +' ON st.teamId=tc.teamId '
                +' INNER JOIN team t '
                +' ON tc.teamId=t.teamId '
                +' INNER JOIN competition c '
                +' ON tc.CompId=c.CompId '
                +' INNER JOIN compstatus s '
                +' ON c.compStateID=s.compStateID '
                +' INNER JOIN compcode cc '
                +' ON c.CompTypeid=cc.CompTypeid '
                +' WHERE st.stuId=?  AND (c.compStateID=4 OR c.compStateID=5) AND tc.IsPass=1'
            let params=[stuId]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(rows)
                for(let i in rows) {
                    if (rows[i].IsPass === 0) {
                        rows[i].Passtatus = "已申请"
                    } else if (rows[i].IsPass === 1) {
                        rows[i].Passtatus = "已通过"
                    } else if (rows[i].IsPass === 2) {
                        rows[i].Passtatus = "已拒绝"
                    }
                }
                resolve(rows)
            })
        })
    }
    myComps(stuId,status){
        switch (status) {
            case -1:return this.get_myAllComp(stuId);
                break;
            case 0:return this.get_myAllComp(stuId);
                break;
            case 1:return this.get_myApplyComp(stuId);
                break;
            case 2:return this.get_myRunningComp(stuId);
                break;
            case 3:return this.get_myEndComp(stuId);
                break;

        }
    }
    myCompsSum(stuId,status){
        return this.get_myCompsSum(stuId);
    }
    get_myCompsSum(stuId){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as Sum'
                +' FROM stu_team st '
                +' INNER JOIN teamcompetion tc '
                +' ON st.teamId=tc.teamId '
                +' INNER JOIN team t '
                +' ON tc.teamId=t.teamId '
                +' INNER JOIN competition c '
                +' ON tc.CompId=c.CompId '
                +' INNER JOIN compstatus s '
                +' ON c.compStateID=s.compStateID '
                +' INNER JOIN compcode cc '
                +' ON c.CompTypeid=cc.CompTypeid '
                +' WHERE st.stuId= ' + stuId;
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    get_CompbyState(compStateID){
        return new Promise((resolve, reject) => {
            let akeys=['CompId','compName','teacher','compStateID']
            let bkeys=['CompStateName']
            let sql=sql_func.query_multiple('competition','compstatus',akeys,bkeys,{compStateID:'compStateID'},compStateID?{compStateID}:null)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    get_members_sum(teamId){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as sum FROM stu_team WHERE teamId=? AND IsPass=1'
            let params=[teamId]

            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
            })
    }

    get_members_limit(CompId){
        return new Promise((resolve, reject) => {
            let keys=['personNum']
            let condition={CompId}
            let sql=sql_func.query_c('competition',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*通过队长stuId,teamName从团队表teamId*/
    get_teamId_create(stuId, teamName) {
        return new Promise((resolve, reject) => {
            let sql = sql_func.query_c('team', ['teamId'], {teamLeader:stuId,teamName})
            mysql.query(sql[0], sql[1], function (err, rows) {
                err && reject(err)
               // console.log(rows[0])
                resolve(rows[0])
            })
        })
    }
    //通过stuNum查询学生信息
    get_stuInfo(stuNum){
        return new Promise((resolve, reject) => {
            let sql='SELECT * FROM student WHERE stuNum=?'
            let params=[stuNum]
            mysql.query(sql,params,function (err,rows) {
                err&&reject(err)
                if(rows[0]){
                resolve(rows[0])
                }else{
                    reject(null)
                }
            })
        })
    }
    find_personalstuteam(stuId){
        return new Promise((resolve, reject) => {
            let sql="SELECT * FROM stu_team WHERE stuId=? AND Role='个人'"
            let params=[stuId]
            mysql.query(sql,params,function (err, rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*创建个人团队并创建个人竞赛团队*/
    create_personalstuteam(stuId,teamId){
        return new Promise((resolve, reject) => {
            let data={stuId,teamId,leader:true,isPass:1,Role:"个人"}
            let sql=sql_func.insert('stu_team',data)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    create_personalteam(student){
        return new Promise((resolve, reject) => {

                let teamName=student.stuName
                let teamLeader=student.stuId
                let teamIntro='个人'
                let data={teamName,teamLeader,teamIntro}
                let sql=sql_func.insert('team',data)
                mysql.query(sql[0],sql[1],(err,rows)=> {
                    err&&reject(err)
                    resolve(rows)
                })

        })
    }
    /*通过teamId获取团队信息*/
    /*返回的内容：teamId，teamName,teamIntro*/
    get_teamInfo(teamId) {
        return new Promise((resolve, reject) => {
            let keys = ['teamName', 'teamIntro']
            let sql = sql_func.query_c('team', keys, {teamId})
            console.log(sql)
            mysql.query(sql[0], sql[1], function (err, rows) {
                err && reject(err)
                console.log(rows[0])
                resolve(rows[0])
            })

        })
    }

    /*通过teamId查询队员列表信息*/
    get_teamMember1(teamId){
        return new Promise((resolve, reject) => {
            let sql='SELECT c.stuId,c.stuNum,c.stuName,c.class,c.phoneNum '
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
    /*返回内容：stuName,stuNum*/
    get_members(teamId){
        return new Promise((resolve,reject)=>{
            let akeys=[]
            let bkeys=['stuName','stuNum']
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

    /*获取一个团队下的申请人=》IsPass状态为0的数据记录*/
    get_teamApplyment(teamId){
        return new Promise((resolve, reject) =>{
            let akeys=[]
            let bkeys=['stuId','stuNum','stuName','phoneNum']
            let sql=sql_func.query_multiple('stu_team','student',akeys,bkeys,{stuId:'stuId'},{teamId,IsPass:0})
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        } )
    }
    /*在学生团队表中查询有无stuId，teamId已存在数据*/
    get_stuId_teamId(stuId,teamId,keys){
        return new Promise((resolve,reject)=>{
            let sql=sql_func.query_c('stu_team',keys,{stuId,teamId})
            mysql.query(sql[0],sql[1],function (err,rows) {
                //console.log(rows[0])
                err&&reject(err)
                resolve(rows[0])
            })
        })

    }
    /*对与isPass=0*/
    get_re_stuId_teamId_(stuId,teamId,keys){
        return new Promise((resolve,reject)=>{
            let sql=sql_func.query_c('stu_team',keys,{stuId,teamId})
             sql[0]=sql[0]+" AND ( IsPass=0 or IsPass=1)"
            mysql.query(sql[0],sql[1],function (err,rows) {
                //console.log(rows[0])
                err&&reject(err)
                resolve(rows[0])
            })
        })

    }

    /*查询我创建的团队*/
    get_myteams(stuId){
        return new Promise((resolve,reject)=>{
            let bkeys=['teamId','teamName']
            let condition_on={teamId:'teamId'}
            let condition_where={teamLeader:stuId}
           // let sql=sql_func.query_c('team',keys,{teamLeader:stuId})

            let sql=sql_func.query_multiple('stu_team','team',[],bkeys,condition_on,condition_where)
            sql[0]=sql[0]+" AND stu_team.IsPass !=2 AND stu_team.Role!='个人'"
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject[err]
                resolve(rows)
            })
        })
    }

    /*在团队竞赛表中查询是否有重复记录*/
    get_teamcompetion(teamId,CompId){
        return new Promise((resolve,reject)=>{
            let keys=['*']
            let condition={teamId,CompId}
            let sql=sql_func.query_c('teamcompetion',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    get_teamName(teamName){

        return new Promise((resolve,reject)=>{
            let keys=['*']
            let condition={teamName}
            let sql=sql_func.query_c('team',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })

    }



    get_CompStateName(compStateID){
        return new Promise((resolve,reject)=>{
           let keys=['CompStateName']
            let condition={compStateID}
            let sql=sql_func.query_c('compstatus',keys,condition)
            mysql.query(sql[0],sql[1],function (err,rows) {
                err&&reject(err)
                resolve(rows[0])
            })
        })
    }
    /*
    * 获取竞赛，所有|报名中|进行中|已结束
    * */
    get_AllComp(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  c.CompId,c.compName,s.CompStateName,s.compStateID,t.CompName as TypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    get_ApplyComp(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  c.CompId,c.compName,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=1'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })


    }
    get_RunningComp(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  c.CompId,c.compName,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=2 OR c.compStateID=3'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    get_EndComp(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  c.CompId,c.compName,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=4 OR c.compStateID=5 '+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })

    }
    LatestComps(status,limit){
        switch (status) {
            case -1:return this.get_AllLatestComp(limit);
                break;
            case 0:return this.get_AllLatestComp(limit);
                break;
            case 1:return this.get_ApplyLatestComp(limit);
                break;
            case 2:return this.get_RunningLatestComp(limit);
                break;
            case 3:return this.get_EndLatestComp(limit);
                break;
        }
    }
    get_AllLatestComp(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  c.CompId,c.compName,c.compIntro,c.obStartTIme,c.obEndTime,s.CompStateName,' +
                's.compStateID as compStateId,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }

    get_ApplyLatestComp(limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT  c.CompId,c.compName,c.compIntro,c.obStartTIme,c.obEndTime,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=1'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    get_RunningLatestComp(limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT  c.CompId,c.compName,c.compIntro,c.obStartTIme,c.obEndTime,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=2 OR c.compStateID=3'+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    get_EndLatestComp(limit){
        return new Promise((resolve, reject) => {
            let sql='SELECT  c.CompId,c.compName,c.compIntro,c.obStartTIme,c.obEndTime,s.CompStateName,t.CompName as CompTypeName '+
                ' From competition c INNER JOIN compcode t '+
                ' ON c.CompTypeid=t.CompTypeid '+
                ' INNER JOIN compstatus s'+
                ' ON c.compStateID=s.compStateID'+
                ' WHERE c.compStateID=4 OR c.compStateID=5 '+
                ' ORDER BY c.CompId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    /*返回竞赛类型的选择*/
    Comps(status,limit){
        switch (status) {
            case -1:return this.get_AllComp(limit);
                break;
            case 0:return this.get_AllComp(limit);
                break;
            case 1:return this.get_ApplyComp(limit);
                break;
            case 2:return this.get_RunningComp(limit);
                break;
            case 3:return this.get_EndComp(limit);
                break;
        }

    }
    /*获取某状态竞赛记录数量*/
    get_AllCompSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as Sum FROM competition'
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    get_ApplyCompSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as Sum FROM competition WHERE compStateID=1'
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    get_RunningCompSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as Sum FROM competition WHERE compStateID=2 OR compStateID=3'
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    get_EndCompSum(){
        return new Promise((resolve, reject) => {
            let sql='SELECT COUNT(*) as Sum FROM competition WHERE compStateID=4 OR compStateID=5'
            mysql.query(sql,null,function (err,rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
    CompSum(status){
        switch (status) {
            case -1:return this.get_AllCompSum();
                break;
            case 0:return this.get_AllCompSum();
                break;
            case 1:return this.get_ApplyCompSum();
                break;
            case 2:return this.get_RunningCompSum();
                break;
            case 3:return this.get_EndCompSum();
                break;
        }
    }
    teams(limit){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  t.teamId,t.teamName,t.teamIntro,s.stuName,s.stuNum '+
                ' From team t INNER JOIN student s '+
                ' ON t.teamLeader=s.stuId'+
                " WHERE t.teamName!=s.stuName && t.teamIntro !='个人' "+
                ' ORDER BY t.teamId DESC '+
                ' limit ?,?'
            mysql.query(sql,[limit.start,limit.end],function (err,rows) {
                err&&reject(err)
                resolve(rows)
            })
        })
    }
    teamSum(){
        return new Promise((resolve, reject) => {
            let sql=' SELECT  COUNT(*) as Sum '+
                ' From team t INNER JOIN student s '+
                ' ON t.teamLeader=s.stuId'+
                " WHERE t.teamName!=s.stuName && t.teamIntro !='个人' "+
                ' ORDER BY t.teamId DESC '
            mysql.query(sql,null,function (err, rows) {
                err&&reject(err)
                resolve(rows[0].Sum)
            })
        })
    }
}


module.exports=getInterface
