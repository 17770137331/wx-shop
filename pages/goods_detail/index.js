import { request } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  // 商品列表
  goodsList: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this.getList(goods_id)
  },

  async getList(goods_id) {
    const {data} = await request({url:"/goods/detail", data: {goods_id}})
    this.goodsList = data
    // console.log(data)
    this.setData({
      list: data.message
    })
  },
  
  // 图片放大预览
  handleImage(e) {
    const urls = this.goodsList.message.pics.map(itme => itme.pics_mid)
    const current = urls[e.currentTarget.dataset.value]
    console.log(current)
    wx.previewImage({
      // 要预览哪一个
      current,
      // 预览的地址
      urls: [...urls]
    })
  },

  handleAddCart() {
    let cart = wx.getStorageSync("cart")||[];
    let index = cart.findIndex(item=>{
      return item.message.goods_id===this.goodsList.message.goods_id
    })
    if(index===-1){
      this.goodsList.message.num = 1
      this.goodsList.message.checked = true
      cart.push(this.goodsList)
    }else{
      cart[index].message.num++
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '添加成功',
      // 防抖
      mask: true,
    });
  }
})