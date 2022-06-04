//登录与注册的模块

import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from '@/api/index'
import { setToken, getToken, removeToken } from '@/utils/token'
export default {
  namespaced: true,
  state: {
    //验证码
    code: '',
    token: getToken(),
    userinfo: {},
  },
  mutations: {
    GETCODE(state, payload) {
      state.code = payload
    },
    //登录
    USERLOGIN(state, payload) {
      state.token = payload
    },
    //获取用户信息 存信息
    GETUSERINFO(state, payload) {
      state.userinfo = payload
    },
    //退出登录
    CLEARUSERINFO(state, payload) {
      ;(state.token = ''), (state.userinfo = {}), removeToken()
    },
  },
  actions: {
    //获取验证码
    async getCode(context, payload) {
      let result = await reqGetCode(payload)
      if (result.code == 200) {
        context.commit('GETCODE', result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error('faile'))
      }
    },
    //用户注册
    async userRegister(context, payload) {
      let result = await reqUserRegister(payload)
      if (result.code == 200) return 'ok'
      else return Promise.reject(new Error('faile'))
    },
    //用户登录
    async UserLogin(context, payload) {
      let result = await reqUserLogin(payload)
      //服务器下发的token，用户唯一标识
      if (result.code == 200) {
        context.commit('USERLOGIN', result.data.token)
        //持久化存储token
        setToken(result.data.token)
        return 'ok'
      } else {
        return Promise.reject(new Error('faile'))
      }
    },
    //获取用户信息
    async getUserInfo(context, payload) {
      let result = await reqUserInfo()
      if (result.code == 200) {
        //vuex存储用户信息
        context.commit('GETUSERINFO', result.data)
        return 'ok'
      }else{
        return Promise(new Error('faile'))
      }
    },
    //退出登录
    async  userLogout(context, payload) {
      //通知服务器清除数据
      // reqLogout().then(res=>{
      //   console.log(res)
      // })
      let result = await reqLogout()
      //清除本地
      if (result.code == 200) {
        context.commit('CLEARUSERINFO')
        return 'ok'
      } else return Promise.reject(new Error('faile'))
    },
    
  },
  getters: {},
}
