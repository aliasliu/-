//app.js

App({
    onLaunch: function () {
        var z = this;
        //云开发初始化
        wx.cloud.init({
        })
    },
    globalData: {
      querybianhao:"",
      nickName:"",
      limit:null,
    }
})