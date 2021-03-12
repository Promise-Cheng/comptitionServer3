const statusCode = {
  '200': {
    code: 200,
    message: '请求成功',
    description: '请求正常处理完毕'
  },
  '301': {
    code: 301,
    message: '请求成功',
    description: '请求重定向'
  },
  '302': {
    code: 302,
    message: '请求成功',
    description: '请求临时重定向'
  },
  '304': {
    code: 304,
    message: '请求成功',
    description: '请求被重定向到客户端本地缓存'
  },
  '400': {
    code: 400,
    message: '传入参数错误',
    description: '客户端请求存在语法错误'
  },
  '401': {
    code: 401,
    message: '用户未登录或已过期',
    description: '客户端请求没有经过授权'
  },
  '403': {
    code: 403,
    message: '没有权限',
    description: '客户端请求被服务器拒绝，一般为客户端没有访问权限'
  },
  '404': {
    code: 404,
    message: '404',
    description: '客户端请求的URL地址在服务器端不存在'
  },
  '405': {
    code: 405,
    message: '405',
    description: '请求行中指定的请求方法不能被用于请求相应的资源'
  },
  '500': {
    code: 500,
    message: '联系后端开发人员进行修改',
    description: '服务器端内部错误'
  },
  '503': {
    code: 503,
    message: '未知错误，请重试',
    description: '服务器端发生临时错误'
  },
}
module.exports = statusCode