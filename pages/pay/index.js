// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data() {
    return {
      address: {},
      cart: [],
      allCheck: false,
      allPrice: 0,
      allCount: 0
    }
  },
  onShow() {
    const address = wx.getStorageSync("address")
    const cart = wx.getStorageSync("cart") || []
    const allCheck = cart.length === 0 ? false : cart.every((item) => {
      return item.message.checked === true
    })
    let allPrice = 0
    let allCount = cart.length
    cart.forEach((item) => {
      allPrice += item.message.goods_price * item.message.num
    })

    let arr = cart.filter(item => {
      return item.message.checked
    })
    console.log(arr)
    this.setData({
      address,
      cart: arr,
      allCheck,
      allPrice,
      allCount
    })
  },
  // 获取收货地址
  async handle() {
    try {
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      if (scopeAddress === false) {
        await openSetting()
      }
      let res2 = await chooseAddress()
      res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo
      wx.setStorageSync("address", res2)
      this.setData({ address: res2 })
    } catch (error) {
      console.log(error)
    }

  },

  // 单选框
  danxuan(e) {
    const cart = wx.getStorageSync("cart") || []
    const arr = cart.map((item) => {
      if (item.message.goods_id === e.currentTarget.dataset.value)
        item.message.checked = !item.message.checked
      return item
    })
    let allPrice = 0
    let allCount = 0
    let allCheck = true
    arr.forEach((item) => {
      if (item.message.checked) {
        allCount++
        allPrice += item.message.goods_price * item.message.num
      } else {
        allCheck = false
      }
    })
    wx.setStorageSync('cart', arr)
    this.setData({
      allCheck,
      allCount,
      allPrice
    })
  },

  // 全选
  quanxuan() {
    const cart = wx.getStorageSync("cart") || []
    const arr = cart.map((item) => {
      item.message.checked = !item.message.checked
      return item
    })
    let allPrice = 0
    let allCount = 0
    let allCheck = !this.data.allCheck
    arr.forEach((item) => {
      if (item.message.checked) {
        allCount++
        allPrice += item.message.goods_price * item.message.num
      }
    })
    wx.setStorageSync('cart', arr)
    this.setData({
      allCheck,
      allCount,
      allPrice,
      cart: arr
    })
  },

  // 减
  async reduce(e) {
    const cart = wx.getStorageSync("cart") || []
    const th = this

    // 数据减少
    const arr = cart.map((item, index) => {
      if (item.message.goods_id === e.currentTarget.dataset.value && item.message.num > 1) {
        item.message.num--
      } else {
        console.log(item, cart)
      }
      return item
    })

    // 删除
    const index = arr.findIndex(item => item.message.goods_id === e.currentTarget.dataset.value && item.message.num == 1);
    if (index >= 0) {
      let result = await showModal({ content: "您是否要删除？" })
      if (result.confirm) {
        arr.splice(index, 1)
      }
    }


    // 总价
    let allPrice = 0
    arr.forEach((item) => {
      if (item.message.checked) {
        allPrice += item.message.goods_price * item.message.num
      }
    })

    //  结算数量
    let allCount = arr.length

    // 同步数据
    wx.setStorageSync('cart', arr)
    th.setData({
      cart: arr,
      allPrice,
      allCount
    })
  },

  // 加
  add(e) {
    const cart = wx.getStorageSync("cart") || []
    const th = this
    const arr = cart.map((item) => {
      if (item.message.goods_id === e.currentTarget.dataset.value)
        item.message.num++
      return item
    })

    let allPrice = 0
    arr.forEach((item) => {
      if (item.message.checked) {
        allPrice += item.message.goods_price * item.message.num
      }
    })


    wx.setStorageSync('cart', arr)
    th.setData({
      allPrice,
      cart: arr
    })
  },

  // 结算
  async handleClearn() {
    const { address, allCount } = this.data
    // 1.判断收货地址
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 2 判断用户有没有选购商品
    if (allCount === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
  }
})

