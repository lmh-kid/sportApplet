// page/groupRes/groupRes.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.groupId = options.groupId;
    this.type= options.type;
    this.getList();
  },

  // 获取所有人运动状态列表
  getList:function(){
    console.log(this.groupId)
    wx.cloud.callFunction({
      name: 'getGroupMsg',
      data: {
        groupId: this.groupId,
      },
      success: res => {
        console.log('[云函数] [getGroupMsg] ', res.result)
        // 设置信息
        this.setData({
          msrc: res.result[0].data[0].userInfo.avatarUrl,
          mainUserName: res.result[0].data[0].userInfo.nickName,
          flag: res.result[0].data[0].userInfo.flag,
          userlist: res.result[1].data
        })

        // 获取设置用户运动结果
        if (res.result[0].data[0].userInfo.flag==2){
          wx.cloud.callFunction({
            name: 'getHistory',
            data: {
              historyId: res.result[0].data[0].userInfo.historyId
            },
            success: hres => {
              console.log('[云函数] [getHistory] ', hres.result)
              res.result[0].data[0].userInfo.grade = hres.result.data[0].grade;
              this.setData({
                grades: res.result[0].data[0].userInfo.grade,
              })
            },
            fail: err => {
              console.error('[云函数] [updateGroup] 调用失败', err)
            }
          })
        }
        for (let i in res.result[1].data){
          if (res.result[1].data[i].userInfo.flag==2){
            wx.cloud.callFunction({
              name: 'getHistory',
              data: {
                historyId: res.result[1].data[i].userInfo.historyId
              },
              success: hres => {
                console.log('[云函数] [getHistory] ', hres.result)
                res.result[1].data[i].userInfo.grade = hres.result.data[0].grade;
                this.setData({
                  userlist: res.result[1].data
                })
              },
              fail: err => {
                console.error('[云函数] [updateGroup] 调用失败', err)
              }
            })
          }
        }

        // 再次设置信息
        console.log(res.result[0].data[0].userInfo.grade, "再次设置信息")
        this.setData({
          msrc: res.result[0].data[0].userInfo.avatarUrl,
          mainUserName: res.result[0].data[0].userInfo.nickName,
          grades: res.result[0].data[0].userInfo.grade,
          flag: res.result[0].data[0].userInfo.flag,
          userlist: res.result[1].data
        })
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

  backIndex:function(){
    wx.switchTab({
      url: '../my/myCenter',
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