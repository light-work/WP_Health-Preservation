// pages/food/main.js
const { host, cloudHost, share, appid } = require('../../utils/common.js')
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
    list:[]
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
      url: `${host}/app/banner/${appid}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          that.setData({
            bannerList:data.list
          })
        }
      }
    })
  },
  onLoad: function (option) {
    this.loadData()
  },
  bindItemTap:(e)=>{
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
    const _type = e.currentTarget.dataset.item
    if (_type){
      wx.navigateTo({
        url: '../food/moreList?id=' + _type.id,
      })
    }
  },
  onShareAppMessage: function (options) {
    return share()
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
  }
})