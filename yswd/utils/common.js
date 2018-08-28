exports.aritleType='meal'//小程序名称
exports.host = 'https://www.jinrongzhushou.com/v1'//host
exports.cloudHost ='https:///yspic.oss-cn-beijing.aliyuncs.com/'
exports.foodAppId = 'wx6256dbc93eae7488'

exports.mealappid = 'wxca42881e5a26343e'//当前appid

exports.infoAppid = 'wxb9ed9bd8f7f0fd79'

exports.appid = 'wxca42881e5a26343e'//当前appid


exports.share = (title, successCallbak, failCallback,imageUrl) => {
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
  return {
    title: title ? title : '',
    path: url,
    imageUrl: imageUrl ? imageUrl:'',
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
exports.getPageIndex = (pageType) => {
  try {
    var value = wx.getStorageSync(pageType)
    if (value) {
      return value
    }
  } catch (e) {

  }
  return 0;
}
exports.setPageIndex = (pageType, num) => {
  try {
    if (num) {
      wx.setStorageSync(pageType, num)
    } else {
      const page = getPageIndex(pageType)
      wx.setStorageSync(pageType, page + 1)
    }

  } catch (ex) {

  }
  return 0;
}