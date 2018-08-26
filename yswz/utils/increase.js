const { host, appid } = require('../utils/common.js') 
/**
 * 养生资讯 查看
 */
exports.postView =  (id,callback)=>{
  wx.request({
    url: host + `/article/view/${id}`,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success:function(res){
      if(typeof callback==='function'){
        callback(res)
      }
    }
  })
}
/**
 * 养生资讯 转发
 */
exports.postRelay = (id, callback)=> {
  wx.request({
    url: host + `/article/relay/${id}`,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (typeof callback === 'function') {
        callback(res)
      }
    }
  })
}
/**
 * 养生资讯 点赞
 */
exports.postLike = (id, callback)=> {
  wx.request({
    url: host + `/article/like/${id}`,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (typeof callback === 'function') {
        callback(res)
      }
    }
  })
}
exports.sendFormId = (formId) => {
  wx.request({
    url: `${host}/app/submit/${appid}`,
    method: 'POST',
    data: {
      appid: appid,
      formId: formId,
      userId: getApp().globalData.userId
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: ({ data }) => {
      if (data.errorCode === 0 && data.errorMsg === 'ok') {

      }
    },
    fail: (s) => {
      console.error('send formid fail')
    }
  })
}