// pages/list/index.js
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailsArr: []
    },

    bindReturn() {
        wx.navigateBack({});
    },

    creatGroup() {
        wx.showToast({
            title: '正在开发中',
            icon: 'none'
        })
    },

    getDetails() {
        let userInfo = wx.getStorageSync('userInfo');
        http.get(`details?query={"where":{"openid":"${userInfo.openid}"}}`).then(res => {
            let detailsArr = res.data.data;
            detailsArr.map(ele => {
                ele.bodyTemp = Number(ele.bodyTemp);
                ele.icon = ele.bodyTemp >= 37.3 ? 'netral' : 'happy';
            })
            this.setData({
                detailsArr
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let modelInfo = wx.getSystemInfoSync();
        let menuInfo = wx.getMenuButtonBoundingClientRect();
        let top = menuInfo.top;
        let left = modelInfo.windowWidth - menuInfo.right;
        this.setData({
            header_style: `margin:${top}px ${left}px;height:${menuInfo.height}px`
        })
    },


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '全民健康打卡',
            path: `/pages/index/index`,
            imageUrl: '../../images/index.png'
        }
    }
})