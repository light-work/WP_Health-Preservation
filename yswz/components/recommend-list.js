// pages/components/recommend-list.js
const { foodAppId } = require('../utils/common.js')
Component({
  properties: {
    list:Array,
    title:{
      type:String,
      value:'相关推荐'
    }
  },
  data:{
    foodAppId
  }
})
