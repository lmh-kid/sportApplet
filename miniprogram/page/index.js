const app = getApp();
Page({
  data: {
    longitude: 117.0587146300,
    latitude: 39.2387682200, 
  },
  onLoad:function (){
    // 初始化云服务
    wx.cloud.init();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.data.login_type = true;
              app.data.avatarUrl = res.userInfo.avatarUrl;
              app.data.userInfo = res.userInfo;
            },
            fail:res=>{
              console.log(res);
              app.data.login_type = false;
            }
          })
        }else{
          app.data.login_type = false;
        }
      }
    })
    // 获取用户位置
    wx.getLocation({
      type: 'gcj02',
      success:res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
    
  },

  startRun:function(e){
    if(app.data.userInfo==null){
      wx.showModal({
        title: '您还未登录',
        content: '请登录后在进行该操作',
        confirmText: "确定",
        success: function (res) {
          wx.switchTab({
            url: './my/myCenter',
          })
        }
      })
      return;
    }
    // 获取用户地址授权状态
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.redirectTo({
            url:"./run/run",
          })
        } else {
          wx.showModal({
            title: '位置授权',
            content: '请授权位置服务，否则部分功能可能无法使用',
            confirmText: "前往授权",
            cancelText: "取消",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击主操作')
                wx.openSetting();
              } else {
                console.log('用户点击辅助操作')
              }
            }
          });
        }
      }
    })
  },

  creatGroup:function(){
    if (app.data.userInfo == null) {
      wx.showModal({
        title: '您还未登录',
        content: '请登录后在进行该操作',
        confirmText: "确定",
        success: function (res) {
          wx.switchTab({
            url: './my/myCenter',
          })
        }
      })
      return;
    }
    wx.redirectTo({
      url: './group/creatGroup?type=grun',
    })
  }
  
});

