// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, aritleType, infoAppid} = require('../../utils/common.js')
const {postView,postRelay,postLike}  =require('../../utils/increase.js')

Page({
  data: {
    aritleType,
    category:'',
    id:'',
    title:'',
    upvoteText:'',
    _type:'',
    page:0,
    recommendList:[]
  },
  onLoad: function (options) {
    
    const that = this;
    const id=options.id
    const _type=options.type
    this.setData({
      _type: _type,
      category:options.category,
      id:options.id
    }) 
    postView(id, _type)
    wx.getStorage({
      key: id,
      success: function(res) {
        var exist=res.data
        if(exist){
          that.setData({
            upvoteText:'已赞'
          })
        }
      },
      fail:function(res){
        that.setData({
          upvoteText: '点赞'
        })
      }
    })  
    wx.showLoading({
      title: '文章加载中',
    });
    wx.request({
      url: `${host}/article/${_type}/content/${id}`,
      success:function({data}){
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
         var content= data.data.content
          content = content.replace(new RegExp('/d/file', "gm"), cloudHost+'/d/file')
          that.setData({
            title: data.data.mealId ? data.data.mealId.title : data.data.infoId.title
          })
          WxParse.wxParse('article', 'html', content, that, 5);
        }
        wx.hideLoading();
      },
      fail:function(error){
        wx.hideLoading();
      }
     
    })
    this.loadRecommendList(this)
  },
  loadRecommendList:(that,append)=>{
    const _type = that.data._type
    const id=that.data.id
    if (append){
      wx.showLoading({
        title: '加载更多...',
      })
    }
    wx.request({
      url: `${host}/article/${_type}/recommend/${id}`,
      data: {
        start: that.data.page * 10,
        limit: 10,
        category: that.data.category
      },
      success: function ({ data }) {
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          if (append) {
            that.setData({
              recommendList: that.data.recommendList.concat(data.list)
            })
          } else {
            that.setData({
              recommendList: data.list
            })
          }
        }
        if(append){
          wx.hideLoading()
        }
      },
      fail:()=>{
        if (append) {
          wx.hideLoading()
        }
      }
    })
  },
  onShareAppMessage: function (ops) {
    const that=this
    return share(that.data.title,(res)=>{
      postRelay(that.data.id, that.data._type)
    })
  },
  bindTapUpvote:function(e){
    const that=this
    wx.getStorage({
      key: that.data.id,
      fail:function(res){
        //set storage
        wx.setStorage({
          key: that.data.id,
          data: 'exist',
        })
        that.setData({
          upvoteText: '已赞'
        })
        //post ajax
        postLike(that.data.id, that.data._type)
      }
    })
  },

  onReachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this,true)
    wx.hideNavigationBarLoading();
  }
})