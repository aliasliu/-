// miniprogram/pages/showlist/showlist.js
var app=getApp()
Page({

 
  data: {
    querybianhao: null,
    shebeis:null,
    neirong:null,
  },

  onLoad(){
    var that=this;
    this.setData({
      querybianhao: app.globalData.querybianhao,
    })

    console.log(that.data.querybianhao)
    //通过票号查设备
    wx.cloud.callFunction({
      name: 'getshebei',
      data: {
        qbianhao: that.data.querybianhao,
      },
      success: res => {
        console.log(res)

        that.setData({
          shebeis: res.result.data,
        })

      },
      fail: err => {
        console.log(err)
      }
    })
    //通过票号查内容
    wx.cloud.callFunction({
      name: 'getneirong',
      data: {
        qbianhao: that.data.querybianhao,
      },
      success: res => {
        console.log(res)

        that.setData({
          neirong: res.result.data[0].neirong,
        })

      },
      fail: err => {
        console.log(err)
      }
    })





    // const db = wx.cloud.database()
    // //通过工作票编号查询有关设备
    // // var tempbianhao = [];
    // db.collection('codenumber').where({
    //   bianhao: that.data.querybianhao
    // }).get({
    //   success: (res) => {
    //     that.setData({
    //       shebeis: res.data,        
    //     })
    //     console.log(res.data)
    //     // for (var i = 0; i < res.data.length; i++) {
    //     //   if (res.data[i].bianhao != "") {

    //     //     tempbianhao.push(res.data[i].bianhao)

    //     //   }
    //     // }
    //     // that.setData({

    //     //   bianhao: tempbianhao,
    //     // });
    //     console.log('[数据库] [查询编号] 成功: ', res)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
  },
  // onquery:function(){
  //   var that=this;
  //   console.log(that.data.querybianhao)
  //   wx.cloud.callFunction({
  //     name: 'getshebei',
  //     data:{
  //       qbianhao: that.data.querybianhao,
  //     },
  //     success: res => {
  //       console.log(res)
        
  //       that.setData({
  //         shebeis: res.result.data,
  //       })
        
  //     },
  //     fail:err=>{
  //       console.log(err)
  //     }
  // })
  // }
  formSubmit:function(e){
    console.log(e);
    if (e.detail.value.neirongm!=""){
    this.setData({
      neirong:e.detail.value.neirongm,
    })
    const db = wx.cloud.database();
    var that=this;
    //将票号和内容名加入工作票数据库
    db.collection("gongzuopiao").add({
      data:{
        piaohao:that.data.querybianhao,
        neirong:that.data.neirong,
      },
      success:res=>{
        console.log("添加成功"+res);
        wx.showToast({
          title: '添加成功',
        })
      },
      fail:err=>{
        console.log(err)
      }
    })

  }
  else{
    wx.showToast({
      title: '输出不能为空',
    })
  }
  }
 
})