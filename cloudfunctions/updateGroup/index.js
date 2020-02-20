// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const todos = db.collection('group')
const todos1 = db.collection('guser')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    let res1 = await todos.where({
      _id: event.groupId
    }).update({
        data: {
          flag: event.flag,
          "userInfo.flag": event.flag
        },
      })

    let res2 = await todos1.where({
      groupId: event.groupId
    }).update({
        data: {
          "userInfo.flag": event.flag
        },
      })

    return Promise.all[res1,res2];

  } catch (e) {
    return e;
  }
}