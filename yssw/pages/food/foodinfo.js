// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, mealAppid, infoAppid} =require('../../utils/common.js')
Page({
    data: {
      cloudHost,
      foodInfo:'',
      property:'',
      articleArray:[],
      fitCount:0
    },
    onLoad: function(options) {
      const that = this;
      const id = options.id
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: host + '/food/detail/' + id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            var content = data.data.content
            content = content.replace(new RegExp('/d/file', "gm"), cloudHost + '/d/file')
            that.setData({
              foodInfo:data.data.foodId,
              fitCount: data.data.fitCount,
              property: data.data.property
            })
            WxParse.wxParse('article', 'html', content, that, 5);
          }
          wx.hideLoading();
        },
        fail: function (error) {
          wx.hideLoading();
        }
      })
      wx.request({
        url: host + '/food/recommend/'+id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            that.setData({
              articleArray: data.articleArray
            })
          }
        }
      })
    },
  bindTapNewsView: (e) => {
    const item = e.detail
    if (item && item.articleType){
      wx.navigateToMiniProgram({
        appId: item.articleType==='meal'?mealAppid:infoAppid,
        path: `pages/choicest/main?id=${item.id}&category=${item.category}&type=${item.articleType}`,
        envVersion: 'develop'
      })
    }
  },
  foodConflictTap : function(e){
      wx.navigateTo({
        url: '../foodConflict/content?id=' + this.data.foodInfo.id,
      })
  },
  onShareAppMessage: function (ops) {
    return share(this.data.foodInfo.name,'',(s)=>{
      wx.showToast({
        title: '转发失败',
        icon: 'none'
      })
    })
  }
})