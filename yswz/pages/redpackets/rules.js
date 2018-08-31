const { host } = require('../../utils/common.js')
const app = getApp()

Page({

  data: {
    list:null
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中....',
    })
    wx.request({
      url: `${host}/assets/goldCoinDetailForToday/${app.globalData.userId}`,
      success: ({ data }) => {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          this.setData({
            list: data.list
          })
        }
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  }
})