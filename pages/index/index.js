import { request } from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    navigatorList: [],
    louchengList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getSwiperList()
   this.getNavigatorList()
   this.getLouchengList()
  },
  async getSwiperList() {
    const result = await request({
      url: '/home/swiperdata'
    })
    this.setData({
      swiperList: result.data.message
    })
  },
  async getNavigatorList() {
    const result = await request({
      url: '/home/catitems'
    })
    this.setData({
      navigatorList: result.data.message
    })
  },
  async getLouchengList() {
    const result = await request({
      url: '/home/floordata'
    })
    this.setData({
      louchengList: result.data.message
    })
  }
})
