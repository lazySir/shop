//当前这个模块 所有API进行统一管理
import requests from './request'

import mockAjax from './mockAjax'
//三级联动的接口
///api/product/getBaseCategoryList get 无参数
export const reqgetCategoryList = () => {
  return requests({
    url: '/product/getBaseCategoryList',
    method: 'get',
  })
}
//获取轮播图的数据
export const reqGetBannerList = () => mockAjax.get('/banner')
//获取floor的数据
export const reqGetFloorList = () => mockAjax.get('/floor')

//获取搜索模块的接口 地址：/api/list 请求方式 post  参数：需要参数
/*
{
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}

*/
export const reqGetSearchInfo = (params) =>
  requests({
    url: '/list',
    method: 'post',
    data: params,
  })

//获取商品详情信息的接口  URL：/api/item/{skuId} method：get
export const reqGoodsInfo = (skuId) =>
  requests({
    url: `/item/${skuId}`,
    method: 'get',
  })

//将产品添加到购物车当中
///api/cart/addToCart/{skuId}/{skuNum} method:post
export const reqAddOrUpdateShopCart = (skuId, skuNum) =>
  requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post',
  })

//获取购物车列表
// /api/cart/cartList method:get
export const reqCartList = () =>
  requests({
    url: '/cart/cartList',
    method: 'get',
  })

//删除购物车列表的商品
// /api/cart/deleteCart/{skuId}  method:DELETE
export const reqDeleteCartById = (skuId) =>
  requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete',
  })

//切换购物车列表商品的勾选状态
// api/cart/checkCart/{skuId}/{isChecked}  method:get
export const reqUpdateCheckById = (skuId, isChecked) => {
  return requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get',
  })
}

//获取注册验证码接口
// /api/user/passport/sendCode/{phone}   method:get
export const reqGetCode = (phone) => {
  return requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get',
  })
}

//注册接口
//  /api/user/passport/register method:post  phone code password
export const reqUserRegister = (data) => {
  return requests({
    url: `/user/passport/register`,
    method: 'post',
    data: data,
  })
}

//登录接口
//user/passport/login method:post phone password
export const reqUserLogin = (data) => {
  return requests({
    url: `/user/passport/login`,
    method: 'post',
    data,
  })
}

//获取用户信息 【需要带着用户的token要用户信息】
//  passport/auth/getUserInfo
export const reqUserInfo = () => {
  return requests({
    url: '/user/passport/auth/getUserInfo',
    method: 'get',
  })
}

//退出登录
//  user/passport/logout get

export const reqLogout = () => {
  return requests({
    url: '/user/passport/logout',
    method: 'get',
  })
}
//获取用户地址信息
// /user/userAddress/auth/findUserAddressList method:get
export const reqAddressInfo = () =>
  requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get',
  })

//获取商品清单
// url:'/order/auth/trade' method:get
export const reqOrderInfo = () =>
  requests({
    url: '/order/auth/trade',
    method: 'get',
  })

//提交订单
// /api/order/auth/submitOrder?tradeNo={tradeNo} POST

/*
参数名称	类型	是否必选	描述
traderNo	string	Y	交易编号(拼接在路径中)
consignee	string	Y	收件人姓名
consigneeTel	string	Y	收件人电话
deliveryAddress	string	Y	收件地址
paymentWay	string	Y	支付方式
(ONLINE代表在线)
orderComment	string	Y	订单备注
orderDetailList	Array	Y	存储多个商品对象的数组
*/
export const reqSubmitOrder = (tradeNo, data) => {
  return requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
    method: 'post',
  })
}

//获取订单信息
//  /payment/weixin/createNative/{orderId}      /method:get
export const reqPayInfo = (orderId) =>
  requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get',
  })

//获取支付订单状态
//url :  /payment/weixin/queryPayStatus/{orderId} get
export const reqPayStatus = (orderId) =>
  requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get',
  })

  //获取个人中心的数据
  //  /order/auth/{page}/{limit}  get

  export const reqMyOrderList=(page,limit)=>requests({
    url:`/order/auth/${page}/${limit}`,
    method:'get'
  })