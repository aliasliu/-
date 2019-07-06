let app = getApp();
// 获取数据库引用 

Page({

  data: {
    gonghao: "",
    password: "",
    flag:0,
  },
  onLoad(){
    var that=this;
    //读取缓存
    wx.getStorage({
      key: 'gonghao',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        that.setData({
          gonghao:res.data,
        })
      },
      fail: function () {
        console.log('读取账号发生错误')
      }

    })

    wx.getStorage({
      key: 'mima',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        that.setData({
          password: res.data,
        })
      },
      fail: function () {
        console.log('读取密码发生错误')
      }

    })
    wx.getStorage({
      key: 'dlflag',
      success: function (res) {
        // 异步接口在success回调才能拿到返回值
        that.setData({
          flag:res.data,
        })
      },
      fail: function () {
        console.log('读取登录记号发生错误')
      }

    })

    // wx.getStorage({
    //   key: 'quanxian',
    //   success: function (res) {
    //     // 异步接口在success回调才能拿到返回值
    //     app.globalData.limit=res.data;
    //     wx.navigateTo({
    //       url: '../createcode/createcode',
    //     })
    //   },
    //   fail: function () {
    //     console.log('读取发生错误')
    //   }

    // })
    // console.log(that.data.gonghao)
   
    // if(that.data.gonghao!=""){
    //   wx.redirectTo({
    //     url: '../createcode/createcode',
    //   })
    // }
  },
  checkboxChange:function(e){
    var temp;
    if(!e.detail.value[0]){
      temp=0;
    }
    else{
      temp=e.detail.value[0]
    }
    this.setData({
      flag:temp,
    })

  },
  //输入工号 
  inputgonghao(evnet) {
    
    this.data.gonghao = evnet.detail.value + "";
  },
  //输入密码 
  inputPassword(evnet) {
    this.data.password = evnet.detail.value + "";
  },
  //登陆 
  login() {
    var that = this;
    // if (!app.checkgonghaoPassword(gonghao, password)) { 
    //   return; 
    // } 
    //登陆获取用户信息 
    const db = wx.cloud.database()
    db.collection('userlist').where({
      // gonghao:that.data.gonghao 
      gonghao: that.data.gonghao
    }).get({
      success: res => {
        var userInfos = res.data;
        console.log(res.data);
        if (userInfos && userInfos.length > 0) {
          var user = userInfos[0];
          if (user.gonghao != that.data.gonghao) {
            console.log('用户名不匹配');
            wx.showToast({
              title: '用户名不匹配',
            })
          } else if (user.password != that.data.password) {
            console.log('密码不匹配');
            wx.showToast({
              title: '密码不正确',
            })
          } else {
            console.log("登录成功");
            wx.showToast({
              title: '登录成功',
            })
            //登录成功后记录用户权限 
            app.globalData.limit = res.data[0].limit;
            //缓存记住账号密码flag
            wx.setStorage({
              key: "dlflag",
              data: that.data.flag,
              success: function () {
                console.log('写入登录标记成功')
              },
              fail: function () {
                console.log('写入发生错误')
              }
            })

            if(that.data.flag==1){
              //缓存账号密码
              wx.setStorage({
                key: "gonghao",
                data: that.data.gonghao,
                success: function () {
                  console.log('写入账号成功')
                },
                fail: function () {
                  console.log('写入发生错误')
                }
              })
              wx.setStorage({
                key: "mima",
                data: that.data.password,
                success: function () {
                  console.log('写入密码成功')
                },
                fail: function () {
                  console.log('写入发生错误')
                }
              })

            }
            else{
              wx.clearStorage();
            }



            // wx.setStorage({
            //   key: "quanxian",
            //   data: app.globalData.limit,
            //   success: function () {
            //     console.log('写入成功')
            //   },
            //   fail: function () {
            //     console.log('写入发生错误')
            //   }
            // })
            //如果用户是管理员权限，跳转到admin界面
            if(app.globalData.limit==2){
              wx.navigateTo({
                url: '../admin/admin',
              })
            }
            else{
            //跳转页面 
            let jsonStr = JSON.stringify(user);
            wx.navigateTo({
              url: '../createcode/createcode',
            })
            }
          }
        } else {
          console.log('用户不存在');
          wx.showToast({
            title: '用户不存在',
          })
        }
      }
    })
  },
  onGotUserInfo: function (e) {
    console.log("nickname=" + e.detail.userInfo.nickName);
    app.globalData.nickName = e.detail.userInfo.nickName;
    wx.setStorage({
      key: "nickname",
      data: app.globalData.nickName,
      success: function () {
        console.log('写入成功')
      },
      fail: function () {
        console.log('写入发生错误')
      }
    })
  }
})