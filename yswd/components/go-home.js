// components/go-home.js
Component({
  properties: {
    home:String
  },
  data:{
    openType: '',
    url: String,
    show: true,
    delta:1,
  },
  ready:function(){
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
    }
  }
})
