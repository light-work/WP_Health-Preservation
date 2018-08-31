// pages/components/recommend-list.js
const { mealappid, foodAppId, aritleType, infoAppid } = require('../utils/common.js')
Component({
  properties: {
    list:Array,
    articleType:String,
    openType:String,
    title:{
      type:String,
      value:'相关推荐'
    }
  },
  data:{
    mealappid,
    foodAppId,
    infoAppid
  }
})
