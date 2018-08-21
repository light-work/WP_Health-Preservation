var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, mealAppid, infoAppid} = require('../../utils/common.js')
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
          wx.hideLoading()
        },
        fail: function () {
          wx.hideLoading()
        }
      })   
    },
  bindTapNewsView: (e) => {
    const item = e.detail
    if (item && item.articleType) {
      wx.navigateToMiniProgram({
        appId: item.articleType==='meal' ? mealAppid : infoAppid,
        path: `pages/choicest/main?id=${item.id}&category=${item.category}&type=${item.articleType}`,
        envVersion: 'develop'
      })
    }
  },
  bindFoodItemTap:(e)=>{
    const item=e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '../food/foodinfo?id='+item.id,
      })
    }
  },
  onShareAppMessage:function(options){
    return  share()
  }
})