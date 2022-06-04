<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul v-for="(cart, index) in cartInfoList" :key="cart.id" class="cart-list">
          <li class="cart-list-con1">
            <input @change="updateChecked(cart.skuId, $event)" :checked="cart.isChecked == 1" type="checkbox" name="chk_list" />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" @click="handler('decrement', -1, cart)" class="mins">-</a>
            <!-- 数量 -->
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum" @change="handler('change', $event.target.value * 1, cart)" />
            <a href="javascript:void(0)" @click="handler('increment', 1, cart)" class="plus">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a @click="deleteCartById(cart)" href="#none" class="sindelet">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input @change="updateAllCartChecked" :checked="isAllChecked&&cartInfoList.length>0" class="chooseAll" type="checkbox" />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked" href="#none">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to='/trade' class="sum-btn" >结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
//引入节流
import { throttle } from 'lodash'
export default {
  name: 'ShopCart',
  methods: {
    ...mapActions('shopcart', ['getCartList', 'deleteCartListBySkuId', 'updateCheckedById', 'deleteAllCheckedCart', 'updateAllCartIsChecked']),
    ...mapActions('detail', ['addOrUpdateShopCart']),
    //修改产品数量    操作类型   变化数量   操作对象
    handler:
      //节流
      throttle(async function (type, disNum, cart) {
        //disNum  （变化量）： 1 -1 input（最终个数）
        //向服务器发送请求 修改数量
        switch (type) {
          case 'increment':
            //带给服务器变化量
            disNum = 1
            break
          case 'decrement':
            // //判断产品的个数如果大于一 才可以传递给服务器-1
            // if(cart.skuNum>1){
            //   disNum = - 1
            // }else{
            //   //产品的个数等于1
            //   disNum = 0
            // }
            disNum = cart.skuNum > 1 ? -1 : 0
            break
          case 'change':
            //用户输入进来的最终的量是非法的   ---->  带有汉字 字母 符号 或者输入小于0的数字  那么带给服务器的数字是0
            if (isNaN(disNum) || disNum < 1) {
              disNum = 0
            } else {
              //正常情况   但是带有小数
              disNum = parseInt(disNum) - cart.skuNum
            }
            break
        }
        //派发action
        await this.addOrUpdateShopCart({ skuId: cart.skuId, skuNum: disNum }) //这里必须用await 不然可能服务器还没返回就执行获取
        //再一次获取服务器数据
        // setTimeout(()=>{this.getCartList()},1)
        this.getCartList()
      }, 1000),

    //删除购物车的某个商品
    async deleteCartById(cart) {
      try {
        //如果删除成功 再次发送请求新数据
        await this.deleteCartListBySkuId(cart.skuId)
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //修改购物车某个产品的勾选状态
    async updateChecked(skuId, $event) {
      try {
        //获取当前的勾选状态   $event.target.checked ---->true or false
        let checked = $event.target.checked ? '1' : '0'
        await this.updateCheckedById({ skuId, checked })
        //再次派发请求 获取购物车列表
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //删除全部选中的商品
    async deleteAllChecked() {
      try {
        //这个回调函数没有办法收集到一些有用的回调函数
        await this.deleteAllCheckedCart()
        //再发请求获取购物车列表
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    //修改全部产品选中的状态
    async updateAllCartChecked(event) {
      try {
        //这里为什么写字符串1  因为接口那么要的是string
        let isChecked = event.target.checked ? '1' : '0'
        //派发一个action
        await this.updateAllCartIsChecked(isChecked)
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
  },

  mounted() {
    this.getCartList()
  },
  computed: {
    ...mapGetters('shopcart', ['cartList']),
    //获取产品信息
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    //计算产品总价
    totalPrice() {
      let sum = 0
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.skuPrice
      })
      return sum
    },
    //判断是否全选
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked == 1)
    },
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
