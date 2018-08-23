//index.js
//获取应用实例
const app = getApp()
const { host, share, aritleType, mealappid, infoAppid, foodAppId } = require('../../utils/common.js')

Page({
  data: {
    bannerList: [],
    indicatorDots: true,
    indicatorColor: "#000",
    indicatorActiveColor: "#fff",
    autoplay: true,
    interval: 5000,
    duration: 500,
    page:0,
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
        start: that.data.page*10,
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
                if (item.action.indexOf('article_') > -1) {
                  const infoArray = item.action.split('_')
                  path = `pages/choicest/content?id=${infoArray[2]}&category=${infoArray[3]}&type=${infoArray[1]}` 
                } else {
                  path = 'pages/choicest/list'
                }

              } else if (!item.target) {
                if (item.action.indexOf('article_') > -1) {
                  const infoArray = item.action.split('_')
                  path = `/pages/choicest/content?id=${infoArray[2]}&category=${infoArray[3]}&type=${infoArray[1]}` 
                } else {
                  path = '/pages/time/list'
                }
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
    this.setData({
      page: 0
    })
    wx.showNavigationBarLoading();
    this.loadNewsList()
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(options){
    this.setData({
      page: this.data.page+1
    })
    wx.showNavigationBarLoading();
    this.loadNewsList(true)
    wx.hideNavigationBarLoading();
  },
  onShareAppMessage: function (options) {
    return share('养生问答大全', '', '','https://img.jinrongzhushou.com/banner/banner-meal2.png')
  }
})
