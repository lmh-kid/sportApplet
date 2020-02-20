// 添加Aim
wx.cloud.callFunction({
  name: 'addAim',
  data: {
    tid: "3",
    aimNumber: 300
  },
  success: res => {
    console.log('[云函数] [addAim] ', res.result)
  },
  fail: err => {
    console.error('[云函数] [addAim] 调用失败', err)
  }
})