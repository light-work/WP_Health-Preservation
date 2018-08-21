// pages/food/article.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost,share } = require('../../utils/common.js')
const { postView, postRelay, postLike } = require('../../utils/increase.js')

Page({
  data: {
    cloudHost,
    id:'',
    _type:'',
    category:'',
    title: '',
    upvoteText: '',
    recommendList: []
  },
  onLoad: function (options) {
    const that=this
    const id=options.id
    const _type=options.type
    this.setData({
      id: options.id, 
      _type: _type,
      category: options.category,
    }) 
    wx.showLoading({
      title: '努力加载中',
    });
    postView(id,_type)
    wx.getStorage({
      key: id,
      success: function (res) {
        var exist = res.data
        if (exist) {
          that.setData({
            upvoteText: '已赞'
          })
        }
      },
      fail: function (res) {
        that.setData({
          upvoteText: '点赞'
        })
      }
    }) 
    wx.request({
      url: host + '/article/'+_type+'/content/' + id,
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          var content = data.data.content
          content = content.replace(new RegExp('/d/file', "gm"), cloudHost + '/d/file')
          that.setData({
            title: data.data.mealId?data.data.mealId.title:data.data.infoId.title
          })
          WxParse.wxParse('article', 'html', content, that, 5);
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
      }
    })
    wx.request({
      url: host + '/article/' + _type+'/recommend/' + id,
      data: {
        start: 0,
        limit: 10,
        category: that.data.category
      },
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          that.setData({
            recommendList: data.list
          })
        }
      }
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    const that=this
    return share(that.data.title,(res)=>{
      postRelay(that.data.id, that.data._type)
    })
  },
  bindTapNewsView: function (e) {
    const item = e.detail
    if (item && item.articleType) {
      wx.redirectTo({
        url: '../food/article?type=' + item.articleType + '&id=' + item.id + '&category=' + item.category,
      })
    }
  },
  bindTapUpvote: function (e) {
    const that = this
    wx.getStorage({
      key: that.data.id,
      fail: function (res) {
        wx.setStorage({
          key: that.data.id,
          data: 'exist',
        })
        that.setData({
          upvoteText: '已赞'
        })
        postLike(that.data.id, that.data._type)
      }
    })
  }
})