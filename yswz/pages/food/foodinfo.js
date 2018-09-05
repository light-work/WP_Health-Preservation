// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, shareContent} =require('../../utils/common.js')
const app = getApp()
Page({
  data: {
    cloudHost,
    foodInfo:'',
    property:'',
    showTip:false,
    articleArray:[],
    fitCount:0,
    id:'',
    percent: null,
    hide:false,
    showTime:0,
    lastScroll: 0,
    windowHeight: 300
  },
  loadRecommendList:(that,append)=>{
    const id = that.data.id
    if (append) {
      wx.showLoading({
        title: '加载更多...',
      })
    }
    wx.request({
      url:`${host}/food/recommend/${id}`,
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
  onShow:function(options){
    //redpackets
    if (app.globalData.currentPercent){
      this.setData({
        hide: false
      })
    }
  },
  onHide:function(options){
    this.setData({
      hide: true
    })
  },
  onLoad: function(options) {
    const systeminfo = wx.getSystemInfoSync()
    if (wx.getSystemInfoSync()) {
      this.setData({
        windowHeight: systeminfo.windowHeight
      })
    }
    const that = this;
    const id = options.id
    that.setData({
      id: id
    })
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
    this.loadRecommendList(this)
  },
  foodConflictTap : function(e){
    wx.redirectTo({
      url: '../foodConflict/content?id=' + this.data.foodInfo.id,
    })
  },
  onShareAppMessage: function (ops) {
    const foodInfo = this.data.foodInfo
    return shareContent('好友邀请您@来了解#'+foodInfo.name + '的功效#', null, null,
     foodInfo.picUrl,'pages/food/main',{target:'foodinfo'})
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
  },
  reachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  }
})