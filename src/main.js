import Vue from 'vue'
import App from './App.vue'
import router from '@/router'

//element-ui
import { MessageBox } from 'element-ui';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
//
//三级联动组件--全局组件
import TypeNav from '@/components/TypeNav'


//分页器
import Pagination from '@/components/Pagination'


//引入mockjs
import '@/mock/mockServe'



//第一个参数：全局组件的名字 第二个参数：哪一个组件
//引入swiper样式
import 'swiper/css/swiper.css'
Vue.component(TypeNav.name, TypeNav)
Vue.component(Pagination.name, Pagination)


//引入图片懒加载
import VueLazyload from 'vue-lazyload'
 //注册
import pic from '@/assets/images/loading.jpg'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',  //错误时加载的图片
  loading: pic, //等待时显示的图片
  attempt: 1
})

//引入表单校验插件
import '@/plugins/validate'

//引入store
import store from './store'


Vue.config.productionTip = false


//添加事件总线对象
Vue.prototype.$bus = new Vue()




//所有的请求接口挂载到原型上
Vue.prototype.$API = API
import * as API from '@/api'
//统一接口api文件夹里面全部请求函数

new Vue({
  render: (h) => h(App),
  router,
  //注册仓库 ： 组件实例的身上会多了一个属性叫$store的属性
  store,
}).$mount('#app')
