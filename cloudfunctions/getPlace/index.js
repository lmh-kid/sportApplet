// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const place = db.collection('place');
const _ = db.command
const reservePlace = db.collection('reservePlace');


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let places = await place.where({}).get();

  let now = new Date();

  let mday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if(places.errMsg== "collection.get:ok"){

    for(let i in places.data){
      places.data[i].list = await reservePlace.where({
        placeId:places.data[i]._id,
        openId:wxContext.OPENID,
        time:_.gt(mday.getTime())
      }).get();
    }
    
  }else{
    return {
      errMsg:"数据查询失败"
    };
  }
  return places;

}