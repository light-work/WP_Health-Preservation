// components/go-home.js
const app=getApp()
Component({
  properties: {
    home:String
  },
  data:{
    openType: '',
    url: String,
    delta:1,
  },
  ready:function(e){
    console.info(e)
    var url,openType
    if (this.data.home==='food'){
      url = '/pages/food/main'
      openType = 'switchTab'
    } else if (this.data.home==='list'){
     const previewPage= this.prevPage()

      if (previewPage ==='/pages/choicest/list'){
        openType = 'navigateBack'
      }else{
        url = '../choicest/list'
        openType = 'switchTab'
      }
    } else if (this.data.home==='foodTime'){
      url = '/pages/food/main'
      openType = 'switchTab'
    } else if (this.data.home==='listTime'){
      url = '/pages/choicest/list'
      openType = 'switchTab'
    }
    this.setData({
      url:url?url:'',
      openType: openType
    })
  },
  methods:{
    prevPage:function () {
      const pages = getCurrentPages()
      if (pages.length <= 1) {
        return ''
      } else {
        return "/"+pages[pages.length - 2].route
      }
    } ,
    goHome() {
      if (this.data.openType === 'navigateBack') {
        // app.?.showGoHome = false
        wx.navigateBack({
          delta: this.data.delta
        })
      } else if (this.data.openType === 'switchTab') {
        wx.switchTab({
          url: this.data.url,
          success: function () {
            app.globalData.showGoHome = false
          }
        })
      }
    }
  }
})
