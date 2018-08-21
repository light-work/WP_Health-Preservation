// pages/components/recommend-list.js
Component({
  properties: {
    list:Array,
    title:{
      type:String,
      value:'相关推荐'
    }
  },
  methods: {
    bindItemTap:function(e){
      const item = e.currentTarget.dataset.item
      if (item) {
        this.triggerEvent('itemtap', item, {})
      }
    }
  }
})
