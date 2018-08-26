var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, mealappid, foodAppId, aritleType} = require('../../utils/common.js')
Page({
    data: {
      aritleType,
      foodAppId,
      mealappid,
      cloudHost,
      data:'',
      id:'',
      showTip:true,
      foodList:[],
      articleArray: []
    },
    onLoad: function (options) {
      const that = this;
      const id = options.id
      that.setData({
        id:id
      })
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: host + '/regimen/time/content/' + id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            var content = data.data.content
            content = content.replace(new RegExp('/d/file', "gm"), cloudHost + '/d/file')
            that.setData({
              data: data.data,
              foodList:data.data.foodList
            })
            WxParse.wxParse('article', 'html', content, that, 5);
          }
          wx.hideLoading();
        },
        fail: function (error) {
          wx.hideLoading();
        }

      })

      this.loadRecommendList(this)   
    },
  loadRecommendList: (that, append) => {
    const id = that.data.id
    if (append) {
      wx.showLoading({
        title: '加载更多...',
      })
    }
    wx.request({
      url: host + '/regimen/time/recommend/' + id,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          if (append) {
            that.setData({
              articleArray: that.data.articleArray.concat(data.articleArray)
            })
          } else {
            that.setData({
              articleArray: data.articleArray
            })
          }
        }
        if (append) {
          wx.hideLoading()
        }
      },
      fail: function () {
        if (append) {
          wx.hideLoading()
        }
      }
    })
  },
  onShareAppMessage:function(options){
    const info = this.data.data
    return share(info.timeName + info.meridian + '养生', '', '', 'https://img.jinrongzhushou.com/banner/banner-regimen.png')
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    const height = wx.getSystemInfoSync().windowHeight - 50
    if (height < s && this.data.showTip) {
      const that = this
      setTimeout(() => {
        that.setData({
          showTip: false
        })
      }, 1000)
    }
  }
})