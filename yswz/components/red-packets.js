// components/red-packets.js
const app=getApp()
const {host,appid} =require('../utils/common.js')
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
    parentHide:{//两个都能增长的页面互相跳转,返回以后重置percent
      type: Boolean,
      value: false,
      observer: '_parentHideChange'
    },
    walletOpen:{
      type:Number,
      value:null,
      observer: '_walletOpenChange'
    },
    showTip:{
      type:Boolean,
      value:false
    },
    goldCoin:{
      type: Number,
      value: false,
      observer: '_goldCoinChange'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    totalItems:100,
    timer: null, 
    initNum: null,
    status: null,//钱包开通状态,
    showToast:false,
    toastTitle:null,//toast title
    addGoldCoin:null,//toast 奖励红包数量
    openMoney:false,//是否开通钱包
    tipTemplate:null,//显示模板
    moneyTip:null,//显示金币tip
    showOpen:false//是否打开红包
  },
  ready:function(){
    let that = this
    if (!app.globalData.showRedPackets){
      wx.request({
        url: `${host}/app/info/${appid}`,
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            app.globalData.showRedPackets = data.data.openMoney
            app.globalData.exchangeRate = data.data.exchangeRate
            app.globalData.customerId = data.data.customerId
            app.globalData.redPacketsTip = data.data.moneyTip
            app.globalData.ruleTip = data.data.ruleTip
            app.globalData.shareTab1 = data.data.shareTab1
            app.globalData.shareTab2 = data.data.shareTab2
            app.globalData.shareTab3 = data.data.shareTab3
            app.globalData.shareTab4 = data.data.shareTab4
            app.globalData.openTip = data.data.openTip
            that.setData({
              openMoney: app.globalData.showRedPackets  === 'Y',
              tipTemplate: app.globalData.redPacketsTip
            })
          }
        }
      })
    }else{
      this.setData({
        openMoney: app.globalData.showRedPackets==='Y',
        tipTemplate: app.globalData.redPacketsTip
      })
    }
    //监听setPrecent 增长. 
    let val = app.globalData.setPercent
    Object.defineProperty(app.globalData, 'setPercent', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        //console.info('page scroll--- '+value)
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
    if (app.globalData.walletOpen){
      that.setData({
        status: app.globalData.walletOpen
      })
    }
    
    if (that.data.status===1){//status=1的时候代表钱包已经开通,不重复验证status
      that.initCycle()
    } else { //status!=1 监听userid变化,ready事件中无法获取异步的userid,
      let userId = app.globalData.userId
      if (userId) {
        that.getWalletStatus(userId, (data) => {
          //status=1(开通钱包)
          if (data.status) {
            that.initCycle()
          }
        }, 'user-id is not null')
        that.getGoldCoin(userId)
      } else {
        Object.defineProperty(app.globalData, 'userId', {
          configurable: true,
          enumerable: true,
          set: function (value) {
            that.getWalletStatus(value, (data) => {
              //status=1(开通钱包)
              if (data.status) {
                that.initCycle()
              }
              that.getGoldCoin(value)
            }, 'user-id is  null')
            userId = value
          },
          get: function () {
            return userId
          }
        })
      }
    }
  },
  detached:function(){
    clearInterval(this.data.timer)
  },
  methods: {
    getGoldCoin:function(userId){
      const that=this
      if (app.globalData.todayCoin==null){
        wx.request({
          url: `${host}/assets/info/${userId}`,
          success: ({ data }) => {
            if (data.errorCode === 0 && data.errorMsg === 'ok') {
              const coin=app.globalData.todayCoin||0
              app.globalData.todayCoin = coin + (data.data.todaySum||0)
              let template =that.data.tipTemplate
              if (app.globalData.todayCoin && template) {
                template = template.replace(new RegExp('{{todaySum}}', "gm"), app.globalData.todayCoin)
                that.setData({
                  moneyTip: template,
                  goldCoin: (data.data.todaySum || 0)
                })
              }
            }
          }
        })
      }
    },
    getWalletStatus: function (userId,callback, where){
      const that=this
      wx.request({
        url: `${host}/assets/status/${userId}`,
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            app.globalData.walletOpen = data.status
            that.setData({
              status: data.status
            })
            if(typeof callback==='function'){
              callback(data)
            }
          }
        }
      })
    },
    initCycle:function(){
      let that = this
      if (that.data.percent === null) {//非tab页面
        const percent = app.globalData.currentPercent
        if (percent) {//初始进度
          this.setData({
            initNum: 0
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
      const that=this
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
            that.setData({
              showToast:true,
              addGoldCoin: data.addGoldCoin,
              toastTitle:'阅读奖励'
            })
            const coin = app.globalData.todayCoin || 0
            app.globalData.todayCoin = coin + (data.addGoldCoin || 0)
            setTimeout(() => {
              that.setData({
                showToast: false,
                addGoldCoin:null,
                toastTitle: ''
              })
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
        cxt_arc.arc(43, 43, 40, 0, 2 * Math.PI, false);//设置一个原点(53,53)，半径为40的圆的路径到当前路径
          cxt_arc.stroke();//对当前路径进行描边
          //这部分是蓝色部分
          cxt_arc.setLineWidth(6);
          cxt_arc.setStrokeStyle('#ff532d');
          cxt_arc.setLineCap('round')
          cxt_arc.beginPath();//开始一个新的路径
        cxt_arc.arc(43, 43, 40, -Math.PI * 1 / 2, 2 * Math.PI * (initNum / totalItems) - Math.PI * 1 / 2, false);
          cxt_arc.stroke();//对当前路径进行描边
          cxt_arc.draw();
        }
      }, time?time:that.data.time)
      that.setData({
        timer:timer
      })
    },
    _percentChange:function(n,o){
      // console.info('_percentChange percent=' + app.globalData.currentPercent + ' start percent= ' + this.data.initNum)
      if(n){
        const that=this
        const start = that.data.initNum || 0
        that.setData({
          initNum: start>n?0:start
        })
        that.showScoreAnimation(n, 1)
      }
     
    },
    _parentHideChange:function(n,o){
      if(o&& !n){//由hide变show
       console.info('页面切换 timer='+this.data.timer)
        const that = this
        const start = that.data.initNum || 0
        that.setData({
          initNum: start > app.globalData.currentPercent ? 0 : start
        })
        clearInterval(that.data.timer)
        that.showScoreAnimation(app.globalData.currentPercent, 1)
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
        app.globalData.userInfo = e.detail.userInfo
        that.setData({
          showOpen:true
        })
      }
    },
    openWallet:function(){
      const that=this
      wx.request({
        url: `${host}/assets/open`,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: app.globalData.userId,
          userAvatarUrl: app.globalData.userInfo.avatarUrl,
          userNickName: app.globalData.userInfo.nickName,
          userGender: app.globalData.userInfo.gender,
          userCity: app.globalData.userInfo.city,
          userProvince: app.globalData.userInfo.province,
          userCountry: app.globalData.userInfo.country
        },
        success: ({ data }) => {
          if (data.errorCode === 0 && data.errorMsg === 'ok') {
            app.globalData.walletOpen = 1
           
            that.setData({
              status: 1,
              initNum: 0,
              showOpen: false
            })
            const coin = app.globalData.todayCoin || 0
            app.globalData.todayCoin = coin + (data.addGoldCoin || 0)

            that.setData({
              showToast: true,
              addGoldCoin: data.addGoldCoin,
              toastTitle: '开通奖励'
            })
            wx.setStorage({
              key: "postInfoDate",
              data: that.getDateStr()
            })
            setTimeout(() => {
              that.setData({
                showToast: false,
                addGoldCoin: null,
                toastTitle: ''
              })
              wx.navigateTo({
                url: '../redpackets/wallet',
              })
            }, 2000)
            //that.initCycle()
          }
        }
      })
    },
    _walletOpenChange:function(nV,oV){
      this.setData({
        showOpen: false
      })
      const that=this
      if (nV===1 && that.data.status!==1){
        
        that.getWalletStatus(app.globalData.userId,null, 'walletopen change')
      }
    },
    bindViewWallet:function(e){
      if (e.detail.formId) {
        sendFormId(e.detail.formId, 'redpackets')
      }
      wx.navigateTo({
        url: `../redpackets/wallet`,
      })
      const date = wx.getStorageSync("postInfoDate")
      const today = this.getDateStr()
      const userInfo = app.globalData.userInfo
      if ((!date || date != today )&& userInfo && app.globalData.userId){
        wx.setStorage({
          key: "postInfoDate",
          data: today
        })
        wx.request({
          url: `${host}/app/updateUserInfo`,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            userId: app.globalData.userId,
            userAvatarUrl: userInfo.avatarUrl,
            userNickName: userInfo.nickName,
            userGender: userInfo.gender,
            userCity: userInfo.city,
            userProvince: userInfo.province,
            userCountry: userInfo.country
          }
        })
      }
    },
    getDateStr:()=>{
      const date=new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      return [year, month, day].join('-')
    },
    closeTip:function(){
      app.globalData.showRedPacketsTip=false
      this.setData({
        showTip:false
      })
    },
    _goldCoinChange:function(n,o){
      let template = this.data.tipTemplate
      if (n && template ){
        template = template.replace(new RegExp('{{todaySum}}', "gm"), n)
        this.setData({
          moneyTip: template
        })
      }
    }
  }
})
