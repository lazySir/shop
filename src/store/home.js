import { reqgetCategoryList, reqGetBannerList ,reqGetFloorList} from '@/api'
//home模块的仓库
export default {
  namespaced: true,
  state: {
    //home仓库中存储三级菜单的数据
    categoryList: [],
    bannerList: [],
    floorList:[],
  },
  mutations: {
    GETFLOORLIST(state,payload){
      state.floorList=payload
    },
    GETBANNERLIST(state, payload) {
      state.bannerList = payload
    },
    GETCATEGORYLIST(state, payload) {
      state.categoryList = payload
    },
  },
  actions: {
    //获取floor数据
    getFloorList(context,payload){
      reqGetFloorList().then(res=>{
        if(res.code==200){
          context.commit('GETFLOORLIST',res.data)
        }
      })
    },
    //获取首页轮播图的数据
    getBannerList(context, payload) {
      reqGetBannerList().then((res) => {
        if (res.code == 200) {
          context.commit('GETBANNERLIST', res.data)
        }
      })
    },
    getCategoryList(context, payload) {
      //reqgetCategoryList返回的是一个Promise对象
      //需要用await接受成功返回的结果，await必须要结合async一起使用（CP）
      reqgetCategoryList().then((res) => {
        context.commit('GETCATEGORYLIST', res.data)
      })
    },
  },
}
