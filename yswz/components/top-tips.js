// components/to'p.js
Component({
  ready:function(){
    var showTip=wx.getStorageSync('showTip')
    this.setData({
      showTip: showTip!=='N'
    })
  },
  data: {
    showTip:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeTip:function(){
      wx.setStorageSync('showTip','N')
      this.setData({
        showTip:false
      })
    }
  }
})
