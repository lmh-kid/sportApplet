// sport/my/myCenter.js
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrl: '../../images/my/user-unlogin.png',
    userName: "微信登录",
    list: [
      {
        id: 'form',
        name: '运动记录',
        action:'history'
      },
      // {
      //   id: 'search',
      //   name: '搜索相关',
      //   action: '运动记录'
      // },
      // {
      //   id: 'school',
      //   name: '所在学校',
      //   action: '运动记录'
      // }
    ],

    // 获取学期目标
    nowNumber:0,
    aimNumber:"-",
    haveAim : 3
  },
  onLoad: function () {
    if (app.data.login_type){
      this.setData({
        avatarUrl: app.data.avatarUrl,
        userName: app.data.userInfo.nickName
      })
    }
  },

  onShow:function(){
    this.getUserTeamAim();
  },

  getUserTeamAim:function(){
    console.log(app.getTeamId());
    wx.cloud.callFunction({
      name: 'getAim',
      data: {
        tid: app.getTeamId(),
      },
      success: res => {
        console.log('[云函数] [addAim] ', res.result)
        if (res.result.data.length > 0){
          this.setData({
            aimNumber: res.result.data[0].aimNumber,
            nowNumber: res.result.data[0].nowNumber,
            haveAim: 1
          })
        }else{
          this.setData({
            haveAim:0
          })
        }
        
      },
      fail: err => {
        console.error('[云函数] [addAim] 调用失败', err)
      }
    })
  },

  setAim:function(){
    wx.navigateTo({
      url:"../aim/setAim"
    })
  },

  // 微信登录，获取用户信息
  onGetUserInfo : function (e) {
    console.log(e);
    this.setData({
      avatarUrl: e.detail.userInfo.avatarUrl,
      userName: e.detail.userInfo.nickName
    })
    app.data.userInfo = e.detail.userInfo;
  },

  history:function(){
    wx.redirectTo({
      url: '../history/history',
    })
  }
})
