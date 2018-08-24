// pages/food/main.js
const { host, cloudHost, share, foodAppId, mealappid, infoAppid} = require('../../utils/common.js')
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
    cloudHost,
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

    wx.request({
      url: `${host}/app/banner/${foodAppId}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          const list = data.list
          if (list && list.length > 0) {
            const array = new Array()

            list.forEach((item) => {
              const target = item.redirect === 'call' ? 'miniProgram' : ''
              const openType = item.action === 'regimen'  ? 'switchTab' : 'navigate'
              var path = ''
              if (item.target === foodAppId) {
                if (item.action === 'foodFit') {
                  path = 'pages/foodConflict/main'
                } else if (item.action === 'main') {
                  path = 'pages/food/main'
                }
              } else if (item.target === infoAppid || item.target === mealappid) {
                if (item.action.indexOf('article_') > -1) {
                  const infoArray = item.action.split('_')
                  path = `pages/choicest/content?id=${infoArray[2]}&category=${infoArray[3]}&type=${infoArray[1]}` 
                } else {
                  path = 'pages/choicest/list'
                }
              } else if (!item.target) {//food
                if (item.action === 'foodFit'){
                  path = '/pages/foodConflict/main'
                }else{
                  path = '/pages/time/list'
                }
                
              }
              array.push({
                target: target,
                open: openType,
                path: path,
                appId: item.target,
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
  onLoad: function (option) {
    this.loadData()
    var that = this
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
  bindItemTap:function(e){
    if (e.detail.formId) {
      sendFormId(e.detail.formId)
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
    const item=e.currentTarget.dataset.item
    if(item){
     if(item.redirect==='call'){
       wx.navigateToMiniProgram({
         appId: item.target,
         path: 'pages/choicest/main?',
         envVersion: 'develop'
       })
     }else if(item.redirect==='self'){
       var url =''
       if(item.action==='main'){
         url = '../food/main'
         wx.navigateTo({
           url: url
         })
       } else if (item.action ==='regimen'){
         wx.switchTab({
           url: '/pages/time/list'
         })
       } else if (item.action ==='foodFit'){
         url = '../foodConflict/main'
         wx.navigateTo({
           url: url
         })
       }
     }
    }
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    const mobileInfo = wx.getSystemInfoSync();
    const isIOS = mobileInfo.system && mobileInfo.system.indexOf('iOS') > -1
    const show = wx.getStorageSync('showTip')
    if (s > 50 && !isIOS && !show) {
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