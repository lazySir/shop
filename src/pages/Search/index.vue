<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <!-- 面包屑 -->
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li v-show="searchParams.categoryName" class="with-x">{{ searchParams.categoryName }} <i @click="removeCategoryName">x</i></li>
            <!-- 关键字的面包屑 -->
            <li v-show="searchParams.keyword" class="with-x">{{ searchParams.keyword }} <i @click="removeKeyword">x</i></li>
            <!-- 品牌的面包屑 -->
            <li v-if="searchParams.trademark" class="with-x">{{ searchParams.trademark.split(':')[1] }} <i @click="removeTrademark">x</i></li>
            <!-- 平台售卖属性的面包屑 -->
            <li v-for="(attrValue, index) in searchParams.props" :key="index" class="with-x">{{ attrValue.split(':')[1] }} <i @click="removeProps(index)">x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @attrInfo="attrInfo" @trademarkInfo="trademarkInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li @click="changeOrder('1')" :class="{ active: isOne }">
                  <a>综合 <span v-show="isOne" class="iconfont" :class="{ 'icon-UP': isAsc, 'icon-DOWN': isDesc }"></span></a>
                </li>
                <li @click="changeOrder('2')" :class="{ active: isTwo }">
                  <a>价格<span v-show="isTwo" class="iconfont" :class="{ 'icon-UP': isAsc, 'icon-DOWN': isDesc }"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good, index) in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 在路由跳转的时候带id -->
                    <router-link :to="`/detail/${good.id}`" ><img v-lazy="good.defaultImg" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <router-link :to='`/detail/${good.id}`' target="_blank"  title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ good.title }}</router-link>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <Pagination :pageSize="searchParams.pageSize" @getPageNo="getPageNo" :pageNo="searchParams.pageNo" :total="getTotal" :continues="5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'Search',

  components: {
    SearchSelector,
  },
  computed: {
    ...mapState('search', ['searchList']),
    ...mapGetters('search', ['goodsList']),
    isOne() {
      return this.searchParams.order.indexOf('1') != -1
    },
    isTwo() {
      return this.searchParams.order.indexOf('2') != -1
    },
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1
    },
    isDesc() {
      return this.searchParams.order.indexOf('desc') != -1
    },
    //获取search模块一共多少商品信息
    getTotal() {
      return this.searchList.total
    },
  },
  methods: {
    ...mapActions('search', ['getSearchList']),
    getData() {
      this.getSearchList(this.searchParams)
    },
    //自定义信息回调  品牌信息被点击
    trademarkInfo(trademark) {
      //整理参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      //再次发送请求
      this.getData(this.searchParams)
    },
    //收集平台信息的回调函数
    attrInfo(attr, attrValue) {
      //整理参数格式
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
      //  数组去重判断
      if (this.searchParams.props.indexOf(props) == -1) {
        this.searchParams.props.push(props)
        //再次发请求
        this.getData()
      }
    },
    //面包屑分类删除
    removeCategoryName() {
      //制空参数
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      //设置为undefined是为了从服务器出发  不让这些数据发送给服务器 设置为‘ ’空 还是会带给服务器
      //再次发送请求
      this.getData()
      //清空route.path 路径
      if (this.$route.params) {
        this.$router.push({ name: 'search', params: this.$route.params })
      }
    },
    //面包屑删除平台售卖属性
    removeProps(index) {
      this.searchParams.props.splice(index, 1)
      this.getData()
    },
    //面包屑关键字删除
    removeKeyword() {
      this.searchParams.keyword = undefined
      //再次发送请求
      this.getData()
      //通知兄弟组件Header清楚关键字
      this.$bus.$emit('clear')
      //清空地址栏
      if (this.$route.query) {
        this.$router.push({ name: 'search', query: this.$route.query })
      }
    },
    //面包屑品牌删除
    removeTrademark() {
      this.searchParams.trademark = undefined
      this.getData()
    },
    //排序的操作
    changeOrder(flag) {
      //flag  标记  代表用户点击的是综合（1） 还是价格（2）
      let originFlag = this.searchParams.order.split(':')
      let newOrder = ''
      if (flag == originFlag[0]) {
        newOrder = `${originFlag[0]}:${originFlag[1] == 'desc' ? 'asc' : 'desc'}`
      } else {
        newOrder = `${flag}:${'desc'}`
      }
      //修改值
      this.searchParams.order = newOrder
      //重新发送请求
      this.getData()
    },
    //获取当前第几页
    getPageNo(pageNo) {
      //整理带给服务器参数
      this.searchParams.pageNo = pageNo
      //再次发请求
      this.getData()
    },
  },
  beforeMount() {
    // this.searchParams.category1Id=this.$route.query.category1Id
    // this.searchParams.category2Id=this.$route.query.category2Id
    // this.searchParams.category3Id=this.$route.query.category3Id
    // this.searchParams.categoryName=this.$route.query.categoryName
    // this.searchParams.keyword=this.$route.params.keyword
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
    //在发请求之后带给服务器参数【search】
    this.getData()
  },
  watch: {
    //通过监听route变化发送请求数据
    $route: {
      handler(newValue, oldValue) {
        //制空请求参数 让他接受下一次参数
        this.searchParams.category1Id = undefined
        this.searchParams.category2Id = undefined
        this.searchParams.category3Id = undefined
        //设置为undefined是为了从服务器出发  不让这些数据发送给服务器 设置为‘ ’空 还是会带给服务器
        //重新整理参数
        Object.assign(this.searchParams, this.$route.query, this.$route.params)
        //发送请求
        this.getSearchList(this.searchParams)
      },
    },
  },
  data() {
    return {
      searchParams: {
        //一级分类的id
        category1Id: '',
        //二级分类的id
        category2Id: '',
        //三级分类的id
        category3Id: '',
        //分类名字
        categoryName: '',
        //关键词
        keyword: '', //1.综合 2.价格  asc 升序 desc降序
        //排序
        order: '1:asc',
        //分页器
        pageNo: 1,
        //每一个展示的数据个数
        pageSize: 10,
        //平台售卖属性的参数
        props: [],
        //品牌
        trademark: '',
      },
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
