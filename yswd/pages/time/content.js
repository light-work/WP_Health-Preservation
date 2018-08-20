var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, foodAppId} = require('../../utils/common.js')
Page({
    data: {
      cloudHost,
      data:'',
      foodList:[],
      articleArray: []
    },
    onLoad: function (options) {
      const that = this;
      const id = options.id
      wx.showLoading({
        title: '加载中',
      });
      wx.request({
        url: host + '/regimen/time/content/' + id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            var content = data.data.content
            content = content.replace(new RegExp('/d/file', "gm"), cloudHost + '/d/file')
            that.setData({
              data: data.data,
              foodList:data.data.foodList
            })
            WxParse.wxParse('article', 'html', content, that, 5);
          }
          wx.hideLoading();
        },
        fail: function (error) {
          wx.hideLoading();
        }

      })

      wx.request({
        url: host + '/regimen/time/recommend/'+id,
        success: function ({ data }) {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            that.setData({
              articleArray: data.articleArray
            })
          }
          wx.hideToast()
        },
        fail: function () {
          wx.hideToast()
        }
      })   
    },
  bindTapNewsView: (e) => {
    const item = e.detail
    if (item && item.articleType) {
      wx.navigateTo({
        url: '../time/article?type=' + item.articleType + '&id=' + item.id + '&category=' + item.category,
      })
    }
  },
  bindFoodItemTap:(e)=>{
    const item=e.currentTarget.dataset.item
    if(item){
      wx.navigateToMiniProgram({
        appId: foodAppId,
        path: 'pages/food/foodinfo?id=' + item.id,
        envVersion: 'develop'
      })
    }
  },
  onShareAppMessage:function(options){
    return  share()
  }
})