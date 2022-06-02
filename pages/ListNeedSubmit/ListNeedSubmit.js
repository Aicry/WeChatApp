// pages/DayMsg/DayMsg.js
import http from '../../utils/api.js';
import util from '../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        students:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
          
          const promise = http.post("StudentsNeedSubmit", util.getDate());
          promise.then(res => {
            console.log(res.data);
            this.setData({
                students: res.data.students
            })
      
          })
    },

})