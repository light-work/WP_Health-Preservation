const {host} =require('../../utils/common.js')
const app=getApp()
Page({

  data: {
    walletInfo:null,
    goldCoinList:null,
    moneyDetailList:null,
    tabType:'goldCoin'
  },
  loadCoinList:function(){
    wx.request({
      url: `${host}/assets/goldCoinDetail/${app.globalData.userId}`,
      success: ({ data }) => {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          this.setData({
            goldCoinList:data.list
          })
        }
      }
    })
  },
  onLoad: function (options) {
    this.loadCoinList()
  },
  onShow:function(options){
    wx.showLoading({
      title: '资产加载中...',
      icon:'none'
    })
    const that=this
    wx.request({
      url: `${host}/assets/info/${app.globalData.userId}`,
      success:({data})=>{
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          that.setData({
            walletInfo:data.data
          })
        }
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },
  goReadEarnDetail:(e)=>{
    wx.navigateTo({
      url: '../redpackets/rules'
    })
  },
  showMoneyDetails:function(e){
    this.setData({
      tabType:'money'
    })
    if (!this.data.moneyDetailList){
      wx.showLoading({
        title: '努力加载中...',
      })
      wx.request({
        url: `${host}/assets/moneyDetail/${app.globalData.userId}`,
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            this.setData({
              moneyDetailList: data.list
            })
          }
        },
        complete:function(){
          wx.hideLoading()
        }
      })
    }
  },
  showGoldDetails:function(){
    this.setData({
      tabType: 'goldCoin'
    })
  }
})