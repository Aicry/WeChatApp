import http from '../../utils/api.js';
import util from '../../utils/util.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据Id
   */
  data: {
    Id: '',
    pwd: '',
    repwd: '',
    name: '',
    Telephone:'',
    college:'',
    major:'',
    stuClass:'',
    submitdays:'0',
    submitDate:util.getDate(),
    collegeList:'',
    majorList:'',
    stuClassList:'',
    status: '',
    multiArray: [[], [], []],
    multiIndex: [0, 0, 0]
    
  },
onLoad:function(options) {
  this.getclasslist();
},
getclasslist:function(){
  let that=this
  that.setData({
    collegeList: app.globalData.collegeList,
    majorList: app.globalData.majorList,
    stuClassList:app.globalData.stuClassList
  })
  
  that.data.multiArray[0] = that.data.collegeList
  that.data.multiArray[1] = this.getArr(that.data.collegeList[0], that.data.majorList);
  that.data.multiArray[2] = this.getArr(that.data.multiArray[1][0], that.data.stuClassList);
  that.setData({
    multiArray: that.data.multiArray
  })
},
bindMultiPickerColumnChange: function (e) {
  let that=this
  var data = {
    multiArray: this.data.multiArray,
    multiIndex: this.data.multiIndex
  };
  data.multiIndex[e.detail.column] = e.detail.value;
  switch (e.detail.column) {
    case 0:
      //当第一列改变  修改置第二列数据
      let arr = that.getArr(that.data.collegeList[e.detail.value], that.data.majorList)

      data.multiArray[1]=arr
      that.setData({
        multiArray: data.multiArray,
      })
      //从第二列中拿出第一项，设置第三列的数据
      let arrColumn2 = that.getArr(arr[0], that.data.stuClassList)
      data.multiArray[2] = arrColumn2
      that.setData({
        multiArray: data.multiArray,
        
      })
      break;
    case 1:
       //当第二列改变 改变第三列数据
      let arr2 = that.getArr(data.multiArray[1][e.detail.value], that.data.stuClassList)
      data.multiArray[2] = arr2
      that.setData({
        multiArray: data.multiArray,
        
      })
      break;
  }
},

getArr:function(value,arr){
  for (let i in arr) {
    if (value == i) {
      return arr[i]
    }
  }
},

bindMultiPickerChange: function (e) {
  this.setData({
    multiIndex: e.detail.value,
  })

  this.setData({
    college:this.data.multiArray[0][this.data.multiIndex[0]],
    major:this.data.multiArray[1][this.data.multiIndex[1]],
    stuClass:this.data.multiArray[2][this.data.multiIndex[2]]
 })
},


  idInput: function (e) {
    this.setData({
      Id: e.detail.value,
    })

  },

  checkId: function (e) {
    if (this.data.Id.length != 6) {
      wx.showToast({
        title: '账号6位数字',
        icon: 'error',
        duration: 1000
      })

    }
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
    })
  },
  checkName: function (e) {

  },
  TelephoneInput:function (e) {
    this.setData({
      Telephone: e.detail.value,
    })
  },
  checkTelephone:function (e) {
    if (this.data.Telephone.length < 11) {
      wx.showToast({
        title: '手机号11位',
        icon: 'error',
        duration: 1000
      })
    }
  },
  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  checkPassWd: function (e) {
    if (this.data.pwd.length < 6) {
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
      repwd: e.detail.value
    })
  },


  checkRePassWd: function (e) {
    if (this.data.pwd != this.data.repwd) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'error',
        duration: 1000
      })
    }
  },

  checkRegisterMsg: function () {
    if (this.data.Id.length == 0 || this.data.name.length == 0 || this.data.pwd.length == 0 || this.data.repwd.length == 0) {
      return "userInfoError"
    }
    else if (this.data.pwd != this.data.repwd) { 
       return "passwdError"
    }
    else {
      return "success";
    }

  },



  registerReq: function () {
    const rigMes = {
      "Id": this.data.Id,
      "pwd": this.data.pwd,
      "name": this.data.name,
      "Telephone": this.data.Telephone,
      "college": this.data.college,
      "major":this.data.major,
      "stuClass": this.data.stuClass,
      "submitdays": this.data.submitdays,
      "submitDate":this.data.submitDate
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
