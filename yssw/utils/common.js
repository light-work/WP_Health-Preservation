exports.host = 'https://www.jinrongzhushou.com/v1'//web host
exports.cloudHost ='https:///yspic.oss-cn-beijing.aliyuncs.com/'

exports.infoAppid ='wxb9ed9bd8f7f0fd79'
exports.appid ='wx6256dbc93eae7488'


exports.share = (title, successCallbak, failCallback,imgsrc) => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  var url = currentPage.route
  var opts = currentPage.options
  if (opts) {
    url +='?from=share'
    Object.keys(opts).forEach((i) => {
      url += `&${i}=${opts[i]}`
    })
  }
  return {
    title: title ? title : '',
    path: url,
    imageUrl:imgsrc?imgsrc:'',
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


exports.shareContent = (title, successCallbak, failCallback, imageUrl, url, params) => {
  if (!params) params = {}
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  var opts = Object.assign(params, currentPage.options)

  if (opts) {//params
    url += '?from=share'
    Object.keys(opts).forEach((i) => {
      url += `&${i}=${opts[i]}`
    })
  }
  return {
    title: title ? title : '',
    path: url,
    imageUrl: imageUrl ? imageUrl : '',
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