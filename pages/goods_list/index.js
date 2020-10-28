import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  itemChange(e) {
    const {id : operation} = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      i === operation ? v.isActive = true : v.isActive = false
    })
    this.setData({
      tabs
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    list: []
  },
  // 总页数
  totalPages: 1,
  // 接口参数
  QueryParams:{
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getList()
  },
  async getList() {
    const { data } = await request({url: "/goods/search", data: this.QueryParams})
    // 总条数
    const total = data.total
    // 计算总页数
    this.totalPages = Math.ceil(data.message.total/this.QueryParams.pagesize)
    this.setData({
      list: [...this.data.list, ...data.message.goods]
    })

    // 关闭下拉刷新窗口 如果没有调用下拉刷新的窗口 直接关闭也不会保存
    wx.stopPullDownRefresh()
  },
  // 页面上滑 滚动条触底事件
  onReachBottom() {
    if(this.QueryParams.pagenum>=this.totalPages) {
      wx.showToast({title: '没数据了'})
    }else {
      this.QueryParams.pagenum++
      this.getList()
    }
  },
  
  // 下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      list: []
    })
    this.QueryParams.pagenum = 1
    this.getList()
  }

})