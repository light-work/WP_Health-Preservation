const { host, cloudHost ,share} = require('../../utils/common.js')
const app=getApp()
Page({
  data:{
    cloudHost,
    list:[]
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
        wx.hideLoading()
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  onLoad:function(options){
    app.globalData.showGoHome = false
    this.loadList(this)
  },
  bindItemTap: function (e) {
    const item = e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '../time/content?id='+item.id,
      })
    }
  },
  onShareAppMessage: function (options) {
    return share('12时辰养生时钟', '', '', 'https://img.jinrongzhushou.com/banner/banner-regimen.png')
  }
})