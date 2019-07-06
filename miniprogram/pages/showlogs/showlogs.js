var app=getApp()
Page({

 
  data: {
    loglist:[],
  },

 
  onLoad: function () {
    var that=this;
    wx.cloud.callFunction({
      name:'getlog',
      data:{},
      success:res=>{
        console.log(res);
        var sjlist=[];
        for(var i=0;i<res.result.data.length;i++){
          var bztime;
          var shijian={};
          bztime = new Date(res.result.data[i].time)
          console.log(bztime)
          shijian.year=bztime.getFullYear()
          shijian.month=bztime.getMonth()
          shijian.day=bztime.getDate()
          shijian.hour=bztime.getHours()
          shijian.minute=bztime.getMinutes()
          sjlist.push(shijian)
        }
        that.setData({
          loglist:res.result.data,
          timelist:sjlist,
        })
      },
      fail:err=>{
        console.log(err)
      }
    })
  },

  
})