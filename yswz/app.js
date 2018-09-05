//app.js
const ald = require('./utils/ald-stat.js')
const { host, appid } = require('./utils/common.js')
App({
  onShow:function(options){
    //console.info(options)
  },
  onLaunch: function (options) {
    const that=this
    if (wx.getSystemInfo){
      that.globalData.height = wx.getSystemInfoSync().windowHeight
    }
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success: function () {
        const userid = wx.getStorageSync("app_user_id")
        if (!userid) {
          that.getUserId()
          console.info('user-id had removed ,reget')
        } else {
          that.globalData.userId = userid
          console.info('user-id from storage')
        }
      },
      fail: function () {
        that.getUserId()
        console.info(' get user_id when session time out or no session was not  found')
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userId: null,
    goDetail:false,
    detailId:null,
    currentPercent:0,
    setPercent:null,
    walletOpen:null,
    height:null,
    showRedPackets:null,
    exhangeRate:null,
    customerId:null,

    redPacketsTip: null,
    showRedPacketsTip:true,
    todayCoin:null,
    ruleTip:null,
    shareTab1:null,
    shareTab2: null,
    shareTab3: null,
    shareTab4: null,
    openTip:null
  },
  getUserId: function () {
    const that = this
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: `${host}/app/login/${appid}`,
            method: 'POST',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: ({ data }) => {
              if (data.errorCode === 0 && data.errorMsg === 'ok') {
                wx.setStorageSync("app_user_id", data.userId)
                that.globalData.userId = data.userId
              }
            }
          })
        }
      }
    })
  }
})