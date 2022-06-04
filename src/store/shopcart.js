import { reqCartList, reqDeleteCartById, reqUpdateCheckById } from '@/api/index'

export default {
  namespaced: true,
  state: {
    //存储加入购物车的商品列表
    cartList: [],
  },
  mutations: {
    GETCARTLIST(state, payload) {
      state.cartList = payload
    },
  },
  actions: {
    //获取购物车列表的数据
    getCartList(context, payload) {
      reqCartList().then((res) => {
        if (res.code == 200) {
          context.commit('GETCARTLIST', res.data)
        }
      })
    },
    //删除购物车列表的某个商品
    async deleteCartListBySkuId(context, payload) {
      let result = await reqDeleteCartById(payload)
      if (result.code == 200) return 'ok'
      else return Promise.reject(new Error('faile'))
    },
    //修改购物车某个商品的选中状态
    async updateCheckedById(context, payload) {
      let result = await reqUpdateCheckById(payload.skuId, payload.checked)
      if (result.code == 200) return 'ok'
      else return Promise.reject(new Error('faile'))
    },
    //删除全部勾选的产品
    deleteAllCheckedCart(context, payload) {
      //getters.cartList 里面有存储商品列表数据的数组
      //获取购物车中被选中的商品

      //自己的方案
      // let goods=  context.getters.cartList.cartInfoList.filter(item=>{
      //     return item.isChecked==1
      //   })
      //   goods.forEach(item=>{
      //   context.dispatch('deleteCartListBySkuId',item.skuId)
      //   })
      //老师的方案
      let PromiseAll = []
      context.getters.cartList.cartInfoList.forEach((item) => {
        let promise = item.isChecked == 1 ? context.dispatch('deleteCartListBySkuId', item.skuId) : ''
        //将每一次返回的promise 添加到数组中
        PromiseAll.push(promise)
      })
      ///只要全部的 p1|p2.....都成功，那么返回的结果就是成功
      //如果有一个失败 那么返回的就是失败的结果
      return Promise.all(PromiseAll)
    },
    //修改全部产品的状态
    updateAllCartIsChecked(context, payload) {
      //老师的方案
      // let promiseAll = []
      // context.state.cartList[0].cartInfoList.forEach((item) => {
      //   let promise = context.dispatch('updateCheckedById', { skuId: item.skuId,checked： payload })
      //   promiseAll.push(promise)
      // })
      // return Promise.all(promiseAll)
        //自己的方案
      let PromiseAll = []
      context.getters.cartList.cartInfoList.forEach(item=>{

        let promise=context.dispatch('updateCheckedById', { skuId: item.skuId, checked:payload })
        PromiseAll.push(promise)
      })
      return Promise.all(PromiseAll)
    },
  },
  getters: {
    //这不是我们想要的商品列表数据  这是存储商品列表数据的数据
    cartList(state, payload) {
      return state.cartList[0] || {}
    },
  },
}
