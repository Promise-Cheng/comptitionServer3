const fs = require('fs')
const formidable = require('formidable');
var express = require('express');
var router = express.Router();
const errorStatus = require('./errorStatus');
const checkAuth = require('../../middlewares/checkAuth')
var insert_interface = require('../../insertInterface');
var get_interface = require('../../getInterface');
let get = new get_interface()
var ins = new insert_interface()

function uploadFile(req, callBack) {
  //然后在post或者get页面里面实例化对象
  let form = new formidable.IncomingForm(); //创建上传表单
  //设置下上传地址和编码
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = 'public/uploads'; //设置上传目录
  form.keepExtensions = false; //保留后缀
  form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小 k

  form.parse(req, callBack);
}

function downloadFile(req, res, options) {
  res.download(".\\public\\uploads\\" + options.path, options.filename, (err) => {
    if (err) {
      console.log(err)
    } else {
      //res.send('ok')
    }
  });
}
//作品上传下载
router.post("/uploadWorks", checkAuth, (req, res, next) => {
  uploadFile(req, async (err, fields, files) => {
    try {
      if (err) {
        next(err)
      }
      //必填参数
      if (!fields.teamCompId || !fields.workName || !fields.question) {
        next(400)
      }
      let item = files['file']
      let fileDescArray = []
      let fileNameArray = []
      await new Promise((resolve, reject) => {
        let newPath = item.path + item.name
        fs.rename(item.path, newPath, (err) => {
          let index = newPath.lastIndexOf('\\')
          if (index !== -1) {
            newPath = newPath.substring(index + 1, newPath.length)
          }
          fileDescArray.push(newPath);
          fileNameArray.push(item.name)
          err && reject(err)
          resolve();
        })
      })
      let submitId = req.session.stuId;
      let filePath = fileDescArray.join(';');
      let fileName = fileNameArray.join(';');
      let teamCompId = fields.teamCompId;
      let workName = fields.workName || '';
      let question = fields.question || '';
      let submitTime = '2020-02-01 11:11:11';
      let introduction = fields.introduction || '';
      let data = {submitId, filePath, fileName, teamCompId, workName, question, submitTime, introduction}
      let rows = await ins.work(data);
      res.status(200).send({
        status: 'success',
        data: rows
      })
    } catch (err) {
      console.log(err)
      res.status(500).send();
    }
  })
})

router.get('/download', async (req, res, next) => {
  if(!req.query.workId){
    next(400)
    return
  }
  const rows = await get.getWorksByID(req.query.workId);
  if (rows.length === 0) {
    next(404)
    return
  }
  let options = {
    path: rows[0].filePath,
    filename: rows[0].fileName
  }
  downloadFile(req, res, options)
});

//题目上传下载
router.post("/question/uploadWorks",  (req, res, next) => {
  uploadFile(req, async (err, fields, files) => {
    try {
      if (err) {
        next(err)
        return
      }
      console.log(fields)
      console.log(!fields.CompId)
      console.log(!fields.questionAnsw)
      console.log(!fields.questionIntro)
      console.log(!fields.questionName)
      console.log((!fields.CompId) || (!fields.questionAnsw) || !fields.questionIntro || !fields.questionName)
      //必填参数
      if (!fields.CompId || !fields.questionAnsw || !fields.questionIntro || !fields.questionName) {
        next(400)
        return
      }
      let item = files['file']
      let fileDescArray = []
      let fileNameArray = []
      await new Promise((resolve, reject) => {
        let newPath = item.path + item.name
        fs.rename(item.path, newPath, (err) => {
          let index = newPath.lastIndexOf('\\')
          if (index !== -1) {
            newPath = newPath.substring(index + 1, newPath.length)
          }
          fileDescArray.push(newPath);
          fileNameArray.push(item.name)
          err && reject(err)
          resolve();
        })
      })
      // let submitId = req.session.stuId;
      let fileDesc = fileDescArray.join(';');
      let fileName = fileNameArray.join(';');
      let CompId = fields.CompId;
      let questionAnsw = fields.questionAnsw || '';
      let questionIntro = fields.questionIntro || '';
      let questionName = fields.questionName || '';
      let data = {fileDesc, fileName, CompId, questionAnsw, questionIntro, questionName}
      let rows = await ins.question(data);
      console.log('1111',rows)
      res.status(200).send({
        status: 'success',
        data: rows
      })
    } catch (err) {
      console.log(err)
      res.status(500).send();
    }
  })
})

router.get('/question/download', async (req, res, next) => {
  if(!req.query.CompId){
    next(400)
    return
  }
  const rows = await get.getWorksByID(req.query.CompId);
  if (rows.length === 0) {
    next(404)
    return
  }
  let options = {
    path: rows[0].filePath,
    filename: rows[0].fileName
  }
  downloadFile(req, res, options)
});
router.use((err, req, res, next) => {
  if (typeof err === 'number') {
    err = errorStatus[err]
  }
  let result = {
    error: {
      code: err.code || 500,
      message: err.message,
    }
  }
  res.status(err.code || 500);
  res.json(result);
});
module.exports = router;
