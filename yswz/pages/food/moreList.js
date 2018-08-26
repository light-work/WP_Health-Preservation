// pages/food/food.js
const { host, share} = require('../../utils/common.js')
Page({
  data: {
    page: 0,
    id:'',
    title:'',
    list :[],
    showHome:false
  },
  loadList:(that,append)=>{
    wx.showLoading({
      title: '努力加载中...',
    })
    //load  list
    wx.request({
      url: `${host}/food/subList/${that.data.id}`,
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
      fail: function () {
        wx.hideLoading()
      }
    })
  },
  bindItemTap:  (e)=> {
    const item = e.currentTarget.dataset.item
    if (item) {
      wx.navigateTo({
        url: '../food/foodinfo?id=' + item.id
      })
    }
  },
  onLoad:function(option){
     this.setData({
       id:option.id,
       title:option.title,
       showHome: !!option.from
     })
    this.loadList(this)
  },
  onPullDownRefresh: function (options) {
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadList(this)
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadList(this,true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    return share('健康食物', '', '', 'https://img.jinrongzhushou.com/banner/banner-food2.jpg')
  }
})