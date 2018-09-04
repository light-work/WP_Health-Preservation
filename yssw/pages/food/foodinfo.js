// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js')
const { host, cloudHost, shareContent} =require('../../utils/common.js')
const app=getApp()
Page({
    data: {
      cloudHost,
      foodInfo:'',
      property:'',
      showTip:false,
      articleArray:[],
      fitCount:0
    },
    onLoad: function(options) {
      const that = this;
      const id = options.id
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: `${host}/food/detail/${id}`,
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
        url:  `${host}/food/recommend/${id}`,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            that.setData({
              articleArray: data.articleArray
            })
          }
        }
      })
    },
  foodConflictTap : function(e){
      wx.navigateTo({
        url: '../foodConflict/content?id=' + this.data.foodInfo.id,
      })
  },
  onShareAppMessage: function (ops) {
    const foodInfo = this.data.foodInfo
    return shareContent(foodInfo.name + '的功效', null, null,
      foodInfo.picUrl, 'pages/food/main', { target: 'foodinfo' })
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    if (s > 150 && !this.data.showTip) {
      this.setData({
        showTip: true
      })
    } else if (s < 150) {
      this.setData({
        showTip: false
      })
    }
  }
})