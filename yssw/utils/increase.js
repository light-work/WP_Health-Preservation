const { host } = require('../utils/common.js') 
/**
 * 养生资讯 查看
 */
exports.postView =  (id,_type,callback)=>{
  if (!_type) _type ='information'
  wx.request({
    url: host + `/article/${_type}/view/${id}`,
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
exports.postRelay = (id,_type, callback)=> {
  if (!_type) _type = 'information'
  wx.request({
    url: host + `/article/${_type}/relay/${id}`,
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
exports.postLike = (id,_type, callback)=> {
  if (!_type) _type = 'information'
  wx.request({
    url: host + `/article/${_type}/like/${id}`,
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