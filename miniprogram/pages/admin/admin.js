// miniprogram/pages/admin/admin.js
var app=getApp()
Page({

 
  data: {
    hiddenmodalput: true,
  },
  modalinput: function () {

    this.setData({

      hiddenmodalput: !this.data.hiddenmodalput

    })

  },

  //取消按钮

  cancel: function () {

    this.setData({

      hiddenmodalput: true

    });

  },

  //确认

  confirm: function (e) {

    var that = this;
    const db = wx.cloud.database()
    if (that.data.addbiaoti != "" & that.data.addneirong != ""&that.data.addbiaoti != null & that.data.addneirong != null){
      db.collection('template').add({
        data: {
          biaoti: that.data.addbiaoti,
          text: that.data.addneirong
        },
        success: res => {
          console.log(res);
          wx.showToast({
            title: '导入成功',
          })
          that.setData({

            hiddenmodalput: true

          })
          wx.navigateTo({
            url: '../showtemplate/showtemplate',
          })
        },
        fail: err => {
          console.log(err)
          wx.showToast({
            title: '导入失败',
          })
        }


      })
    }
    else{
      wx.showToast({
        title: '内容不能为空！',
      })
    }
   
   
   

  },
  inputbiaoti: function (e) {
    this.setData({
      addbiaoti: e.detail.value,
    })
  },
  inputneirong: function (e) {
    this.setData({
      addneirong: e.detail.value,
    })
  },

  onLoad: function (options) {

  },
  useradmin:function(e){
    wx.navigateTo({
      url: '../userquery/userquery',
    })
  },
  querylog:function(){
    wx.navigateTo({
      url: '../showlogs/showlogs',
    })
  }


})