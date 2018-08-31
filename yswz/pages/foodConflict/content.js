// pages/news/news.js
const { host, share} = require('../../utils/common.js')
const app=getApp()
Page({
  data: {
      foodInfo: '',
      good:[],
      bad:[],
      showTip:false,
      showHome:false,
      articleArray: [],
      id:''
  },
  loadRecommendList: (that, append) => {
    const id = that.data.id
    if (append) {
      wx.showLoading({
        title: '加载更多...',
      })
    }
    wx.request({
      url: `${host}/food/recommend/${id}`,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          if (append) {
            that.setData({
              articleArray: that.data.articleArray.concat(data.articleArray)
            })
          } else {
            that.setData({
              articleArray: data.articleArray
            })
          }
        }
        if (append) {
          wx.hideLoading()
        }
      },
      fail: function () {
        if (append) {
          wx.hideLoading()
        }
      }
    })
  },
  onLoad: function (options) {
      const that = this;
      const id = options.id
      if (!app.globalData.showGoHome) {
        app.globalData.showGoHome = !!options.from
      }
      that.setData({
        id: id,
        showHome: app.globalData.showGoHome
      })
      wx.showLoading({
          title: '加载中...',
      });
      wx.request({
        url: `${host}/fit/detail/${id}`,
          success: function ({ data }) {
              if (data.errorCode === 0 && data.errorMsg === 'ok') {
                  that.setData({
                    foodInfo: data.data,
                    property: data.data.property
                  })
                var goodArray = data.data.good
                if (goodArray.length>0){
                  const props=new Array()
                  for (var x = 0; x < goodArray.length;x++){
                    const item=goodArray[x]
                    const key = item.split(":")[0] ? item.split(":")[0].trim():''
                    const value = item.split(":")[1] ? item.split(":")[1].trim():''
                    const food1 = key.split("+")[0] ? key.split("+")[0].trim():''
                    const food2 = key.split("+")[1] ? key.split("+")[1].trim():''
                    const foodName = data.data.name.trim()
                    if (food1 ===foodName ){
                        props.push({
                          side:'R',
                          food:food2,
                          text:value
                        })
                    }else if(food2===foodName){
                      props.push({
                        side: 'L',
                        food: food1,
                        text: value
                      })
                    }
                  }
                  that.setData({
                    good:props
                  })
                }
                var badArray = data.data.bad
                if (badArray.length > 0) {
                  const props = new Array()
                  for (var x = 0; x < badArray.length; x++) {
                    const item = badArray[x]
                    const key = item.split(":")[0] ? item.split(":")[0].trim():''
                    const value = item.split(":")[1] ? item.split(":")[1].trim():''
                    const food1 = key.split("+")[0] ? key.split("+")[0].trim():''
                    const food2 = key.split("+")[1] ? key.split("+")[1].trim():''
                    const foodName = data.data.name ? data.data.name.trim():''
                    if (food1 === foodName) {
                      props.push({
                        side: 'R',
                        food: food2,
                        text: value
                      })
                    } else if (food2 === foodName) {
                      props.push({
                        side: 'L',
                        food: food1,
                        text: value
                      })
                    }
                  }
                  that.setData({
                    bad: props
                  })
                }
                if(data.data.bad.length>0){

                }
              }
              wx.hideLoading();
          },
          fail: function (error) {
              wx.hideLoading();
          }
      })
      this.loadRecommendList(this)
  },
  onShareAppMessage: function (ops) {
    const foodInfo = this.data.foodInfo
    return share(foodInfo.name+'的相生相克', '', '', foodInfo.picUrl)
  },
  onPageScroll: function (res) {
    const s = res.scrollTop
    if (s > 150 && !this.data.showTip) {
      this.setData({
        showTip: true
      })
    } else if (s < 150) {
      this.setData({
        showTip: false
      })
    }
  },
  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  }
})