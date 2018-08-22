//index.js
//获取应用实例
const app = getApp()
const { host, share, aritleType, mealappid, infoAppid, foodAppId } = require('../../utils/common.js')
const { getPageIndex, setPageIndex } = require('../../utils/common.js')

Page({
  data: {
    bannerList: [],
    indicatorDots: true,
    indicatorColor: "#000",
    indicatorActiveColor: "#fff",
    autoplay: true,
    interval: 5000,
    duration: 500,
    newList: []
  },
  loadNewsList:function(append){
    wx.showLoading({
      title: '努力加载中...',
    })
    var that = this
    wx.request({
      url: `${host}/article/${aritleType}/main`,
      data: {
        start: getPageIndex('index') * 10,
        limit: 10
      },
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {  
          if(append){
            that.setData({
              newList: that.data.newList.concat(data.list) 
            })
          }else{
            that.setData({
              newList: data.list
            })
          }
          setPageIndex('index', data.pageObj.currentPage)
        }
        wx.hideLoading()
      },
      fail: function (r) {
        wx.hideLoading()
      }
    })
    wx.request({
      url: `${host}/app/banner/${mealappid}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          const list =data.list
          if(list && list.length>0){
            const array=new Array()
           
            list.forEach((item)=>{
              const target = item.redirect === 'call' ?'miniProgram':''
              const openType = item.action === 'regimen' ? 'switchTab' :'navigate'
              var path=''
              if(item.target===foodAppId){
                if (item.action ==='foodFit'){
                  path ='pages/foodConflict/main'
                }else if(item.action==='main'){
                  path = 'pages/food/main'
                }
              } else if (item.target === infoAppid || item.target === mealappid){
                path = 'pages/choicest/main'
              }else if(!item.target){
                path = '/pages/time/list'
              }
              array.push({
                target:target,
                open:openType,
                path:path,
                appId: item.target,
                title:item.title,
                imgSrc:item.imgSrc
              })
            })
            that.setData({
              bannerList: array
            })
          }
        }
      }
    })
  },
  onLoad: function () {
    this.loadNewsList()
    var that=this
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindTapNewsView:function(e){
    const item=e.currentTarget.dataset.item
    if(item){
      wx.navigateTo({
        url: '../choicest/content?id=' + item.id + '&category=' + item.category + '&type=' + item.articleType,
      })
    }
  },
  onPullDownRefresh:function(options){
    wx.showNavigationBarLoading();
    this.loadNewsList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(options){
    wx.showNavigationBarLoading();
    this.loadNewsList(true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    return share()
  }
})
