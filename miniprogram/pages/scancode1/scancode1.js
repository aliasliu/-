var app = getApp()
Page({
  data: {
    show: "",
    shebei: "",
    bianhao: [],
    addbianhao: "",
    addshebei: "",
    worklists:[],
    worklistslen:0,
    hiddenmodalput: true,
    jlid:null,
    delbianhao:null,
    selectArray:null,
    index1: 0,
    index2: 0,
    ancuos:null,
    ybianhao:null,
    flag:null,
  },
  onLoad:function(){
    // var that = this
    // wx.cloud.callFunction({
    //   name: 'gettemplate',
    //   data: {

    //   },
    //   success: res => {
    //     // console.log(res)
    //     var tempar=[]
    //     for (var i = 0; i < res.result.data.length;i++){
    //       tempar.push(res.result.data[i].biaoti)
    //     }
    //     that.setData({
    //       selectArray: tempar,
    //     })

    //   },
    //   fail: err => {
    //     console.log(err)
    //   }
    // })
  },

  querymuban:function(e){
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var temp=e.detail.value.muban
    console.log(temp)
    var that=this
    // const db=wx.cloud.database()
    // db.collection('template').where({
    //   biaoti:{
    //     $regex:'.*'+temp,
    //     $options:'i'
    //   }
    // }).get({
    //   success:res=>{
    //     console.log(res)
    //   }
    // })



    wx.cloud.callFunction({
      name:'querymuban',
      data:{
        qbiaoti:temp,
      },
      success: res => {
        console.log(res)
        var tempar = []
        for (var i = 0; i < res.result.data.length; i++) {
          tempar.push(res.result.data[i].biaoti)
        }
        that.setData({
          selectArray: tempar,
        })

      },
      fail: err => {
        console.log(err)
      }
    })
  },

  // getDate: function (e) {
  //   console.log(e.detail)
  //   var id=e.detail.id
  //   var that = this
  //   const db=wx.cloud.database()
  //   db.collection('template').doc(id).get({
  //     success:res=>{
  //       console.log(res)
  //       that.setData({
  //         ancuos:res.data.text.split(',')
  //       })
  //     }
  //   })
  // },
  listenerPickerSelected1: function (e) {
    var ind = e.detail.value
    var that = this
    console.log(e)
    const db=wx.cloud.database()
    db.collection('template').where({biaoti:that.data.selectArray[ind]}).get({
      success: (res) => {
        console.log(res)
        that.setData({
          index1: ind,
          ancuos:res.data[0].text.split('，')
        })
      }
    })
    
  }, 
  listenerPickerSelected2: function (e) {
    var ind=e.detail.value
    var that=this
    this.setData({
      index2:ind,
      addshebei:that.data.ancuos[ind],
    })
  }, 
  modalinput: function (e) {
    console.log(e)

    this.setData({

      hiddenmodalput: !this.data.hiddenmodalput,
      jlid: e.currentTarget.dataset.id,
      delbianhao: e.currentTarget.dataset.bianhao,
    })

  },
  cancel: function () {

    this.setData({

      hiddenmodalput: true

    });

  },

  confirm: function (e) {
    var that = this;
    // console.log(e)
    var jlid = that.data.jlid;
    var delbianhao = that.data.delbianhao;
    wx.cloud.init();
    const db = wx.cloud.database();
    wx.cloud.callFunction({
      name: "delet",
      data: {
        jlid: jlid,
      },
      success: res => {
        console.log("删除成功：" + res)
        wx.showToast({
          title: '删除成功',
        })
        this.setData({

          hiddenmodalput: true

        })
        //重新查询工作票
        db.collection('codenumber').where({
          number: that.data.show
        }).get({
          success: (res) => {
            that.setData({
              worklists: res.data,
              worklistslen: res.data.length,
            })
           if(res.data.length==0){
             that.setData({
               shebei: "",
             })
           }
          }
        })

     
        //增加删除记录
        //增加一条增加安措的操作记录
        var curTime = new Date();
        db.collection('logs').add({
          data: {
            type: "del",
            nickName: app.globalData.nickName,
            paihao:that.data.show,
            piaohao: delbianhao,
            time: curTime,
          },
          success: (res) => {
            console.log("增加记录成功")
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })

  },
  formSubmit1: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database();
    if(that.data.show!=""){
     
      if(e.detail.value.bianhaom!=""){
         //判断编号是否存在
      db.collection('bianhao').where({ paihao: that.data.show }).get({
        success: res => {
          console.log(res)
          if (that.data.flag == 0 &res.data.length != 0) {
            wx.showToast({
              title: '此牌号已存在',
            })
          }
          
          else {
            if (that.data.flag == 0 & res.data.length == 0) {
              //标识牌编号写入数据库
              db.collection('bianhao').add({
                data: {
                  ybianhao: that.data.ybianhao,
                  paihao: that.data.show
                },
                success: res => {
                  console.log(res)
                  that.setData({
                    flag:1
                  })
                }
              })
            }
            //记录票号到addbiahao
            that.setData({
              addbianhao:e.detail.value.bianhaom+""
            })
            //验证票号是否存在
            db.collection('codenumber').where({number:that.data.show}).where({bianhao:that.data.addbianhao}).get({
              success:res=>{
                if(res.data.length!=0){
                  wx.showToast({
                    title: '票号已存在',
                  })
                }
                //票号不存在则入数据库
                else{
                  db.collection('codenumber').add({
                    data:{
                      number:that.data.show,
                      bianhao:that.data.addbianhao
                    },
                    //写入数据库成功
                    success:res=>{           
                      //增加一条增加安措的操作记录
                      var curTime = new Date();
                      db.collection('logs').add({
                        data: {
                          type: "add",
                          nickName: app.globalData.nickName,
                          piaohao: that.data.addbianhao,
                          time: curTime, 
                          paihao:that.data.show
                        },
                        success: (res) => {
                          console.log("增加记录成功")
                        }
                      })
                      //重新查询有关工作票
                      var tempbianhao = [];
                      db.collection('codenumber').where({
                        number: that.data.show
                      }).limit(50).get({
                        success: (res) => {
                          that.setData({
                            worklists: res.data,
                            worklistslen: res.data.length,
                          })
                          for (var i = 0; i < res.data.length; i++) {
                            if (res.data[i].bianhao != "") {

                              tempbianhao.push(res.data[i].bianhao)

                            }
                          }
                          that.setData({
                            bianhao: tempbianhao,
                          });
                          console.log('[数据库] [查询编号] 成功: ', res)
                        },
                        fail: err => {
                          wx.showToast({
                            icon: 'none',
                            title: '查询记录失败'
                          })
                          console.error('[数据库] [查询记录] 失败：', err)
                        }
                      })
                    }
                  })
                }
              }
            })
            }
    }

      })
      }
    else{
      wx.showToast({
        title: '请输入票号',
      })
    } 
    }
    else{
      wx.showToast({
        title: '请输入编号',
      })
    }
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database();
    //添加原编号与牌号对应关系
    console.log(that.data.flag == 0 & that.data.ybianhao != null & that.data.ybianhao != "" & that.data.show != null & that.data.show != "")
    if(that.data.flag==0&that.data.ybianhao!=null&that.data.ybianhao!=""&that.data.show!=null&that.data.show!=""){
      db.collection('bianhao').where({paihao:that.data.show}).get({
        success:res=>{
          console.log(res)
          if(res.data.length!=0){
            wx.showToast({
              title: '此牌号已存在',
            })
          }
          else{
            db.collection('bianhao').add({
              data: {
                ybianhao: that.data.ybianhao,
                paihao: that.data.show
              },
              success: res => {
                console.log(res)
              }
            })

            if (that.data.show != "" & e.detail.value.shebeim != "" & e.detail.value.bianhaom != "") {
              that.setData({
                // shebei:e.detail.value.shebeim,
                addbianhao: e.detail.value.bianhaom + '',
              })
              //验证设备名是否存在

              db.collection('codenumber').where({
                shebei: that.data.addshebei,
              }).get({
                success: res => {
                  // console.log(res)
                  if (res.data.length != 0) {
                    wx.showToast({
                      title: '设备已存在',
                    })

                  }
                  else {

                    var tempbianhao = that.data.bianhao;
                    db.collection('codenumber').add({
                      data: {
                        number: that.data.show,
                        bianhao: that.data.addbianhao + '',
                        shebei: that.data.addshebei
                      },
                      success: res => {
                        if (that.data.ancuos == null) {
                          tempbianhao.push(that.data.addbianhao)
                          // var tempancuos=that.data.ancuos
                          // tempancuos.splice(that.data.index2,1)
                          // console.log(tempancuos)
                          that.setData({
                            shebei: that.data.addshebei,
                            bianhao: tempbianhao,
                            // ancuos:tempancuos,
                          })
                        }
                        else {
                          tempbianhao.push(that.data.addbianhao)
                          var tempancuos = that.data.ancuos
                          tempancuos.splice(that.data.index2, 1)

                          that.setData({
                            shebei: that.data.addshebei,
                            bianhao: tempbianhao,
                            ancuos: tempancuos,
                            index2: 0,
                          })
                        }

                        wx.showToast({
                          title: '操作成功',
                        })

                        db.collection('codenumber').where({
                          shebei: that.data.shebei
                        }).get({
                          success: (res) => {
                            that.setData({
                              worklists: res.data,
                              worklistslen: res.data.length,
                            })
                          }
                        })
                        //增加一条增加安措的操作记录
                        var curTime = new Date();
                        db.collection('logs').add({
                          data: {
                            type: "add",
                            nickName: app.globalData.nickName,
                            shebei: that.data.shebei,
                            bianhao: that.data.addbianhao,
                            time: curTime,

                          },
                          success: (res) => {
                            console.log("增加记录成功")
                          }
                        })

                      },
                      fail: err => {
                        icon: 'none',
                          console.error('[数据库] [更新记录] 失败：', err)
                      }
                    })


                  }
                }
              })



            }
            else {
              //如果增加编号名
              if (that.data.show != "" & e.detail.value.bianhaom != "") {
                that.setData({
                  addbianhao: e.detail.value.bianhaom + '',
                })
                // console.log(that.data.bianhao.length)
                //避免工作票重复添加
                if (that.data.bianhao.length > 0) {
                  for (var i = 0; i < that.data.bianhao.length; i++) {
                    if (that.data.addbianhao == that.data.bianhao[i]) {
                      wx.showToast({
                        title: '此工作票已存在',
                      })
                      return
                    }
                  }
                }


                var tempbianhao = that.data.bianhao;

                db.collection('codenumber').add({
                  data: {
                    number: that.data.show,
                    bianhao: that.data.addbianhao,
                  },
                  success: res => {
                    tempbianhao.push(that.data.addbianhao);
                    that.setData({
                      bianhao: tempbianhao,
                    })
                    wx.showToast({
                      title: '操作成功',
                    })

                    //重新查询有关工作票
                    db.collection('codenumber').where({
                      number: that.data.show
                    }).get({
                      success: (res) => {
                        that.setData({
                          worklists: res.data,
                          worklistslen: res.data.length,
                        })
                      }
                    })
                    //增加一条增加安措的操作记录
                    var curTime = new Date();
                    db.collection('logs').add({
                      data: {
                        type: "add",
                        nickName: app.globalData.nickName,
                        shebei: that.data.shebei,
                        bianhao: that.data.addbianhao,
                        time: curTime,
                      },
                      success: (res) => {
                        console.log("增加记录成功")
                      }
                    })


                  },
                  fail: err => {
                    icon: 'none',
                      console.error('[数据库] [更新记录] 失败：', err)
                  }
                })
              }
              else {

                wx.showToast({
                  title: '失败',
                  image: '/images/fail.PNG',
                  duration: 2000
                })
              }
            }
          }
        }
      })
     
    }
    else{
    //如果添加设备名和工作票名
      if (that.data.show != ""  & e.detail.value.shebeim != "" & e.detail.value.bianhaom != "" & e.detail.value.shebeim != null) {
      that.setData({
        // shebei:e.detail.value.shebeim,
        addbianhao: e.detail.value.bianhaom + '',
        addshebei: e.detail.value.shebeim,
      })
      //验证设备名是否存在

      db.collection('codenumber').where({
        shebei:that.data.addshebei,
      }).get({
        success:res=>{
          // console.log(res)
          if(res.data.length!=0){
            wx.showToast({
              title: '设备已存在',
            })
            
          }
          else{

            var tempbianhao = that.data.bianhao;
            db.collection('codenumber').add({
              data: {
                number: that.data.show,
                bianhao: that.data.addbianhao + '',
                shebei: that.data.addshebei
              },
              success: res => {
                if(that.data.ancuos==null){
                  tempbianhao.push(that.data.addbianhao)
                  // var tempancuos=that.data.ancuos
                  // tempancuos.splice(that.data.index2,1)
                  // console.log(tempancuos)
                  that.setData({
                    shebei: that.data.addshebei,
                    bianhao: tempbianhao,
                    // ancuos:tempancuos,
                  })
                }
                else{
                  tempbianhao.push(that.data.addbianhao)
                  var tempancuos=that.data.ancuos
                  tempancuos.splice(that.data.index2,1)
                 
                  that.setData({
                    shebei: that.data.addshebei,
                    bianhao: tempbianhao,
                    ancuos:tempancuos,
                    index2:0,
                  })
                }
               
                wx.showToast({
                  title: '操作成功',
                })

                db.collection('codenumber').where({
                  shebei: that.data.shebei
                }).get({
                  success: (res) => {
                    that.setData({
                      worklists: res.data,
                      worklistslen: res.data.length,
                    })
                  }
                })
                //增加一条增加安措的操作记录
                var curTime = new Date();
                db.collection('logs').add({
                  data: {
                    type: "add",
                    nickName: app.globalData.nickName,
                    shebei: that.data.shebei,
                    bianhao: that.data.addbianhao,
                    time: curTime,

                  },
                  success: (res) => {
                    console.log("增加记录成功")
                  }
                })

              },
              fail: err => {
                icon: 'none',
                  console.error('[数据库] [更新记录] 失败：', err)
              }
            })


          }
        }
      })

    
      
    }
    else {
      //如果增加编号名
      if (that.data.show != "" & e.detail.value.bianhaom != "" & e.detail.value.shebeim == null) {
        that.setData({
          addbianhao: e.detail.value.bianhaom+'',
        })
        // console.log(that.data.bianhao.length)
        //避免工作票重复添加
        if (that.data.bianhao.length>0){
          for(var i=0;i<that.data.bianhao.length;i++){
          if(that.data.addbianhao==that.data.bianhao[i]){
            wx.showToast({
              title: '此工作票已存在',
            })
            return
          }
        }
        }
      
     
        var tempbianhao = that.data.bianhao;
        
        db.collection('codenumber').add({
          data: {
            number: that.data.show,
            shebei: that.data.shebei,
            bianhao: that.data.addbianhao,
          },
          success: res => {
            tempbianhao.push(that.data.addbianhao);
            that.setData({
              bianhao: tempbianhao,
            })
            wx.showToast({
              title: '操作成功',
            })

      //重新查询有关工作票
            db.collection('codenumber').where({
              shebei: that.data.shebei
            }).get({
              success: (res) => {
                that.setData({
                  worklists: res.data,
                  worklistslen:res.data.length,
                })
              }
            })
          //增加一条增加安措的操作记录
            var curTime = new Date();
            db.collection('logs').add({
              data: {
                type: "add",
                nickName: app.globalData.nickName,
                shebei: that.data.shebei,
                bianhao: that.data.addbianhao,
                time: curTime,
              },
              success: (res) => {
                console.log("增加记录成功")
              }
            })


          },
          fail: err => {
            icon: 'none',
              console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      }
      else{
  
        wx.showToast({
        title: '失败',
        image:'/images/fail.PNG',
        duration: 2000
      })
      }
    //     db.collection('codenumber').where({
    //       shebei: that.data.shebei
    //     }).get({
    //       success: (res) => {
    //         that.setData({
    //           worklists: res.data,
    //         })
    //   }
    // })
    }
    //如果输出为空
    // else{
    //   wx.showToast({
    //     title: '失败',
    //     image:'/images/fail.PNG',
    //     duration: 2000
    //   })
    // }


    }

  },
  onpaihao:function(e){
    // console.log(e.detail.value)
    // this.data.show=e.detail.value
    this.setData({
      show:e.detail.value
    })
  },

  click: function () {
    var that = this;
    var temp;
    // this.data.bianhao=[];
    // this.data.shebei="";
    // this.data.show="",
    that.setData({
      shebei: "",
      // show:"",
      bianhao: [],
      worklists:[],
      worklistslen:0,
      show:"",
    })
    const db = wx.cloud.database()
    wx.scanCode({
      success: (res) => {
        that.setData({
          ybianhao:res.result
        })
        db.collection('bianhao').where({
          ybianhao:res.result
        }).get({
          success:res=>{
            console.log(res)
            if(res.data.length==0){
              that.setData({
                flag:0
              })
            }
            //能查到对应标识牌号
            else{
              that.setData({
                flag:1,
              })
              that.setData({
                show: res.data[0].paihao
              })
              //通过标识牌号查询有关工作票
              if (that.data.show) {
                var tempbianhao = [];
                db.collection('codenumber').where({
                  number: that.data.show
                }).get({
                  success: (res) => {
                    that.setData({
                      worklists: res.data,
                      worklistslen: res.data.length,
                    })
                    for (var i = 0; i < res.data.length; i++) {
                      if (res.data[i].bianhao != "") {
                        tempbianhao.push(res.data[i].bianhao)
                      }
                    }
                    that.setData({

                      bianhao: tempbianhao,
                    });
                    console.log('[数据库] [查询编号] 成功: ', res)
                  },
                  fail: err => {
                    wx.showToast({
                      icon: 'none',
                      title: '查询记录失败'
                    })
                    console.error('[数据库] [查询记录] 失败：', err)
                  }
                })
              }


              //通过设备名称查询有关工作票
              // var tempbianhao=[];
              // db.collection('codenumber').where({
              //   shebei: that.data.shebei
              // }).get({
              //   success: (res) => {
              //     for (var i = 0; i < res.data.length; i++) {
              //       if(res.data[i].bianhao!=null){

              //       tempbianhao.push(res.data[i].bianhao)

              //     }
              //     }
              //     that.setData({

              //       bianhao: tempbianhao,
              //     });
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


              // this.show = res.result * 1;
              // //+ "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
              // that.setData({
              //   show: this.show
              // });
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
            }
          }
        })

      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  

  // onDel: function (e) {
  //   var that=this;
  //   console.log(e)
  //   var jlid = e.currentTarget.dataset.id;
  //   var delbianhao=e.currentTarget.dataset.bianhao;
  //   // wx.cloud.init();
  //   // const db = wx.cloud.database();
  //   wx.cloud.callFunction({
  //     name:"delet",
  //     data:{
  //       jlid:jlid,
  //     },
  //     success:res=>{
  //       console.log("删除成功："+res)
  //       wx.showToast({
  //         title: '删除成功',
  //       })
  //       //重新查询工作票
  //       db.collection('codenumber').where({
  //         shebei: that.data.shebei
  //       }).get({
  //         success: (res) => {
  //           that.setData({
  //             worklists: res.data,
  //             worklistslen:res.data.length,
  //           })
            
  //         }
  //       })
    
  //       //增加删除记录
  //       //增加一条增加安措的操作记录
  //       var curTime = new Date();
  //       db.collection('logs').add({
  //         data: {
  //           type: "del",
  //           nickName: app.globalData.nickName,
  //           shebei: that.data.shebei,
  //           bianhao: delbianhao,
  //           time: curTime,
  //         },
  //         success: (res) => {
  //           console.log("增加记录成功")
  //         }
  //       })
  //     },
  //     fail:err=>{
  //       wx.showToast({
  //         icon: 'none',
  //         title: '调用失败',
  //       })
  //       console.error('[云函数] [sum] 调用失败：', err)
  //     }
  //   })

    // db.collection("codenumber").doc(id).remove({
    //   success: res => {
    //     console.log(res);
    //     wx.showToast({
    //       title: '删除成功',
    //     })
    //     db.collection('codenumber').where({
    //       shebei: that.data.shebei
    //     }).get({
    //       success: (res) => {
    //         that.setData({
    //           worklists: res.data,
    //           worklistslen:res.data.length,
    //         })
    //       }
    //     })
        
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       title: '删除失败',
    //     })
    //   }
    // })
  // },
  onquery:function(e){
    var that = this;
    console.log(e)
    var querybianhao = e.currentTarget.dataset.querybianhao;
    app.globalData.querybianhao=querybianhao;
    console.log(app.globalData.querybianhao);
    wx.navigateTo({
      url: '../showlist/showlist',
    })

    

  }

})
