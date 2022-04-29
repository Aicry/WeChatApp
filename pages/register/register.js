import http from '../../utils/api.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    password: '',
    repassword: '',
    userName: '',
    status: ''
  },


  idInput: function (e) {
    this.setData({
      id: e.detail.value,
    })

  },

  checkId: function (e) {
    if (this.data.id.length != 6) {
      wx.showToast({
        title: '账号6位数字',
        icon: 'error',
        duration: 1000
      })

    }
  },
  nameInput: function (e) {
    this.setData({
      userName: e.detail.value,
    })
  },
  checkName: function (e) {

  },
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  checkPassWd: function (e) {
    if (this.data.password.length < 6) {
      wx.showToast({
        title: '密码6位以上',
        icon: 'error',
        duration: 1000
      })
    }
  },

  // 获取输入密码 
  passwordReInput: function (e) {

    this.setData({
      repassword: e.detail.value
    })
  },


  checkRePassWd: function (e) {
    if (this.data.password != this.data.repassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'error',
        duration: 1000
      })
    }
  },

  checkRegisterMsg: function () {
    if (this.data.id.length == 0 || this.data.userName.length == 0 || this.data.password.length == 0 || this.data.repassword.length == 0) {
      return "userInfoError"
    }
    else if (this.data.password != this.data.repassword) { 
       return "passwdError"
    }
    else {
      return "success";
    }

  },



  registerReq: function () {
    const rigMes = {
      "userId": this.data.id,
      "pwd": this.data.password,
      "userName": this.data.userName
    }
    var array = JSON.stringify(rigMes);
    const promise = http.post('register', array);

    promise.then(res => {
      console.log(res.data);
      this.setData({
        status: res.data
      })
      this.returnMsg();

    })
  },

  
  returnTo: function () {
    wx.navigateTo({
      url: `/pages/login/login`,
    })

  },

  returnMsg:function(){
    if (this.data.status == 'success') {
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1000,
      })
    }
    else if (this.data.status != 'success'){
      wx.showToast({
        title: '注册失败',
        icon: 'error',
        duration: 1000
      })
    }
  },
  register: function () {
    var result = this.checkRegisterMsg();
    if (result == 'success') {
      this.registerReq();
      
    }
  else if (result == 'userInfoError') {
      wx.showToast({
        title: '请输入用户信息',
        icon: 'error',
        duration: 1000
      })
    }
  else   if (result == 'passwdError') {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'error',
        duration: 1000
      })
    }


   


},
   
  })
