// pages/login.js
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '', 
        password:'' ,
        userName:''
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
        const loginMes={
          "userId" : this.data.id,
          "pwd" : this.data.password
        }
        var array = JSON.stringify(loginMes);
        const promise= http.post('login',array);
        
        promise.then(res => {
        console.log(res.data);
        this.setData({
            userName:res.data
        })
        console.log('test')
        console.log(this.data.userName);
        console.log('test')

        if(this.data.userName!='fail'){
          wx.navigateTo({
            url: `/pages/index/index`,
           
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage',
                  {data: this.data})
          }
    
        })
        }
        else {
          wx.showToast({
            title: '账号或密码错误',
            icon: 'error',
            duration: 1000,
          })
         
      }
    })
    
     
        }   
      } ,

    register: function(){
      wx.navigateTo({
        url: `/pages/register/register`,
       
        success: (res) => {
            
          console.log('test');
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage',
              {data: this.data.userName})
      }

    })
    },

   


 
})