// pages/food/main.js
const { host,  share, appid} = require('../../utils/common.js')
const app = getApp()
const { sendFormId } = require('../../utils/increase.js') 

Page({
  data: {
    bannerList:[],
    indicatorDots: true,
    indicatorColor: "#000",
    indicatorActiveColor: "#fff",
    autoplay: true,
    interval: 5000,
    duration: 500,
    page:0,
    list: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    isReady: false,
    showTip:false
  },
  loadData:function(append){
    const that=this
    wx.showLoading({
      title: '努力加载中...',
    })
    //load top list
    wx.request({
      url: host + '/food/main',
      data: {
        start: that.data.page * 5,
        limit: 5
      },
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          if (append) {
            that.setData({
              list: that.data.list.concat(data.list)
            })
          } else {
            that.setData({
              list: data.list
            })
          }
        }
        wx.hideLoading()
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  loadBannerList:(that)=>{
    wx.request({
      url: `${host}/app/banner/${appid}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          const list = data.list
          if (list && list.length > 0) {
            const array = new Array()

            list.forEach((item) => {
              let openType = 'navigate'
              var url = '', id = null
              if (item.action.indexOf('foodFit_') > -1) {
                openType = 'switchTab'
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/foodConflict/main`
              } else if (item.action.indexOf('food_') > -1) {
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/food/foodinfo?id=${id}`
              } else if (item.action.indexOf('article_') > -1) {
                const params = item.action.split('_')
                url = `/pages/choicest/content?id=${params[1]}&category=${params[2]}`
              } else if (item.action === 'regimen') {
                openType = 'switchTab'
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
  onShow:function(option){
    const show = wx.getStorageSync('showTip')
    if (show) {
      this.setData({
        showTip: false
      })
    }
    if (app.globalData.goDetail) {
      const id = app.globalData.detailId
      app.globalData.detailId = null
      app.globalData.goDetail = null
      wx.navigateTo({
        url: `../food/foodinfo?id=${id}`,
      })
    }
  },
  onLoad: function (option) {
    this.loadData()
    this.loadBannerList(this)
    var that = this
    setTimeout(() => {
      that.setData({
        isReady: true
      })
    }, 1000)
    app.globalData.showGoHome = false
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
  bindItemTap:function(e){
    if (e.detail.formId) {
      console.info(e.detail.formId)
      sendFormId(e.detail.formId,'food')
    }
    const item = e.currentTarget.dataset.item
    if (item) {
      wx.navigateTo({
        url: '../food/foodinfo?id=' + item.id
      })
    }
  },
  onPullDownRefresh: function (options) {
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadData(true)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadData(true)
    wx.hideNavigationBarLoading();
  },
  bindViewMoreTap:(e)=>{
    const item = e.currentTarget.dataset.item
    if (item){
      wx.navigateTo({
        url: `../food/moreList?id=${item.id}&title=${item.name}`,
      })
    }
  },
  onShareAppMessage: function (options) {
    return share('健康食物', '', '','https://img.jinrongzhushou.com/banner/banner-food2.jpg')
  },
  bindBannerTap:(e)=>{
    const item = e.currentTarget.dataset.item
    if (item) {
      if (item.openType === 'navigate') {
        wx.navigateTo({
          url: item.url,
        })
      } else if (item.openType === 'switchTab') {
        if(item.id){
          app.globalData.goDetail = true
          app.globalData.detailId = item.id
        }
        wx.switchTab({
          url: item.url,
        })
      }
    }
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
  }
})