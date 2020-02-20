// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const todos = db.collection('aim')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    return todos.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        nowNumber: 0,
        openId: wxContext.OPENID,
        tid: event.tid,
        aimNumber: event.aimNumber
      }
    })
  } catch (e) {
    return e;
  }
}