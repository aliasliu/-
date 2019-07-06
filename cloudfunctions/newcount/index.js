// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('count').doc('b34a5b22-3143-45ec-9429-fa7b6248c0d0').update({
    data: {
      count:event.oldcount+1,
    },
    success: res => {
      console.log("count+1")
    },
    fail: err => {
      icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
    }
  })


}