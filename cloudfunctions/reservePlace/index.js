// 场地预定 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const _ = db.command;
const place = db.collection('place');
const reservePlace = db.collection('reservePlace');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {

    place.where({
      _id: event.placeId
    }).update({
      data: {
        hot:_.inc(1)
      },
    })

    return await reservePlace.add({
      data:{
        openId:wxContext.OPENID,
        placeId:event.placeId,
        time:new Date().getTime()
      }
    })
    
  } catch (e) {
    return e;
  }
}