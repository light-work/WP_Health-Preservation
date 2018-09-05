const { host ,share,appid} = require('../../utils/common.js')
const { sendFormId } = require('../../utils/increase.js')
const app=getApp()

Page({
  data: {
    bannerList: [],
    indicatorDots: true,
    indicatorColor: "#000",
    indicatorActiveColor: "#fff",
    autoplay: true,
    interval: 5000,
    duration: 500,
    page: 0,
    list: [],
    showTip: false,
    percent: null,
    walletStatus: null,
    windowHeight: app.globalData.height
  },
  loadList:function(append){
    wx.showLoading({
      title: '努力加载中...',
    })
    var that = this
    wx.request({
      url: host + '/fit/main',
      data: {
        start: that.data.page * 10,
        limit: 10
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
      fail: function (r) {
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
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/foodConflict/content?id=${id}`
              } else if (item.action.indexOf('food_') > -1) {
                openType = 'switchTab'
                const params = item.action.split('_')
                id = params[1]
                url = `/pages/food/main`
              } else if (item.action.indexOf('article_') > -1) {
                const params = item.action.split('_')
                url = `/pages/choicest/content?id=${params[1]}&category=${params[2]}`
              } else if (item.action === 'regimen') {
                openType = 'switchTab'
                url = '/pages/time/list'
              } else if (item.action === 'money') {
                url = '/pages/redpackets/wallet'
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
  onShow:function(e){
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
        url: `../foodConflict/content?id=${id}`,
      })
    }
    //red-packets
    this.setData({
      percent: app.globalData.currentPercent || 0,
      walletStatus: app.globalData.walletOpen || 0
    })
  },
  onLoad:function(options){
    //forward 
    if (options.from === 'share') {
      const id = options.id
      wx.navigateTo({
        url: `../foodConflict/content?id=${id}`,
      })
    }
    this.loadList()
    this.loadBannerList(this)
  },
  showDetail :function(e){
    if (e.detail.formId) {
      sendFormId(e.detail.formId,'foodFit')
    }
    const item = e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: `../foodConflict/content?id=${item.id}`,
      })
    }
  },
  pullDownRefresh: function (options) {
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  reachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadList(true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    const title = app.globalData.shareTab3 || ''
    return share(title, null, null, 'https://img.jinrongzhushou.com/banner/banner-foodFit.png')
  },
  bindBannerTap: (e) => {
    const item = e.currentTarget.dataset.item
    if (item) {
      if (item.openType === 'navigate') {
        wx.navigateTo({
          url: item.url,
        })
      } else if (item.openType === 'switchTab') {
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
  pageScroll: function (res) {
    const s = res.scrollTop || res.detail.scrollTop
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