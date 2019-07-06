var app = getApp()

Page({

  data: {

    hiddenmodalput: true,

    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    addzhanghao:null,
    addmima:null,

  },

  //点击按钮痰喘指定的hiddenmodalput弹出框

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
    var that=this;
    //判断用户密码不为空
    if(that.data.addzhanghao&&that.data.addmima){
      const db = wx.cloud.database();
    //判断用户是否存在
      db.collection("userlist").where({gonghao:that.data.addzhanghao+""}).get({
        success:res=>{
          console.log(res)
          if(res.data.length!=0){
            wx.showToast({
              title: '用户已存在',
            })
          }
          else{

            //增加用户到数据库

            db.collection("userlist").add({
              data: {
                gonghao: that.data.addzhanghao + "",
                password: that.data.addmima + "",
                limit: 0,
              },
              success: res => {
                console.log(res);
                wx.showToast({
                  title: '添加成功',
                })
              },
              fail: err => {
                console.log(err);
                wx.showToast({
                  title: '添加失败',
                })
              }
            })

            that.setData({

              hiddenmodalput: true

            })

          }
          
        },
        fail:err=>{
          console.log(err)

        }

      })
   

    }
    else{
      wx.showToast({
        title: '账号/密码为空',
      })
    }

  },
  inputzhanghao:function(e){
    this.setData({
      addzhanghao:e.detail.value,
    })
  },
  inputmima:function(e){
    this.setData({
      addmima:e.detail.value,
    })
  },
  queryuser:function(){
    wx.navigateTo({
      url: '../showuser/showuser',
    })
  }

})
