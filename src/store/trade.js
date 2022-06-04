import {reqAddressInfo,reqOrderInfo} from '@/api'
export default {
  namespaced: true,
  state:{
    addressInfo:[],
    orderInfo:{}
  },
  mutations:{
    //操作用户地址信息
    GETUSERADDRESS(state,payload){
      state.addressInfo=payload
    },
    GETORDERINFO(state,payload){
      state.orderInfo=payload
    }
  },
  actions: {
    //获取用户地址信息
   async getUserAddress(context,payload){
     let result= await reqAddressInfo()
     if(result.code==200){
       context.commit('GETUSERADDRESS',result.data)
     }
    },
    //获取商品清单的数据
    async getOrderInfo(context,payload){
      let result = await reqOrderInfo()
      if(result.code==200){
        context.commit('GETORDERINFO',result.data)
      }
    }
  },
  getters:{},
}
//这种方式是为了能够使用
//mapAction|State|Getters|Mutations 
//因为需要命名空间