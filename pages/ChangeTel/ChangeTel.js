   
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
      name:'',
      Id:'',
      Telephone:'',
      Type:'',
      result:''
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
             Telephone:json1['Telephone'],
             Type:json1['Type'],
           })
         
         })
       },
 
       TelephoneInput :function (e) { 
        this.setData({ 
            Telephone:e.detail.value ,
        }) 
         
    },


       commit: function () { 

          if(this.data.Telephone.length != 11 ){ 
            wx.showToast({   
              title: '请输入11位手机号',   
              icon: 'error',   
              duration: 1000   
            })   
            
      }
      else { 
          const changeMes={
            "Id" : this.data.Id,
            "Telephone" : this.data.Telephone,
            "Type":this.data.Type
          }
        var array = JSON.stringify(changeMes);
        const promise= http.post("Change",array);     
        promise.then(res => {
        console.log(res.data);
        this.setData({
          result:res.data
        })
        if(this.data.result!='fail'){
          wx.showToast({   
            title: '修改成功',   
            icon: 'success',   
            duration: 1000   
          })  
        }
        else {
          wx.showToast({
            title: '修改失败',
            icon: 'error',
            duration: 1000,
          })
         
      }
    })
  
         
      
       
          }   
        } ,

       return:function () {
      
        wx.navigateBack({
          delta: 1,
        })
      
        
       },
   


 
})