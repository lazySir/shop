import { reqAddOrUpdateShopCart, reqGoodsInfo } from '@/api'
//生成一个随机的字符串 当作游客临时身份
import { getUUID } from '@/utils/uuid_token'
export default {
  namespaced: true,
  state: {
    goodsInfo: {},
    //游客的临时身份
    uuid_token: getUUID(),
  },
  mutations: {
    GETGOODSINFO(state, payload) {
      state.goodsInfo = payload
    },
  },
  actions: {
    //获取产品
    getGoodsInfo(context, payload) {
      reqGoodsInfo(payload).then((res) => {
        if (res.code == 200) {
          context.commit('GETGOODSINFO', res.data)
        }
      })
    },
    //将产品添加到购物车
    async addOrUpdateShopCart(context, payload) {
      let result = await reqAddOrUpdateShopCart(payload.skuId, payload.skuNum)
      if (result.code == 200) {
        return 'ok'
      } else {
        return Promise.reject(new Error('faile'))
      }
    },
    //  addOrUpdateShopCart(context, payload) {
    //   reqAddOrUpdateShopCart(payload.skuId, payload.skuNum).then(res=>{
    //     if(res.code==200){
    //       return 'ok'
    //     }else{
    //       return 'faile'
    //     }
    //   })
    //  },
  },
  getters: {
    //简化面包屑
    categoryView(state, payload) {
      //state.goodsInfo初始状态是undefined  所以会有个报错
      return state.goodsInfo.categoryView || {}
    },
    //简化产品信息的数据
    skuInfo(state) {
      return state.goodsInfo.skuInfo || {}
    },
    //产品售卖属性的数据简写
    spuSaleAttrList(state, payload) {
      return state.goodsInfo.spuSaleAttrList || []
    },
  },
}
