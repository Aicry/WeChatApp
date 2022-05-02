   
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
      name:'',
      Id:'',

      Type:'',
      pwd:'',
      repwd:'',
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
             Type:json1['Type'],
           })
         
         })
       },
 
       pwdInput :function (e) { 
        this.setData({ 
          pwd:e.detail.value ,
        }) 
         
        

      }, 
    // 获取输入密码 
      repwdInput :function (e) { 
        this.setData({ 
          repwd:e.detail.value 
        }) 
        }, 


       commit: function () { 

          if(this.data.pwd.length == 0 || this.data.repwd.length == 0){ 
            wx.showToast({   
              title: '请输入密码',   
              icon: 'error',   
              duration: 1000   
            })   
            
      }
      else if(this.data.pwd !=this.data.repwd ){
        wx.showToast({   
          title: '两次密码不一致',   
          icon: 'error',   
          duration: 1000   
        })   
      }
      else { 
          const changeMes={
            "Id" : this.data.Id,
            "pwd" : this.data.pwd,
            "Type":this.data.Type
          }
        var array = JSON.stringify(changeMes);
        const promise= http.post("ChangePwd",array);     
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