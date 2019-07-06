// miniprogram/pages/showuser/showuser.js
const app=getApp()
Page({

  
  data: {
    userlist:null,
    hiddenmodalput: true,
    queryid:null,
    limit:null,
  },


  //点击按钮痰喘指定的hiddenmodalput弹出框

  modalinput: function (e) {
    console.log(e)

    this.setData({

      hiddenmodalput: !this.data.hiddenmodalput,
      queryid:e.currentTarget.dataset.id,
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
    console.log(e);
    var that = this;
    if(that.data.limit==null){
      wx.showToast({
        title: '请设置权限',
      })
    }
    else{
      wx.cloud.callFunction({
        name:'changelimit',
        data:{
          jlid:that.data.queryid,
          cglimit:that.data.limit,
        },
        success:res=>{
          console.log(res)
          wx.showToast({
            title: '设置成功',
          })
          that.setData({
            hiddenmodalput: !this.data.hiddenmodalput,
          })
          that.onLoad()

        },
        fail:err=>{
          console.log(err)
          wx.showToast({
            title: '设置失败',
          })
        }
      })

    }
 
  },






  onLoad:function(){
    var that=this;
    wx.cloud.callFunction({
      name:"getuser",
      data:{},
      success:res=>{
        console.log(res);
        that.setData({
          userlist:res.result.data,
        })
      },
      fail:err=>{
        console.log(err)
      }

    })
  },
  ondel:function(e){
    console.log(e);
    var that=this;
    var uid=e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name:"deletuser",
      data:{
        userid:uid,
        ck1:null,
        ck2:null,
      },
      success:res=>{
        console.log(res);
        wx.showToast({
          title: '删除成功',
        })
        that.onLoad()
      },
      fail:err=>{
        console.log(err),
        wx.showToast({
          title: '删除失败',
        })
      }
    })

  },
  checkboxChange:function(e){
    var value=e.detail.value;
    var that=this;
    console.log(value);
    if(value.length==2){  
      var flag=value[1];
      if(flag==0){
        that.setData({
          ck1:false,
          limit:value[1]
        })
      }
      else{
        that.setData({
          ck2:false,
          limit: value[1]
        })
      }

    }
    else {
    if(value.length==1){
      that.setData({
        limit:value[0]
      })
    }
    else{
      that.setData({
        limit: null,
      })
    }
    }

  },



})