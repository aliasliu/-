// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //查询最近50条记录
  return await db.collection('logs').limit(100).orderBy('time','desc').get({
    
    success:res=>{
      console.log(res)
    },
    fail:err=>{
      console.log(err)
    }
  })
}