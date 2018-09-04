const { host, cloudHost ,share} = require('../../utils/common.js')
const app=getApp()
Page({
  data:{
    cloudHost,
    list: [],
    percent: null,
    walletStatus: null,
    windowHeight: app.globalData.height
  },
  loadList:(that)=>{
    wx.showLoading({
      title: '努力加载中...',
    })
    //load top list
    wx.request({
      url: host + '/regimen/time/main',
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          that.setData({
            list: data.list
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  onLoad:function(options){
    //forward 
    if (options.from === 'share') {
      const id = options.id
      wx.navigateTo({
        url: `../time/content?id=${id}`,
      })
    }
    this.loadList(this)
  },
  bindItemTap: function (e) {
    const item = e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: `../time/content?id=${item.id}`
      })
    }
  },
  onShareAppMessage: function (options) {
    const title = app.globalData.shareTab4 || '12时辰养生时钟'
    return share(title, null, null, 'https://img.jinrongzhushou.com/banner/banner-regimen.png')
  },
  onShow:function(options){
    this.setData({
      percent: app.globalData.currentPercent || 0,
      walletStatus: app.globalData.walletOpen || 0
    })
  }
})