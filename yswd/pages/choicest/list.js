//index.js
//获取应用实例
const app = getApp()
const { host, share, aritleType, mealappid, infoAppid, foodAppId } = require('../../utils/common.js')


Page({
  data: {
    bannerList: [],
    indicatorDots: true,
    indicatorColor: "#000",
    indicatorActiveColor: "#fff",
    autoplay: true,
    interval: 5000,
    duration: 500,
    page:0,
    newList: []
  },
  loadNewsList:function(append){
    wx.showLoading({
      title: '努力加载中...',
    })
    var that = this
    wx.request({
      url: `${host}/article/${aritleType}/main`,
      data: {
        start: that.data.page*10,
        limit: 10
      },
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {  
          if(append){
            that.setData({
              newList: that.data.newList.concat(data.list) 
            })
          }else{
            that.setData({
              newList: data.list
            })
          }
        }
        wx.hideLoading()
      },
      fail: function (r) {
        wx.hideLoading()
      }
    })
    wx.request({
      url: `${host}/app/banner/${mealappid}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          that.setData({
            bannerList: data.list
          })
        }
      }
    })
  },
  onLoad: function () {
    this.loadNewsList()
    var that=this
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindTapNewsView:function(e){
    const item=e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '../choicest/content?id=' + item.id + '&category=' + item.category + '&type=' + item.articleType,
      })
    }
  },
  onPullDownRefresh:function(options){
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadNewsList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(options){
    this.setData({
      page: this.data.page+1
    })
    wx.showNavigationBarLoading();
    this.loadNewsList(true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    return share()
  },
  bindBannerTap: (e) => {
    const item = e.currentTarget.dataset.item
    if (item) {
      if (item.redirect === 'call') {
        wx.navigateToMiniProgram({
          appId: item.target,
          path: item.target === foodAppId ? 'pages/food/main' : 'pages/choicest/main?',
          envVersion: 'develop'
        })
      } else if (item.redirect === 'self') {
        var url = ''
        if (item.action === 'main') {
          url = 'pages/choicest/main'
          wx.navigateTo({
            url: url
          })
        } else if (item.action === 'regimen') {
          wx.switchTab({
            url: '/pages/time/list'
          })
        }
      }
    }
  }
})
