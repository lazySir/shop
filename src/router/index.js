import Vue from 'vue'
import VueRouter from 'vue-router'

//引入store
import store from '@/store'

Vue.use(VueRouter)

const Home = () => import('@/pages/Home')
const Search = () => import('@/pages/Search')
const Login = () => import('@/pages/Login')
const Register = () => import('@/pages/Register')
const Detail = () => import('@/pages/Detail')
const AddCartSuccess = () => import('@/pages/AddCartSuccess')
const ShopCart = () => import('@/pages/ShopCart')
const Trade = () => import('@/pages/Trade')
const Pay = () => import('@/pages/Pay')
const PaySuccess = () => import('@/pages/PaySuccess')
const Center = () => import('@/pages/Center')
const MyOrder = () => import('@/pages/Center/myOrder')
const GroupOrder = () => import('@/pages/Center/groupOrder')
//需要重写VueRouter.prototype原型对象身上的push|replace方法
//先把VueRouter.prototype身上的push|replace方法进行保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function (location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject)
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => {},
      () => {},
    )
  }
}
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(
      this,
      location,
      () => {},
      () => {},
    )
  }
}
let router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: Home,
      meta: { show: true },
    },
    {
      path: '/search/:keyword?',
      component: Search,
      meta: { show: true },
      name: 'search',
    },
    {
      path: '/login',
      component: Login,
      meta: { show: false },
    },
    {
      path: '/register',
      component: Register,
      meta: { show: false },
    },
    {
      path: '/detail/:skuid?',
      component: Detail,
      meta: { show: true },
    },
    {
      path: '/addcartsuccess',
      component: AddCartSuccess,
      meta: { isShow: true },
      name: 'addcartsuccess',
    },
    {
      path: '/shopcart',
      component: ShopCart,
      meta: { isShow: true },
    },
    {
      path: '/trade',
      component: Trade,
      meta: { isShow: true },
      //路由独享守卫
      beforeEnter: (to, from, next) => {
        if (from.path != '/shopcart') {
          next(false)
        } else {
          next()
        }
      },
    },
    {
      path: '/pay',
      component: Pay,
      meta: { isShow: true },
      beforeEnter:(to,from,next)=>{
        if(from.path=='/trade'){
          next()
        }else{
          next(false)
        }
      }
    },
    {
      path: '/paysuccess',
      component: PaySuccess,
      meta: { isShow: true },
    },
    {
      path: '/center',
      component: Center,
      meta: { isShow: true },
      children: [
        {
          path: '/center',
          redirect: '/center/myorder',
        },
        {
          path: 'myorder',
          component: MyOrder,
        },
        {
          path: 'grouporder',
          component: GroupOrder,
        },
      ],
    },
  ],
  //滚动行为
  scrollBehavior(to, from, savePosition) {
    //返回的y代表y在最上面
    return { x: 0, y: 0 }
  },
})
//全局守卫--->前置守卫
router.beforeEach(async (to, from, next) => {
  //用户登录了才会有token   未登录 那一定是undefined
  let token = store.state.user.token
  //用户的信息
  let name = store.state.user.userinfo.name
  //用户已经登录
  if (token) {
    //用户已经登录了 那么就不能去login
    if (to.path == '/login') {
      next('/')
    } else {
      //已经登录了 而且去的不是login
      if (name) {
        next()
      } else {
        //先派发请求获取用户信息  让仓库存储用户信息 在跳转
        try {
          await store.dispatch('user/getUserInfo')
          //放行
          next()
        } catch (error) {
          //token过期了
          //清除信息
          await store.dispatch('user/userLogout')
          next('/login')
        }
      }
    }
  }
  //用户未登录
  else {
    //未登录
    //未登录不能去 交易相关/不能去支付相关【pay|paysuccess】/不能去个人中国
    let toPath = to.path
    let requireLogin = ['/trade', '/pay', '/paysuccess', '/center/myorder']
    let flag = requireLogin.find((item) => {
      return item == toPath
    }) //如果找到了那么匹配的是toPath未找到则返回undefined
    //未登录去上面这些路由---强制改为去登录
    if (flag) {
      //将为登陆前想去的位置存储在query中
      next('/login?redirect=' + toPath)
    } else {
      next()
    }
  }
})
export default router
