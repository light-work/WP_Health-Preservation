// pages/news/news.js
const { host, share, mealAppid, infoAppid } = require('../../utils/common.js')
Page({
    data: {
        foodInfo: '',
        good:[],
        bad:[],
        articleArray: []
    },
    onLoad: function (options) {
        const that = this;
        const id = options.id
        wx.showLoading({
            title: '加载中...',
        });
        wx.request({
          url: host + `/fit/detail/${id}`,
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
                      const key = item.split(":")[0].trim()
                      const value = item.split(":")[1].trim()
                      const food1 = key.split("+")[0].trim()
                      const food2 = key.split("+")[1].trim()
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
                      const key = item.split(":")[0].trim()
                      const value = item.split(":")[1].trim()
                      const food1 = key.split("+")[0].trim()
                      const food2 = key.split("+")[1].trim()
                      const foodName = data.data.name.trim()
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
        wx.request({
            url: host + '/food/recommend/' + id,
            success: function ({ data }) {
                if (data.errorCode === 0 && data.errorMsg === 'ok') {
                    that.setData({
                        articleArray: data.articleArray
                    })
                }
            }
        })
    },
    bindTapNewsView: (e) => {
      const item = e.detail
      if (item && item.articleType) {
        wx.navigateToMiniProgram({
          appId: item.articleType==='meal' ? mealAppid : infoAppid,
          path: `pages/choicest/main?id=${item.id}&category=${item.category}&type=${item.articleType}`,
          envVersion: 'develop'
        })
      }
  },
  onShareAppMessage: function (ops) {
    const foodInfo = this.data.foodInfo
    return share(foodInfo.name+'的相生相克', '', '', foodInfo.picUrl)
  }
})