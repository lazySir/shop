import { reqGetSearchInfo } from '@/api'

export default {
  namespaced: true,
  state: {
    searchList: {},
  },
  mutations: {
    GETSEARCHLIST(state, payload) {
      state.searchList = payload
    },
  },
  actions: {
    getSearchList(context, payload = {}) {
      //当前reqGerSearchInfo这个函数在调用获取服务器的时候，至少需要传递一个参数（空对象）
      //params形参：是用户派发action的时候，第二个参数传递过过来的，至少是一个空对象
      reqGetSearchInfo(payload).then((res) => {
        if (res.code == 200) {
          context.commit('GETSEARCHLIST', res.data)
        }
      })
    },
  },
  getters: {
    goodsList(state){
      return state.searchList.goodsList || []
    },
    attrsList(state){ //平台信息
      return state.searchList.attrsList || []
    },
    trademarkList(state){   //商标列表   //品牌
      return state.searchList.trademarkList || []
    }
  },
}
