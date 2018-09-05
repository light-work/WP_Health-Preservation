var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, shareContent} = require('../../utils/common.js')
const app = getApp()
Page({
  data: {
    cloudHost,
    data:'',
    id:'',
    showTip:false,
    showHome:false,
    foodList:[],
    articleArray: [],
    lastScroll: 0,
    windowHeight: 300
  },
  onLoad: function (options) {
    const systeminfo = wx.getSystemInfoSync()
    if (wx.getSystemInfoSync()) {
      this.setData({
        windowHeight: systeminfo.windowHeight
      })
    }
    const that = this;
    const id = options.id
    that.setData({
      id:id
    })
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: `${host}/regimen/time/content/${id}`,
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
      },
      complete: function (error) {
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
      url: `${host}/regimen/time/recommend/${id}`,
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
      },
      complete: function () {
        if (append) {
          wx.hideLoading()
        }
      }
    })
  },
  onShareAppMessage:function(options){
    const info = this.data.data
    return shareContent('好友邀请您@来了解#' + info.timeHour +'养生秘诀', null, null, 'https://img.jinrongzhushou.com/banner/banner-regimen.png','pages/time/list')
  },
  reachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  },
  pageScroll: function (res) {
    const s = res.scrollTop || res.detail.scrollTop
    if (s > 150 && !this.data.showTip) {
      this.setData({
        showTip: true
      })
    } else if (s < 150) {
      this.setData({
        showTip: false
      })
    }

    if (Math.abs(s - this.data.lastScroll) >= 50) {
      app.globalData.setPercent = app.globalData.currentPercent + 25
    }
  }
})