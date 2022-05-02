   
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
      name:'',
      Id:'',
      Type:''
     },
    
     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function () {
         const eventChannel = this.getOpenerEventChannel();
         eventChannel.on('acceptDataFromOpenerPage', (data) => {
           console.log(data);
           var json1 = JSON.parse(data.data);
           console.log("test2")
           this.setData({
             Id:json1['Id'],
             name:json1['name'],
             Type:json1['Type'],
           })
     
         })
       },
 
       
       return:function () {
      
        wx.navigateBack({
          delta: 1,
        })
      
        
       },
   


 
})