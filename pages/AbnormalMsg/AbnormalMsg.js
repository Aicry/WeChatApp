import http from '../../utils/api.js';
Page({
    /**
     * 页面的初始数据
     */
    data: {
     Id:'',
     name:'',
     Type:'',
     items:[],
     record: [],
     index: ""

    },
  
    chooserecord: function (e) {
      var checkid = e.currentTarget.dataset.index;
      console.log(checkid);
      wx.navigateTo({
        url: '/pages/DayMsg/DayMsg',
        success: (res) => {
          var array = JSON.stringify(this.data.items[checkid]);
          res.eventChannel.emit('acceptDataFromOpenerPage',
            { data: array })
        }

      })
  
    },
    onLoad: function () {
       
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
    const promise= http.post("AbnormalMsg",this.data.Id);     
    promise.then(res => {
    console.log(res.data);
    console.log(res.data.abnormalLogs[0].Id);
    this.setData({
        items:res.data.abnormalLogs
    })

    })
   },

/**
 * 
{submitLogs: Array(2)}
submitLogs: Array(2)
0:
Id: "111111"
address: "湖北省武汉市江岸区中山大道890号"
date: "2022-05-01"
healthy: "正常"
inCity: "否"
inSchool: "是"
note: "黄明水"
personType: "否"
relative: "否"
temperature: "36~37.3℃"
 */

   
    

   })
   
   