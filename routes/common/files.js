const fs = require('fs')
const formidable = require('formidable');
let fileConfig = require("../../fileConfig")
var express = require('express');
var router = express.Router();
const errorStatus = require('./errorStatus');
const checkAuth = require('../../middlewares/checkAuth')
var insert_interface = require('../../insertInterface');
var ins = new insert_interface()

function uploadFile(req, res, callBack) {
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
  res.setHeader(`Content-Disposition", "attachment; filename=${options.filename}`);
  res.download(".\\" + options.path, options.filename, (err) => {
    if (err) {
      console.log(err)
    } else {
      //res.send('ok')
    }
  });
}

router.get('/d', function (req, res) {
  let options = {
    path: '',
    fileName: ''
  }
  downloadFile(req, res, options)
});
router.post("/uploadWorks", checkAuth, (req, res, next) => {
  const form = formidable({multiples: true, uploadDir: fileConfig.basePath});
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        next(err)
      }
      //必填参数
      if (!fields.teamCompId || !fields.workName || !fields.question) {
        next(400)
      }
      let tasks = [];
      let fileDescArray = [];
      let fileNameArray = [];
      if (files['file'].length) { //多文件
        files['file'].forEach((item) => {
          const p = new Promise((resolve, reject) => {
            fs.rename(item.path, item.path + item.name, (err) => {
              fileDescArray.push(item.path + item.name);
              fileNameArray.push(item.name)
              err && reject(err)
              resolve();
            })
          });
          tasks.push(p)
        })

      } else {//单文件
        let item = files['file']
        let p = new Promise((resolve, reject) => {
          fs.rename(item.path, item.path + item.name, (err) => {
            fileDescArray.push(item.path + item.name);
            fileNameArray.push(item.name)
            err && reject(err)
            resolve();
          })
        })
        tasks.push(p)
      }
      let submitId = req.session.stuId;

      let filePath = fileDescArray.join(';');
      let fileName = fileNameArray.join(';');
      let teamCompId = fields.teamCompId;
      let workName = fields.workName || '';
      let question = fields.question || '';
      let submitTime = '2020-02-01 11:11:11';
      let introduction = fields.introduction || '';
      let fileTasks = Promise.all(tasks);
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
  });
})



router.post('/', (req, res, next) => {
  next(400)
  // uploadFile(req, res, (err, fields, files) => {
  //     if (err) {
  //         res.send(err);
  //         return;
  //     }
  //     console.log(fields, "-------------", files);
  //     res.send(files);
  // })
})

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
