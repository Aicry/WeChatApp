import http from '../../utils/api.js';
import util from '../../utils/util.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
     college:'',
     items:[],
     record: [],
     index: ""
    },
  
    chooserecord: function (e) {
      var checkid = e.currentTarget.dataset.index;
      console.log(checkid);
      wx.navigateTo({
        url: '',
        success: (res) => {
          var array = JSON.stringify(this.data.items[checkid]);
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

        const loginMes={
            "date" : util.getDate(),
            "college" : this.data.college
          }
          var array = JSON.stringify(loginMes);
  
    const promise= http.post("TodaySubmit",array);     
    promise.then(res => {
    console.log(res.data);
    this.setData({
        items:res.data.todaySubmitLogs
    })

    })
   },

   
    

   })
   
   