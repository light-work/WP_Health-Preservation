// pages/choicest/redpackets.js
const app=getApp()
const { setWatcher} = require("../../utils/watcher.js");
Page({
  data: {
    userInfo:{},
    hasUserInfo:false
  },
  draw:function(avatar,code){
    const ctx = wx.createCanvasContext('test');
    //draw bg
    ctx.drawImage('../img/bg.png', 0, 0, 320, 568);
    //text
    ctx.setTextAlign('left')
    ctx.setFontSize(18);
    ctx.setFillStyle('#FFFFFF')
    ctx.fillText('我在这里赚了', 115, 115);
    ctx.setFillStyle('#FFEC8B')
    ctx.fillText('10元', 140, 140);
    ctx.setFillStyle('#EE3B3B')
    ctx.fillText('让你快速获得', 105, 220);
    ctx.setFillStyle('#EE3B3B')
    ctx.setFontSize(60);
    ctx.fillText('60.00元', 55, 290);
    ctx.stroke()

    let r = 60;
    let d = r * 2;
    let cx = 100;
    let cy = 330;
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(code, cx, cy, d, d);
    ctx.restore()
    let _r = 32;
    let _d = _r * 2;
    let _cx = 128;
    let _cy = 25;
    ctx.arc(_cx + _r, _cy + _r, _r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(avatar, _cx, _cy, _d, _d);
    ctx.draw()
    //code

    wx.canvasToTempFilePath({
      canvasId: 'test',
      fileType: 'jpg',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
            });
          },
          fail() {
            wx.hideLoading()
          }
        })
      }
    })
    
  },
  onLoad: function (options) {
    setWatcher(this)
    //this.draw()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },
  onShareAppMessage: function () {
  
  },
  watch:{
    'userInfo':{
      handler(value){
        this.getImageInfo(value.avatarUrl)
        
      }
    }
  },
  getImageInfo(url) {    //  图片缓存本地的方法
    const that=this
    if (url) {
      const p1 = new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: res => {
            console.info('get avatar success')
            resolve(res)
          },
          fail: error => {
            reject(error)
          }
        })
      })
      const p2 = new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: 'https://img.jinrongzhushou.com/common/wp_ys_qr_code.jpg',
          success: (res) => {
            console.info('get qrcode success')
            resolve(res);
          },
          fail: err => {
            reject(error)
          }
        })
      })
    Promise.all([p1,p2]).then((result)=>{
      const avatarResult=result[0]
      const qrcodeResult=result[1]
      if (avatarResult.errMsg ==='getImageInfo:ok' &&
        qrcodeResult.errMsg === 'getImageInfo:ok'){
        that.draw(avatarResult.path,qrcodeResult.path)
      }
     }).catch((error)=>{
       console.info(error)
     })
    }
  }
})