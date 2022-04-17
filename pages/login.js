// pages/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '', 
        password:'' 
    },

    idInput :function (e) { 
        this.setData({ 
          id:e.detail.value ,
        }) 
         
        
  

      }, 
    // 获取输入密码 
      passwordInput :function (e) { 
        this.setData({ 
          password:e.detail.value 
        })   }, 
    // 登录 
      login: function () { 
        if(this.data.id.length == 0 || this.data.password.length == 0){ 
          wx.showToast({   
            title: '请输入用户信息',   
            icon: 'error',   
            duration: 1000   
          })   
    }else { 
      wx.request({
        url: getApp().globalData.httpUrl + '/hello',//自己模拟的接口地址
        method: "GET",
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
         console.log(res.data);
        },
        fail: function (err) { 
          
          console.log("error");
        },//请求失败
        complete: function () { }
      })
    

      var userName = getApp().globalData.userId; 
      
      userName=this.data.id;
     
      getApp().globalData.userId=userName;
      var userName = getApp().globalData.userId; 
     

        wx.navigateTo({
            url: `/pages/index/index`

        })
       

        }   
      } ,
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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