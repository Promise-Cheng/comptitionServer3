var express = require('express');
var router = express.Router();
var mysql=require('../database')

var sql_interface=require('../myInterface')
var sql_func=new sql_interface();
var get_interface=require('../getInterface')
var get_func=new get_interface()
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var sql_interface=require('../myInterface')
var sql_func=new sql_interface();

//登录
router.post('/login',function(req,res,fields) {
  console.log(req.body)
  let stuNum=req.body.stuNum;
  let password=req.body.password;
  let condition={'stuNum':stuNum,'password':password}
  console.log(condition)
  let key=['stuId','stuNum','stuName','class','phoneNum','QQ','email']
  let sql_query=sql_func.query_c('student',key,condition)
  console.log(sql_query)

  mysql.query(sql_query[0],sql_query[1],function (err,rows,fields) {
    if(err){
      console.log(err);
      res.status(500).send({
        "result" : 'error'
      })
      res.end();
      return;
    }
    //没有此账号
    if(!rows[0]){
      res.status(200).send({
        'result':'null'
      })
      console.log(stuNum+'登陆失败')
      res.end();
      return;
    }
    //查询有结果
    console.log(rows[0]);
    req.session.stuId=rows[0].stuId;
    req.session.isLogin=true;
    res.status(200).send({
      'result':'success',
      'info':rows[0]
    })
  //  console.log(rows[0])

  })

})

//登出
router.post('/logout',function (req,res,fields) {
  req.session.destroy()
  if(req.session)
  {
    res.status(500).send({
      result:'error'
    })
  }
  else{
    res.status(200).send({
      result:'success'
    })
  }
})

//注册
router.post('/register',function (req,res,next) {
  var sql_str={}
  var stuNum = req.body.stuNum;
  if(stuNum)  {sql_str['stuNum'] = stuNum}
  var stuName = req.body.stuName;
  if(stuName)  {sql_str['stuName'] = stuName}
  var password = req.body.password;
  if(password)  {sql_str['password'] = password}
  var class_ = req.body.class_;
  if(class_)  {sql_str['class'] = class_}
  var phoneNum = req.body.phoneNum;
  if(phoneNum)  {sql_str['phoneNum'] = phoneNum}
  var QQ = req.body.QQ;
  if(QQ)  {sql_str['QQ'] = QQ}
  var email = req.body.email;
  if(email)  {sql_str['email'] = email}
  var compNum = req.body.compNum;
  if(compNum)  {sql_str['compNum'] = compNum}
  var passwordQue = req.body.passwordQue;
  if(passwordQue)  {sql_str['passwordQue'] = passwordQue}
  var answer = req.body.answer;
  if(answer)  {sql_str['answer'] = answer}

  if(!stuNum||!password||!stuName){
    res.status(500).send();
    return;
  }
  let sql_query=sql_func.query_c('student',['stuNum'],{'stuNum':stuNum})
  mysql.query(sql_query[0],sql_query[1],function (err,rows,fields) {
    if(err){
      console.log(err);
      res.status(500).send({
        "result" : 'error'
      })
      return;
    }
    //存在则返回；exist
    if(rows[0]){
      console.log(rows[0],'已存在')
      res.status(200).send({
        'result':'exist'
      })
      return;
    }
    //不能存在，进行接下来的注册操作
    let sql_insert=sql_func.insert('student',sql_str)
    mysql.query(sql_insert[0],sql_insert[1],function (err,rows,fields) {
      if(err){
        console.log(err);
        res.status(500).send()
        return;
      }

      //插入成功，创建个人team
      let student=null
      get_func.get_stuInfo(stuNum).then(st=>{
        student=st
        return get_func.create_personalteam(student)
      }).then(results=>{
      console.log(results)
      return get_func.get_teamId_create(student.stuId,student.stuName)
    }).then(team=>{
      let teamId=team.teamId
      return get_func.create_personalstuteam(student.stuId,teamId)
    }).then(results=>{
      res.status(200).send({
        result:'success'
      })
      }).catch(err=>{
      console.log(err);
      res.status(500).send()
    })


    })

  })
})

/*主页信息*/
router.get('/home',function (req,res){
    let personNum=0
    let CompNum=0
    let CompList=[]
    let teamNum=0
    get_func.get_userSum().then(results=>{
      personNum=results
      return get_func.get_teamSum()}).then(teamSum=>{
        teamNum=teamSum;
      return  get_func.get_CompSum()
    }).then(results=>{
      CompList=results
      for(let i in CompList){
        CompNum=CompNum+CompList[i].Sum
      }
      res.status(200).send({
        result:'success',
        data:{
          personNum,CompNum,CompList,teamNum
        }
      })
    }).catch(err=>{
      console.log(err)
      res.status(500).send()
    })
})
module.exports=router

