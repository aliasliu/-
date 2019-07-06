// pages/index/index.js
var QRCode = require('../../utils/weapp-qrcode.js')
var qrcode;
var app = getApp();


Page({
    data: {
        text: '',
        image: '',
        count:1,
        id:'b34a5b22-3143-45ec-9429-fa7b6248c0d0',
        nickName:"",
        limit:null,
        inputstr:"",
    },
    onLoad: function (options) {
     
      this.setData({
        nickName:app.globalData.nickName,
        limit:app.globalData.limit,
      })
        qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: "",
            image:'/images/bg.jpg',
            width: 150,
            height: 150,
            colorDark: "#1CA4FC",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.H,
        });
    },
  // clear:function(){
  //   wx.clearStorage();
  // },
    confirmHandler: function (e) {
        var value = e.detail.value
        qrcode.makeCode(value)
    },
    inputHandler: function (e) {
        var value = e.detail.value
        this.setData({
            text: value
        })
    },
    tapHandler: function () {
        // 传入字符串生成qrcode
        qrcode.makeCode('makelove')
    },
    gotoscan: function(){
      wx.navigateTo({
        url: '../scancode/scancode',
      })
    },
    oninput:function(e){
      this.setData({
        inputstr:e.detail.value
      })
    },
    createCode:function(){
      var that=this
      if(this.data.inputstr==""){
        wx.showToast({
          title: '内容不能为空',
        })
      }
      else{
        qrcode.makeCode(that.data.inputstr+'')
      }
      
      
    },
    //生成新二维码
  // createCode() {
  //   var that = this;
  //   wx.cloud.init();
  //   //调用getcount获得count值存放在data
  //   wx.cloud.callFunction({
  //     name: 'getcount',
  //     data: {
  //     },
  //     success: res => {
  //       that.setData({
  //         // result: JSON.stringify(res.result),
  //         count: res.result.data[0].count,
  //       })
  //       //成功后调用newcount生成新count存进数据库
  //       wx.cloud.callFunction({
  //         name: 'newcount',
  //         data: {
  //           oldcount: that.data.count,
  //         },
  //         success: res => {
            
  //           //生成二维码
  //           qrcode.makeCode('H'+that.data.count+'');
  //           console.log(res)
  //         },
  //         fail: err => {
  //           wx.showToast({
  //             icon: 'none',
  //             title: '调用失败',
  //           })
  //           console.error('[云函数] [sum] 调用失败：', err)
  //         }
  //       })
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '调用失败',
  //       })
  //       console.error('[云函数] [sum] 调用失败：', err)
  //     }
    
  //   })
  // },
    
    // else{
    //   wx.showToast({
    //     icon: 'none',
    //     title: '无权限',
    //   })
    // }
    


    // var that=this;
    // wx.cloud.init();
    // const db = wx.cloud.database();
    // //从云端获得count保存在data.count
    // db.collection('count').where({ _id: that.data.id}).get(
    //   {
    //     success: res => {
    //       console.log(res);
    //       var temp=res.data[0].count;
    //       that.setData(
    //         {
    //           count:temp,
    //         }
    //       )
    //     //更新云端count
    //       db.collection('count').doc('b34a5b22-3143-45ec-9429-fa7b6248c0d0').update({
    //         data: {
    //           count: that.data.count + 1,
    //         },
    //         success: res => {
    //           console.log("count+1")
    //         },
    //         fail: err => {
    //           icon: 'none',
    //             console.error('[数据库] [更新记录] 失败：', err)
    //         }
    //       })
    //          // 生成二维码
    //       qrcode.makeCode(that.data.count+'');
    //     }
    //   }
    // )



    // db.collection('codenumber').where({
    //   number:that.data.collection
    // }).get({
    //   success: res => {
    //     this.setData({
    //       queryResult: JSON.stringify(res.data, null, 2),
    //     })
    //     console.log('[数据库] [查询记录] 成功: ', res)
    //     if(res.data.length==0){
    //       db.collection('codenumber').add({
    //     data: {
    //       number: that.data.count,
    //       shebei:"",
    //       bianhao:"",
          
    //     },
    //     success: res => {
    //       // 在返回结果中会包含新创建的记录的 _id
    //       this.setData({
    //         counterId: res._id,
    //         count:that.data.count,
    //       })
    //       qrcode.makeCode('1');
    //       wx.showToast({
    //         title: '新增记录成功',
    //       })
    //       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '新增记录失败'
    //       })
    //       console.error('[数据库] [新增记录] 失败：', err)
    //     }
    //   })
    //     }
    //     else{
    //     db.collection('codenumber').add({
    //       data: {
    //         number: temp,
    //         shebei:"",
    //         bianhao:"",
    //       },
    //       success: res => {
    //         // 在返回结果中会包含新创建的记录的 _id
    //         // this.setData({
    //         //   counterId: res._id,
    //         //   count: res.data[res.data.length - 1].number+1
    //         // })
    //         qrcode.makeCode(''+temp)
    //         wx.showToast({
    //           title: '新增记录成功',
    //         })
    //         console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //       },
    //       fail: err => {
    //         wx.showToast({
    //           icon: 'none',
    //           title: '新增记录失败'
    //         })
    //         console.error('[数据库] [新增记录] 失败：', err)
    //       }
    //     })
    //     }
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
    // if(true){
    //   db.collection('codenumber').get('number')
    //   db.collection('codenumber').add({
    //     data: {
    //       number: 1
    //     },
    //     success: res => {
    //       // 在返回结果中会包含新创建的记录的 _id
    //       this.setData({
    //         counterId: res._id,
    //         count: 1
    //       })
    //       wx.showToast({
    //         title: '新增记录成功',
    //       })
    //       console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '新增记录失败'
    //       })
    //       console.error('[数据库] [新增记录] 失败：', err)
    //     }
    //   })
    // }
    
    // 长按保存
    save: function () {
        console.log('save')
        wx.showActionSheet({
            itemList: ['保存图片'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    qrcode.exportImage(function (path) {
                        wx.saveImageToPhotosAlbum({
                            filePath: path,
                        })
                        
                    })
                }
            }
        })
    }
    ,

    // test:function(){
    //   var that=this;
    // for(var i=0;i<10;i++){
    //   console.log(i)
    //   wx.cloud.callFunction({
    //     name: 'getcount',
    //     data: {
    //     },
    //     success: res => {
    //       that.setData({
    //         // result: JSON.stringify(res.result),
    //         count: res.result.data[0].count,
    //       })
    //       //成功后调用newcount生成新count存进数据库
    //       wx.cloud.callFunction({
    //         name: 'newcount',
    //         data: {
    //           oldcount: that.data.count,
    //         },
    //         success: res => {

    //           //生成二维码
    //           qrcode.makeCode(that.data.count + '');
    //           qrcode.exportImage(function (path) {
    //             wx.saveImageToPhotosAlbum({
    //               filePath: path,
    //             })

    //           })

    //         },
    //         fail: err => {
    //           wx.showToast({
    //             icon: 'none',
    //             title: '调用失败',
    //           })
    //           console.error('[云函数] [sum] 调用失败：', err)
    //         }
    //       })
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '调用失败',
    //       })
    //       console.error('[云函数] [sum] 调用失败：', err)
    //     }

    //   })
    // }




    // },
  showpiao:function(){
    wx.navigateTo({
      url: '../showpiao/showpiao',
    })
  }
})