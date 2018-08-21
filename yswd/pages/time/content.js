var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, infoAppid, foodAppId, aritleType} = require('../../utils/common.js')
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
      if (item.articleType === aritleType){
        wx.navigateTo({
          url: `../choicest/content?id=${item.id}&category=${item.category}&type=${item.articleType}`
        })
      } else if (item.articleType ==='information'){
        wx.navigateToMiniProgram({
          appId: infoAppid,
          path: `pages/choicest/main?id=${item.id}&category=${item.category}&type=${item.articleType}`,
          envVersion: 'develop'
        })
      }
    }
  },
  bindFoodItemTap:(e)=>{
    const item=e.currentTarget.dataset.item
    console.info(foodAppId)
    if(item){
      wx.navigateToMiniProgram({
        appId: foodAppId,
        path: `pages/food/foodinfo?id=${item.id}`,
        envVersion: 'develop'
      })
    }
  },
  onShareAppMessage:function(options){
    return  share()
  }
})