import http from '../../utils/api.js';
import util from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
     college:'',
     students:[],
     items: [],
     index: "",
     inputShowed: false,
     focus:true,
     inputVal: ""
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    chooserecord: function (e) {
      var checkid = e.currentTarget.dataset.index;
      console.log(checkid);
      wx.navigateTo({
        url: '/pages/StuMsgChange/StuMsgChange',
        success: (res) => {
          var array = JSON.stringify(this.data.students[checkid]);
          res.eventChannel.emit('acceptDataFromOpenerPage',
            { data: array })
        }

      })
  
    },
    onLoad: function () {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          console.log(data);
          this.setData({
            college:data.data
          })
        })
      this.change();
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
    change:function(e){
    const promise= http.post("GetStudents",this.data.college);     
    promise.then(res => {
    console.log(res.data);
    this.setData({
        items:res.data,
        students:res.data.students
    })
    })
   },

   
    

   })
   
   