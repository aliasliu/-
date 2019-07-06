// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection("codenumber").doc(event.jlid).remove({
    success: res => {
      console.log(res);
      // db.collection('codenumber').where({
      //   shebei: that.data.shebei
      // }).get({
      //   success: (res) => {
      //     that.setData({
      //       worklists: res.data,
      //       worklistslen: res.data.length,
      //     })
      //   }
      // })

    },
    fail: err => {
      
    }
  })
}