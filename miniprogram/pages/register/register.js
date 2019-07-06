let app = getApp();
// 获取数据库引用
const db = wx.cloud.database();
const userListDB = db.collection('userlist');

let name = null;
let password = null;
let phone = null;
let address = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  //输入用户名
  inputName(evnet) {
    name = evnet.detail.value;
  },
  //输入密码
  inputPassword(evnet) {
    password = evnet.detail.value;
  },
  //输入手机号
  inputPhone(evnet) {
    phone = evnet.detail.value;
  },
  //输入地址
  inputAddress(evnet) {
    address = evnet.detail.value;
  },
  //注册
  register() {
    let that = this;
    if (!app.checkNamePassword(name, password)) {
      return;
    }
    if (!app.checkPhoneAddress(phone, address)) {
      return;
    }
    //查询用户是否已经注册
    userListDB.where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (res) {
        let userInfos = res.data;
        console.log(res.data)
        if (userInfos && userInfos.length > 0) {
          let user = userInfos[0];
          if (user && user.name) {
            wx.showModal({
              title: '提示',
              content: '您已注册，确定要更新账号密码吗？',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.saveuserinfo();
                }
              }
            })
          }
        } else {
          that.saveuserinfo();
        }
      }
    })
  },
  saveuserinfo() {
    let that = this;
    userListDB.doc('_openid').set({
      data: {
        name: name,
        password: password,
        phone: phone,
        address: address
      }
    }).then(res => {
      app.showTips('注册成功');
    })
  },
})
