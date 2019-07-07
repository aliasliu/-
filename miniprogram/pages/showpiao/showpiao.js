var app = getApp()
Page({

  data: {
    bianhaolist: null,
    neironglist: null,
  },
  onLoad: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getgongzuopiao',
      data: {},
      success: res => {
        var templist = res.result.data;
        console.log(templist)
        var bianhaolist = [];
        for (var i = 0; i < templist.length; i++) {
          bianhaolist.push(templist[i].bianhao)
        }
        console.log(bianhaolist)
        var r = bianhaolist.filter(function (element, index, self) {
          return self.indexOf(element) === index;
        });
        console.log(r);

        that.setData({
          bianhaolist: r,
        })
        //用票号去gongzuopiao表里找内容
        // const db=wx.cloud.database();
        // var templist=[];
        // for(var j=0;j<that.data.bianhaolist.length;j++){
        //   db.collection('gongzuopiao').where({piaohao:that.data.bianhaolist[j]+''}).get({
        //     success:res=>{
        //       console.log(res);
        //       if (res.data.length!=0){
        //       var tempneirong = res.data[0].neirong;
        //       var temppiaohao=res.data[0].piaohao;
        //       templist.push({
        //         piaohao:temppiaohao,
        //         neirong:tempneirong
        //       })}
        //       else{
        //         templist.push({
        //           piaohao: "不详",
        //           neirong: "无"
        //         })
        //       }

        //     },
        //     fail:err=>{
        //       console.log(err)
        //     }
        //   })
        // }
        // that.setData({
        //   neironglist:templist,
        // })


      },
      fail: err => {
        console.log(err)
      }
    })
  },
  onquery: function (e) {
    var that = this;
    console.log(e)
    var querybianhao = e.currentTarget.dataset.querybianhao;
    app.globalData.querybianhao = querybianhao;
    console.log(app.globalData.querybianhao);
    wx.navigateTo({
      url: '../showlist/showlist',
    })
  }

})