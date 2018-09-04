// pages/news/news.js
var WxParse = require('../wxParse/wxParse.js');
const { host, cloudHost, shareContent } = require('../../utils/common.js')
const {postView,postRelay,postLike}  =require('../../utils/increase.js')
const app=getApp()
Page({
  data: {
    category: '',
    id: '',
    title: '',
    upvoteText: '',
    page: 0,
    picUrl:'',
    showTip:false,
    recommendList: [],
    top:0,
    lastScroll:0,
    windowHeight: 300
  },
  onLoad: function (options) {
    const systeminfo=wx.getSystemInfoSync()
    if (wx.getSystemInfoSync()){
      this.setData({
        windowHeight:systeminfo.windowHeight
      })
    }
    
    const that = this;
    const id=options.id
    this.setData({
      category:options.category,
      id:options.id
    }) 
    postView(id)
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
      url: `${host}/article/content/${id}`,
      success:function({data}){
        if (data.errorCode === 0 && data.errorMsg === 'ok') {
          var content = data.data.content
          // content = content.replace(new RegExp('/d/file', "gm"), cloudHost+'/d/file')
          that.setData({
            title: data.data.articleId.title,
            picUrl: data.data.articleId.picUrl

          })
          WxParse.wxParse('article', 'html', content, that, 5);
          // setTimeout(()=>{
          //   that.getScrollOffset()
          // },100)
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
    const id = that.data.id
    if (append) {
      wx.showLoading({
        title: '加载更多...',
      })
    }
    wx.request({
      url: `${host}/article/recommend/${id}`,
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
        if (append) {
          wx.hideLoading()
        }
      },
      fail: () => {
        if (append) {
          wx.hideLoading()
        }
      }
    })
  },
  onShareAppMessage: function (ops) {
    const that=this
    return shareContent(that.data.title,(res)=>{
      postRelay(that.data.id)
    }, '', that.data.picUrl,'pages/choicest/list')
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
        postLike(that.data.id)
      }
    })
  },

  reachBottom: function (options) {
    this.setData({
      page: this.data.page + 1
    })
    wx.showNavigationBarLoading();
    this.loadRecommendList(this, true)
    wx.hideNavigationBarLoading();
  },
  pageScroll:function(res){
    const s = res.scrollTop || res.detail.scrollTop
    if (s > 150 && !this.data.showTip){
      this.setData({
        showTip: true
      })
    } else if (s<150){
      this.setData({
        showTip: false
      })
    }
    if(s>this.data.top){
      //console.info('阅读完毕!')
    }
    if(Math.abs(s-this.data.lastScroll)>=50 ){
      app.globalData.setPercent = app.globalData.currentPercent+25
    }
  },
  getScrollOffset: function () {
    const that=this
    var query = wx.createSelectorQuery();
    query.select('#article_end').boundingClientRect()
    query.exec(function (res) {
      if(res[0]){
        console.info(res[0].top)
        that.setData({
          top: res[0].top
        })
      }
    })
  }
})