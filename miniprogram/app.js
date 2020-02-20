App({
  data: {
    login_type: false,
    avatarUrl: null,
    userInfo: null,
  },

  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  getTeamId:function(){
    let date = new Date();
    let yaer = date.getFullYear();
    let month = date.getMonth()+1;
    console.log(yaer,month);
    switch (month){
      case 2: case 3: case 4: case 5: case 6: case 7: 
        return 2 * (yaer - 2020) + 1;break;
      case 8: case 9: case 10: case 11: case 12: case 1: 
        return 2 * (yaer - 2020 )+ 2; break;
    }
  },

  getUserLocation:function(){
    console.log("获取用户位置");
    let result = "111";
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        result = {
          type:true,
          location:{
            latitude: res.latitude,
            longitude: res.longitude
          },
          speed: res.speed,
          accuracy: res.accuracy
        }
        console.log(result)
      }
    })
  },

  haveLocation:function(){
    // 检查是否进行了用户授权 否则向用户申请授权
    let haveL = true;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          haveL = true;
        }else{
          haveL = false;
        }
      }
    })
    return haveL;
  }
  
});