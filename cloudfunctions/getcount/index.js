// 云函数入口文件
const cloud = require('wx-server-sdk')

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var temp=1;
 return await db.collection('count').where({ _id:"b34a5b22-3143-45ec-9429-fa7b6248c0d0"}).get(
    {
      // success: res => {
      //   // return {
      //   //   resz:res,
      //   //   openid: wxContext.OPENID,
      //   //   appid: wxContext.APPID,
      //   // }
      //   temp = res.data[0].count;
      //   //更新云端count
      //   db.collection('count').doc('b34a5b22-3143-45ec-9429-fa7b6248c0d0').update({
      //     data: {
      //       count: temp + 1,
      //     },
      //     success: res => {
      //       // return {
      //       //   count: temp,
      //       // }
      //     },
      //     fail: err => {
      //       icon: 'none',
      //         console.error('[数据库] [更新记录] 失败：', err)
      //     }
      //   })
      // }
    }
  )
  // return{
  //   count:temp,
  // }
}