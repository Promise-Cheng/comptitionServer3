const mysql = require('mysql')
var express = require('express');
var router = express.Router();

const pool = mysql.createPool({
  host: "8.135.135.96",
  port: 3306,
  user: "root",
  password: "password",
  database: "otherTests"
})
const createConnect = (sql_str, sql_params, callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      callback(err, null, null)
      return
    }
    connection.query(sql_str, sql_params, (err, rows, fields) => {
      connection.release()
      if (err) {
        callback(err, null, null)
        return
      }
      callback(err, rows, fields)
    })
  })
}

function insert(table, data) {
  //第一步，拆分数据
  //key保存字段，value保存值
  var key = new Array()
  var value = new Array()
  for (var i in data) {
    key.push(i)
    value.push(data[i])
  }

  //第二步，构造占位符,并生成对应sql字符串
  var key_mark = new Array()
  var value_mark = new Array()
  for (var i = 0; i < key.length; i++) {
    key_mark.push('??')
    value_mark.push('?')
  }
  var key_string = key_mark.join(',')
  var value_string = value_mark.join(',')

  //生成sql语句
  var insert_str = 'INSERT INTO ?? (' + key_mark + ')' + ' VALUES(' + value_mark + ')'
  var params = key.concat(value)
  params.unshift(table)
  //返回数据，array[0]=insert_str||array[1]=params
  return [insert_str, params]

}

function update(table, data, condition) {
  //table:表名
  //data：字典格式数组，key：value
  //condition:字典格式数组 key：value  指定的条件
  //UPDATE table SET data WHERE condition

  //拆分data,condition
  var data_string = new Array()
  var data_mark = new Array()
  for (var i in data) {
    data_mark.push('??=?')
    data_string.push(i)
    data_string.push(data[i])
  }
  var condition_string = new Array()
  var condition_mark = new Array()
  for (var i in condition) {
    condition_mark.push('??=?')
    condition_string.push(i)
    condition_string.push(condition[i])
  }
  condition_mark = condition_mark.join(' AND ')
  var sql_string = 'UPDATE ?? SET ' + data_mark + ' WHERE ' + condition_mark
  var params = data_string.concat(condition_string)
  params.unshift(table)
  return [sql_string, params]
}

const testData = {
  "school": "信息学院",
  "id": 999,
  "studentNum": "2017329621110",
  "time1": "2021-03-03",
  "time2": "2021-07-03",
  "studentName": "李明",
  "leftTimes": 9999,
  "firstTime": "2021-03-03 15:34:23"
}
const testData1 = {
  "school": "信息学院",
  "id": 990,
  "studentNum": "2017329621111",
  "time1": "2021-03-03",
  "time2": "2021-07-03",
  "studentName": "李华",
  "leftTimes": 9999,
  "firstTime": "2021-03-03 15:34:23"
}
router.get('/getStudentCode', async (req, res) => {
  let sql = 'select * from studentCode'
  createConnect(sql, {}, (err1, rows, fields) => {
    if (err1) {
      res.send({
        code: 500,
        message: err1.message
      })
      return
    }
    if (rows.length === 0) {
      res.send({
        code: 200,
        message: "暂无数据"
      })
      return;
    }
    res.send({
      code: 200,
      data: rows
    })
  })
})
router.get('/getStudentCodeByStuentNum', async (req, res) => {
  let sql = 'select * from studentCode'
  console.log(req.query)
  if (req.query.studentNum) {
    sql += ` where studentNum = '${req.query.studentNum}';`
  } else {
    res.send({
      code: 200,
      data: testData
    })
    return
  }
  createConnect(sql, {}, (err1, rows, fields) => {
    if (err1) {
      res.send({
        code: 500,
        message: err1.message
      })
      return
    }
    if (rows.length === 0) {
      res.send({
        code: 200,
        data: testData1
      })
      return;
    }
    res.send({
      code: 200,
      data: rows[0]
    })
  })
})
router.post('/setStudentCode', async (req, res) => {
  console.log(req.body)
  let studentNum = req.body.studentNum
  let keys = req.body
  if (!studentNum) {
    res.send({
      code: 400,
      message: '缺少学号参数'
    })
    return
  }
  let sql = update('studentCode', keys, {studentNum})
  createConnect(sql[0], sql[1], (err1, rows, fields) => {
    if (err1) {
      res.send({
        code: 500,
        message: err1.message
      })
      return
    }
    if (rows.affectedRows === 0) {
      res.send({
        code: 200,
        message: '没有该学号的学生！'
      })
      return;
    }
    res.send({
      code: 200,
      message: 'success'
    })
  })
})
router.post('/addStudentCode', async (req, res) => {
  let studentNum = req.body.studentNum
  if (!studentNum) {
    res.send({
      code: 400,
      message: 'studentNum必须'
    })
    return
  }
  createConnect(`select * from studentCode where studentNum = ${studentNum};`, null, (err, rows, fields) => {
    if (err) {
      res.send({
        code: 500,
        message: err.message
      })
      return
    }
    if (rows.length !== 0) {
      res.send({
        code: 300,
        message: '该学号已存在！'
      })
      return
    }
    let sql = insert('studentCode', req.body)
    createConnect(sql[0], sql[1], (err, rows1, fields) => {
      if (err) {
        res.send({
          code: 500,
          message: err.message
        })
        return
      }
      if (rows1.affectedRows === 0) {
        res.send({
          code: 300,
          message: '新增失败，未知错误！'
        })
        return
      }
      res.send({
        code: 200,
        message: 'success'
      })
    })
  })
})
module.exports = router
