<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div @mouseenter="enterShow" @mouseleave="leaveIndex()" class="container">
      <h2 class="all">全部商品分类</h2>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
      <transition name="sort">
        <div v-show="isShow" class="sort">
          <div @click="goSearch" class="all-sort-list2">
            <div :class="{ cur: currentIndex === index }" v-for="(c1, index) in categoryList" class="item">
              <h3 @mouseenter="changeIndex(index)">
                <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName }}</a>
              </h3>
              <!-- 二三级分类 -->
              <div :style="{ display: currentIndex == index ? 'block' : 'none' }" class="item-list clearfix">
                <div v-for="(c2, index) in c1.categoryChild" class="subitem">
                  <dl class="fore">
                    <dt>
                      <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{ c2.categoryName }}</a>
                    </dt>
                    <dd>
                      <em v-for="(c3, index) in c2.categoryChild">
                        <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapActions } from 'vuex'
import { throttle } from 'lodash' //引入节流 lodash是默认在node里面的
export default {
  name: 'TypeNav',
  data() {
    return {
      //存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      isShow: false,
    }
  },
  created() {
    //通知vuex发送请求 获取数据 存储与仓库中
    this.getCategoryList()
  },
  mounted() {
    //如果不是home模块将Type进行隐藏
    if (this.$route.path.indexOf('/home') != -1) {
      this.isShow = true
    }
  },
  computed: {
    ...mapState('home', ['categoryList']),
  },
  methods: {
    ...mapActions('home', ['getCategoryList']),
    //一级：鼠标进入
    changeIndex: throttle(function (index) {
      //正常情况，用户慢慢的操作 都会触发鼠标进入事件
      //非正常情况，用户操作非常快，不会全部触发鼠标进入事件
      this.currentIndex = index
    }, 50),
    //一级：鼠标移除
    leaveIndex() {
      this.currentIndex = -1
      if(this.$route.path.indexOf('home')!=-1){
        this.isShow=true
      }else{
        this.isShow=false
      }
      

    },
    goSearch() {
      //最好的解决方案：编程式导航加事件的委派
      //利用事件委派存在一些问题  ：
      //1.怎么确定点击一定是a标签吗？
      let element = event.target
      //解答：给a标签添加自定义属性 其余节点是没有的
      //2.怎么确定点击的是几级分类

      let { categoryname, category1id, category2id, category3id } = element.dataset
      //获取到触发这个事件的节点【h3，a，dt，dl】需要带有data-categoryname这样的节点
      //如果标签上拥有categoryname那么一定是a标签
      if (categoryname) {
        //那么如果确定是几级a标签？  给a标签添加id
        //整理路由跳转的参数
        let location = { name: 'search' }
        let query = { categoryName: categoryname }
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else {
          query.category3Id = category3id
        }

        //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if (this.$route.params) {
          location.params = this.$route.params
          //动态给location配置对象添加query属性
          location.query = query
          //路由跳转
          this.$router.push(location)
        }
      }
    },
    //鼠标移入的时候 显示商品列表
    enterShow() {
      this.isShow = true
    },
  },
}
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    //过度动画开始的动画
    .sort-enter {
      height: 0px;
    }
    //过度动画结束状态
    .sort-enter-to {
      height: 461px;
    }
    //过度动画时间 速率
    .sort-enter-active {
      transition: all 0.5s linear; //所有 0.5秒 匀速
    }
  }
}
</style>
