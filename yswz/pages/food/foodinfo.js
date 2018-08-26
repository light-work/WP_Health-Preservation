// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, mealAppid, infoAppid} =require('../../utils/common.js')
Page({
    data: {
      cloudHost,
      foodInfo:'',
      property:'',
      showTip:false,
      articleArray:[],
      fitCount:0,
      showHome:false,
      id:''
    },
  loadRecommendList:(that,append)=>{
      const id = that.data.id
      if (append) {
        wx.showLoading({
          title: '加载更多...',
        })
      }
      wx.request({
        url:`${host}/food/recommend/${id}`,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            if (append) {
              that.setData({
                articleArray: that.data.articleArray.concat(data.articleArray)
              })
            } else {
              that.setData({
                articleArray: data.articleArray
              })
            }
          }
          if (append) {
            wx.hideLoading()
          }
        },
        fail: function () {
          if (append) {
            wx.hideLoading()
          }
        }
      })
    },
    onLoad: function(options) {
      const that = this;
      const id = options.id
      this.setData({
        id: id,
        showHome: !!options.from
      })
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: host + '/food/detail/' + id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            var content = data.data.content
            content = content.replace(new RegExp('/d/file', "gm"), cloudHost + '/d/file')
            that.setData({
              foodInfo:data.data.foodId,
              fitCount: data.data.fitCount,
              property: data.data.property
            })
            WxParse.wxParse('article', 'html', content, that, 5);
          }
          wx.hideLoading();
        },
        fail: function (error) {
          wx.hideLoading();
        }
      })
      this.loadRecommendList(this)
    },
  foodConflictTap : function(e){
      wx.navigateTo({
        url: '../foodConflict/content?id=' + this.data.foodInfo.id,
      })
  },
  onShareAppMessage: function (ops) {
    const foodInfo = this.data.foodInfo
    return share(foodInfo.name + '的功效', '', '', foodInfo.picUrl)
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    if (s > 150 && !this.data.showTip) {
      this.setData({
        showTip: true
      })
    } else if (s < 150) {
      this.setData({
        showTip: false
      })
    }
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  }
})