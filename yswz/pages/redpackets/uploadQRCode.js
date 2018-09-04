const app=getApp()
const {host}=require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:300,
    customerId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const systeminfo = wx.getSystemInfoSync()
    if (wx.getSystemInfoSync()) {
      this.setData({
        windowHeight: systeminfo.windowHeight
      })
    }
    this.setData({
      customerId: app.globalData.customerId||''
    })
  },
  uploadQRCode:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中....',
        })
        wx.uploadFile({
          url: `${host}/assets/QRCode/upload?userId=${app.globalData.userId}`,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json'
          },
          success: function ({data}) {
            data = JSON.parse(data)
            
            if (data.errorCode === 0 && data.errorMsg === 'ok') {
              wx.showToast({
                title: '上传成功!'
              })
              setTimeout(() => {
                wx.hideToast()
                wx.redirectTo({
                  url: '../redpackets/withdraw',
                })
              }, 2000)
              
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '上传失败,请稍后重试',
              icon:'none'
            })
            setTimeout(()=>{
              wx.hideToast()
            },1500)
          },
          complete:(data)=>{
            wx.hideLoading()
          }
        })
      }
    })
  },
  previewStepImg:(e)=>{
    const step = e.currentTarget.dataset.item
    const urls = ['https://img.jinrongzhushou.com/common/step-1.jpg', 'https://img.jinrongzhushou.com/common/step-2.jpg','https://img.jinrongzhushou.com/common/step-3.jpg']
    if(step){
      wx.previewImage({
        current: urls[step-1],
        urls: urls 
      })
    }
  }
})