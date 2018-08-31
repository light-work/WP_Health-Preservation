// components/red-packets.js
const app=getApp()
const {host} =require('../utils/common.js')
const { sendFormId } = require('../utils/increase.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time:{
      type:Number,
      value:300
    },
    percent:{
      type:Number,
      value:null,
      observer:'_percentChange'
    },
    auth:{
      type:Boolean,
      value:false,
      observer: '_authChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    startPercent:0,//该参数只作为进度条不增长的页面使用
    totalItems:100,
    timer: null, 
    initNum: null,
    status: null, 
    userInfo: {}
  },
  ready:function(){
    let that = this
    //监听setPrecent 增长. 
    let val = app.globalData.setPercent
    Object.defineProperty(app.globalData, 'setPercent', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        if(value!==val){
          if (!that.data.timer){
            const timer = setInterval(() => {
              if (!that.data.timer) {
                that.showScoreAnimation(value)
                clearInterval(timer)
              } 
            }, 100)
          }
        }
        val = value
      },
      get: function () {
        return val
      }
    })
    //监听userid变化,ready事件中无法获取userid
    let userId = app.globalData.userId
    if (userId){
      wx.request({
        url: `${host}/assets/status/${userId}`,
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            app.globalData.authStatus=data.status
            that.setData({
              status: data.status
            })
            //status=1(开通钱包)
            if (data.status) {
              that.initCycle()
            }
          }
        }
      })
    }else{
      Object.defineProperty(app.globalData, 'userId', {
        configurable: true,
        enumerable: true,
        set: function (value) {
          wx.request({
            url: `${host}/assets/status/${value}`,
            success: ({ data }) => {
              if (data.errorCode === 0 && data.errorMsg === 'ok') {
                app.globalData.authStatus = data.status
                that.setData({
                  status: data.status
                })
              }
              //status=1(开通钱包)
              if(data.status){
                that.initCycle()
              }
            }
          })
          userId = value
        },
        get: function () {
          return userId
        }
      })
    }
    //监听userinfo
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        auth: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          auth: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            auth: true
          })
        }
      })
    }
  },
  detached:function(){
    clearInterval(this.data.timer)
    console.info('detached percent='+app.globalData.currentPercent)
  },
  methods: {
    initCycle:function(){
      let that = this
      if (that.data.percent === null) {//非tab页面
        const percent = app.globalData.currentPercent
        if (percent) {//初始进度
          this.setData({
            initNum: 0,
            startPercent: percent
          })
          that.showScoreAnimation(percent, 1)
        }
        //增长
        const firstTimer = setInterval(() => {
          if (!that.data.timer) {
            that.showScoreAnimation(that.endPercent())
            clearInterval(firstTimer)
          }
        }, 100)
      }
    },
    readSucess:function(){
      wx.request({
        url: `${host}/assets/view`,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: app.globalData.userId
        },
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            wx.showToast({
              title: '恭喜你,获取了' + data.addGoldCoin + '金币',
              icon: 'none'
            })
            setTimeout(() => {
              wx.hideToast()
            }, 2000)
          }
        }
      })
    },
    showScoreAnimation: function(rightItems,time,nextPercent){
      const that=this
      let initNum = that.data.initNum
      const totalItems = that.data.totalItems
      const  timer=setInterval(function () {
      initNum++;
      app.globalData.currentPercent = initNum >= 100 ? 0 : initNum
      if(initNum>=100){
        rightItems=20
        initNum=0
        that.readSucess()
      }
      if (initNum == rightItems) {
          clearInterval(that.data.timer)
          that.setData({
            initNum: rightItems == 100 ? 0 : rightItems,
            timer: null
          })
        } else {
          // 页面渲染完成
          // 这部分是灰色底层
        let cxt_arc = wx.createCanvasContext('canvasArc', that);//创建并返回绘图上下文context对象。
          cxt_arc.setLineWidth(6);//绘线的宽度
          cxt_arc.setStrokeStyle('#f8f2f2');//绘线的颜色
          cxt_arc.setLineCap('round');//线条端点样式
          cxt_arc.beginPath();//开始一个新的路径
          cxt_arc.arc(53, 53, 50, 0, 2 * Math.PI, false);//设置一个原点(53,53)，半径为50的圆的路径到当前路径
          cxt_arc.stroke();//对当前路径进行描边
          //这部分是蓝色部分
          cxt_arc.setLineWidth(6);
          cxt_arc.setStrokeStyle('#ff532d');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径
        cxt_arc.arc(53, 53, 50, -Math.PI * 1 / 2, 2 * Math.PI * (initNum / totalItems) - Math.PI * 1 / 2, false);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.draw();
        }
      }, time?time:that.data.time)
      that.setData({
        timer:timer
      })
    },
    _percentChange:function(n,o){
      console.info('_percentChange percent=' + app.globalData.currentPercent + ' start percent= ' + this.data.startPercent)
      if(n){
        const that=this
        const start = that.data.startPercent || 0
        that.setData({
          initNum: start>n?0:start,
          startPercent: n
        })
        that.showScoreAnimation(n, 1)
      }
     
    },
    endPercent:function(){
      const percent=app.globalData.currentPercent
      if(percent<20){
        return 20
      }else if(percent<45){
        return 45
      }else if(percent<70){
        return 70
      }else if(percent<95){
        return 95
      }
    },
    getUserInfo: function (e) {
      const that=this
      if (e.detail.errMsg === "getUserInfo:ok") {
        that.setData({
          userInfo: e.detail.userInfo,
          auth: true
        })
        wx.request({
          url: `${host}/assets/open`,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data:{
            userId: app.globalData.userId 
          },
          success:  ({data})=> {
            if (data.errorCode === 0 && data.errorMsg === 'ok') {
              app.globalData.authStatus = data.status
              app.globalData.userInfo = e.detail.userInfo
              that.setData({
                status: 1,
                initNum:0
              })
              wx.showToast({
                title: '开通红包成功,奖励' + data.addGoldCoin+'金币',
                icon:'none'
              })
              setTimeout(()=>{
                wx.hideToast()
              },2000)
              that.initCycle()
            }
          }
        })
      }
    },
    _authChange:function(nV,oV){
      console.info(nV)
      this.setData({
        status: nV?1:0
      })
    },
    bindViewWallet:function(e){
      console.info(111)
      if (e.detail.formId) {
        sendFormId(e.detail.formId, 'redpackets')
      }
      wx.navigateTo({
        url: `../redpackets/wallet`,
      })
    }
  }
})
