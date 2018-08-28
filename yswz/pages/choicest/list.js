//index.js
//获取应用实例
const app = getApp()
const { host, share,  appid, foodAppId} = require('../../utils/common.js')
const { sendFormId } = require('../../utils/increase.js')

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
    newList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    isReady: false,
    showTip: false
  },
  loadNewsList:function(append){
    wx.showLoading({
      title: '努力加载中...',
    })
    var that = this
    wx.request({
      url: `${host}/article/main`,
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
  },
  loadBannderList:(that)=>{
    wx.request({
      url: `${host}/app/banner/${appid}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          const list = data.list
          if (list && list.length > 0) {
            const array = new Array()

            list.forEach((item) => {
              const openType = item.action.indexOf('article_') > -1 ? 'navigate' : 'switchTab'
              var url = '', id = null
              if (item.action.indexOf('foodFit_') > -1) {
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/foodConflict/main`
              } else if (item.action.indexOf('food_') > -1) {
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/food/main`
              } else if (item.action.indexOf('article_') > -1) {
                const params = item.action.split('_')
                url = `/pages/choicest/content?id=${params[1]}&category=${params[2]}`
              } else if (item.action === 'regimen') {
                url = '/pages/time/list'
              }
              array.push({
                id: id,
                openType: openType,
                url: url,
                title: item.title,
                imgSrc: item.imgSrc
              })
            })
            that.setData({
              bannerList: array
            })
          }
        }
      }
    })
  },
  onLoad: function () {
    this.loadNewsList()
    this.loadBannderList(this)
    var that=this
    app.globalData.showGoHome=false
    setTimeout(() => {
      that.setData({
        isReady: true
      })
    }, 1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  bindTapNewsView:function(e){
    if (e.detail.formId) {
      sendFormId(e.detail.formId,'article')
    }
    const item=e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: `../choicest/content?id=${item.id}&category=${item.category}`,
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
    return share('专家养生文摘', '', '', 'https://img.jinrongzhushou.com/banner/banner-Information3.png')
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    const mobileInfo = wx.getSystemInfoSync();
    const isIOS = mobileInfo.system && mobileInfo.system.indexOf('iOS') > -1
    const show = wx.getStorageSync('showTip')
    if (s > 150 && !isIOS && !show) {
      this.setData({
        showTip: true
      })
    } else {
      this.setData({
        showTip: false
      })
    }
  },
  closeTip: function () {
    wx.setStorageSync('showTip', 'N')
    this.setData({
      showTip: false
    })
  },
  bannerItemTap:(e)=>{
    const item=e.currentTarget.dataset.item
    if(item){
      if (item.openType ==='navigate'){
        wx.navigateTo({
          url: item.url,
        })
      } else if (item.openType === 'switchTab'){
        if (item.id) {
          app.globalData.goDetail = true
          app.globalData.detailId = item.id
        }
        wx.switchTab({
          url: item.url,
        })
      }
    }
  },
  onShow:function(){
    const show = wx.getStorageSync('showTip')
    if (show) {
      this.setData({
        showTip: false
      })
    }
  }
})
