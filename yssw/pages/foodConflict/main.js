const { host ,share} = require('../../utils/common.js')
Page({
  data:{
    page: 0,
    list:[]
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
  onLoad:function(options){
   this.loadList()
  },
  showDetail :function(e){
    const item = e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '../foodConflict/content?id='+item.id,
      })
    }
  },
  onPullDownRefresh: function (options) {
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadList(true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    return share('', '', '', 'https://img.jinrongzhushou.com/banner/banner-foodFit.png')
  }
})