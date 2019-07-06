// miniprogram/pages/showtemplate/showtemplate.js
var app=getApp()
Page({

  
  data: {

  },

  
  onLoad: function (options) {
    var that=this
    wx.cloud.callFunction({
      name: 'gettemplate',
      data: {
        
      },
      success: res => {
        console.log(res)

        that.setData({
          template: res.result.data,
        })

      },
      fail: err => {
        console.log(err)
      }
    })
  },
  ondel:function(e){
    var that=this
    var delid=e.currentTarget.dataset.id
    console.log(delid)
    wx.cloud.callFunction({
      name: 'deltemplate',
      data: {
        delId:delid
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: '删除成功',
        })
        that.onLoad()
      },
      fail: err => {
        console.log(err)
      }
    })
  }


  
})