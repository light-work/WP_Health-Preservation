exports.aritleType='meal'//小程序名称
exports.aldKey ='c32ac2cdf3107c0f6ee9a550b2e63588'//阿拉丁key
exports.host = 'https://www.jinrongzhushou.com/v1'//web host
exports.cloudHost ='https:///yspic.oss-cn-beijing.aliyuncs.com/'
exports.foodAppId ='wx6256dbc93eae7488'

exports.share = (title, successCallbak, failCallback) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var opts = currentPage.options
  if (opts) {
    var first = true
    Object.keys(opts).forEach((i) => {
      if (first) {
        url += `?${i}=${opts[i]}`
        first = false
      } else {
        url += `&${i}=${opts[i]}`
      }
    })
  }
  console.info(url)
  return {
    title: title ? title : '',
    path: url,
    success: function (res) {
      if (typeof successCallbak === 'function') {
        successCallbak(res)
      }
    },
    fail: function (res) {
      if (typeof failCallback === 'function') {
        failCallback(res)
      } else if (!failCallback) {
        wx.showToast({
          title: '转发失败',
          icon: 'none'
        })
      }
    }
  }
}