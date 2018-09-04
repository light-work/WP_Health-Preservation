const app=getApp()
const { host } = require('../../utils/common.js')

Page({
  data: {
    array: null,
    index: 0,
    walletInfo:null,
    windowHeight:300,
    customerId:null,
    ruleTip:null
  },
  onLoad:function(options){
    const that = this
    const systeminfo = wx.getSystemInfoSync()
    if (wx.getSystemInfoSync()) {
      this.setData({
        windowHeight: systeminfo.windowHeight
      })
    }
    this.setData({
      customerId: app.globalData.customerId,
      ruleTip: app.globalData.ruleTip
    })
    wx.showLoading({
      title: '努力加载中...',
      icon: 'none'
    })
    
    wx.request({
      url: `${host}/assets/info/${app.globalData.userId}`,
      success: ({ data }) => {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          const walletInfo = data.data
          that.setData({
            walletInfo
          })
          let select=new Array()
          if(walletInfo.money>=1){
            select.push('1元')
          } 
          if (walletInfo.money >= 3){
            select.push('3元')
          } 
           if (walletInfo.money >= 5) {
            select.push('5元')
          }
          if(select.length===0){
            select.push('1元')
            select.push('3元')
            select.push('5元')
          }
          that.setData({
            array:select
          })
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
        index: e.detail.value
    })
  },
  bindFormSubmit:function(){
    const that=this
    if (!this.data.walletInfo || this.data.walletInfo.money<1){
      wx.showToast({
        title: '现金小于一元不能提现,赶紧去赚取金币吧',
        icon:'none'
      })
      setTimeout(()=>{
        wx.hideToast()
      },2000)
    }else{
      const index = parseInt(this.data.index) 
      const amount = index===0?1:index===1?3:index===2?5:null
      if (amount){
        wx.showLoading({
          title: '提现申请提交中...',
        })
        wx.request({
          url: `${host}/assets/withdraw`,
          method: 'POST',
          data: {
            userId: app.globalData.userId,
            amount: amount
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: ({ data }) => {
            wx.hideLoading()
            if (data.errorCode === 0) {
              wx.showToast({
                title: '提交成功',
                icon:'success'
              })
              setTimeout(()=>{
                wx.hideToast()
                wx.navigateBack({delta:1})
              },2000)
            } else if (data.errorCode === -2 ){
              wx.showToast({
                title: '每天只能提现一次哦!',
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            } else if (data.errorCode === -3) {
              wx.showToast({
                title: '超过当月最大提现数额!',
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            } else if (data.errorCode === -1 ) {
              wx.showToast({
                title: '出错了!',
                icon: 'none'
              })
              setTimeout(() => {
                wx.hideToast()
              }, 2000)
            }
          },
          fail:()=>{
            wx.showToast({
              title: '提交失败',
              icon: 'none'
            })
            setTimeout(() => {
              wx.hideToast()
            })
            wx.hideLoading()
          }
        })
      }else{
        wx.showToast({
          title: '无效的提现金额',
          icon: 'none'
        })
        setTimeout(() => {
          wx.hideToast()
        }, 2000)
      }
    }
  },
  bindQRCodePreview:function(){
    const urls = [this.data.walletInfo.QRCode]
    wx.previewImage({
      current: urls[0],
      urls: urls
    })
  }
})