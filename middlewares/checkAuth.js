module.exports = function checkAuth(req, res, next) {
  if (req.session.isLogin) {
    return next()
  }
  res.json({
    code: 401,
    message: '用户未登录或已过期'
  })
}
