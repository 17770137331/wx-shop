import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftCategory: [],
    rightCategory: [],
    currIndex: 0,
    scTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cate = wx.getStorageSync("cate")
    if(!cate) {
      // console.log(1)
      this.getCategoryList()
    } else{
      if(Date.now()-cate.time>1000*10){
        // console.log(2)
        this.getCategoryList()
      }else{
        let left = cate.data.map(item => item.cat_name)
        let right = cate.data[0].children.map(item => item)
        // console.log(3, cate, left, right)
        this.setData({
          leftCategory: left,
          rightCategory: right
        })
      }
    }
  },

  // 获取数据
  async getCategoryList() {
    const result = await request({url: '/categories'})
    let list = JSON.parse(JSON.stringify(result.data.message))
    let left = list.map(item => item.cat_name)
    let right = list[0].children.map(item => item)
    wx.setStorageSync("cate", { time: Date.now(), data: list })
    this.setData({
      leftCategory: left,
      rightCategory: right
    })
  },

  // 点击改变颜色
  handleClick(e) {
    const cate = wx.getStorageSync("cate")
    if (!cate) {
      this.getCategoryList()
    } else {
      if (Date.now() - cate.time > 1000 * 10) {
        this.getCategoryList()
      } else {
        let left = cate.data.map(item => item.cat_name)
        let right = cate.data[e.currentTarget.dataset.operation].children.map(item => item)
        this.setData({
          leftCategory: left,
          rightCategory: right,
          scTop: 0
        })
      }
    }
    this.setData({
      currIndex: e.currentTarget.dataset.operation
    })
  }
 
})