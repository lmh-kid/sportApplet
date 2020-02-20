// page/group/group.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist:[],
    ifMain:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.groupId = options.groupId;
    this.type = options.type;

    console.log(this.type);
    if (this.type =="main"){
      this.setData({
        ifMain:true
      })
    }
    this.getAllUser();
    this.sc = setInterval(res=>{
      this.getAllUser();
    },3000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getAllUser:function(){
    wx.cloud.callFunction({
      name: 'getGroupMsg',
      data: {
        groupId: this.groupId,
      },
      success: res => {
        console.log('[云函数] [getGroupMsg] ', res.result)
        // 3 队伍解散
        if (res.result[0].data[0].userInfo.flag==3){
          wx.switchTab({
            url: '../index',
          })
        } 
        // 1 开始跑步
        else if (res.result[0].data[0].userInfo.flag == 1) {
          wx.redirectTo({
            url: '../run/run?groupId=' + this.groupId+"&type="+this.type,
          })
        }
        else{
          this.setData({
            msrc: res.result[0].data[0].userInfo.avatarUrl,
            mainUserName: res.result[0].data[0].userInfo.nickName,
            userlist: res.result[1].data
          })
        }
        
      },
      fail: err => {
        console.error('[云函数] [getGroupMsg] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 开始跑步 
  startRun:function(){
    clearInterval(this.sc);
    // 更新队伍状态
    wx.cloud.callFunction({
      name: 'updateGroup',
      data: {
        groupId: this.groupId,
        flag: 1
      },
      success: res => {
        console.log('[云函数] [updateGroup] ', res.result)
        wx.redirectTo({
          url: '../run/run?groupId=' + this.groupId + "&type=" + this.type,
        })
      },
      fail: err => {
        console.error('[云函数] [updateGroup] 调用失败', err)
      }
    })
  },

  notRun:function(e){
    clearInterval(this.sc);
    // 更新队伍状态
    wx.cloud.callFunction({
      name: 'updateGroup',
      data: {
        groupId: this.groupId,
        flag: 3
      },
      success: res => {
        console.log('[云函数] [updateGroup] ', res.result)
        if(e==1){

        }else{
          wx.switchTab({
            url: '../index',
          })
        }
      },
      fail: err => {
        console.error('[云函数] [updateGroup] 调用失败', err)
      }
    })
    
  },

  levelGroup:function(){
    wx.cloud.callFunction({
      name: 'delGroupUser',
      data: {
        groupId: this.groupId,
      },
      success: res => {
        console.log('[云函数] [delGroupUser] ', res.result)
        wx,wx.switchTab({
          url: '../index',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: err => {
        console.error('[云函数] [delGroupUser] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.sc);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})