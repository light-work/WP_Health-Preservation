// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, share, aritleType, infoAppid} = require('../../utils/common.js')
const {postView,postRelay,postLike}  =require('../../utils/increase.js')

Page({
  data: {
    category:'',
    id:'',
    title:'',
    upvoteText:'',
    _type:'',
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

    wx.request({
      url: `${host}/article/${_type}/recommend/${id}`,
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
    const that=this
    return share(that.data.title,(res)=>{
      postRelay(that.data.id, that.data._type)
    })
  },
  bindTapNewsView: function (e) {
    const item = e.detail
    if (item) {
      if (item.articleType === aritleType) {
        wx.redirectTo({
          url: `../choicest/content?id=${item.id}&category=${item.category}&type=${item.articleType}`
        })
      } else {
        wx.navigateToMiniProgram({
          appId: infoAppid,
          path: `pages/choicest/main?id=${item.id}&category=${item.category}&type=${item.articleType}`,
          envVersion: 'develop'
        })
      }
    }
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
  }
})