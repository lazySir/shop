<template>
  <div class="pagination">
    <button 
    :disabled='this.pageNo==1' 
    @click='backTo(pageNo-1)'>上一页</button>
    <button @click='backTo(1)' :class='{active:pageNo==1}'>1</button>
    <button v-if='starNumAndEndNum.start>2'>···</button>
    <button 
    v-for="(page,index) in starNumAndEndNum.end" 
    :key='index' v-if='page>starNumAndEndNum.start'
    @click='backTo(page)'
      :class='{active:pageNo==page}'
    >{{page}}</button>
    <button v-if='starNumAndEndNum.end<totalPage-1'>···</button>
    <button 
    @click='backTo(this.totalPage)' 
    v-if='starNumAndEndNum.end<totalPage'
          :class='{active:pageNo==totalPage}'
    >{{totalPage}}</button>
    <button :disabled='pageNo==totalPage' @click='backTo(pageNo+1)'>下一页</button>
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props:['pageNo','pageSize','total','continues'],
  computed:{
    //计算出总共多少页
    totalPage(){
      return Math.ceil(this.total/this.pageSize)
    },
    //计算出起始的连续数字
    starNumAndEndNum(){
      const { continues, pageNo, totalPage } = this;
      //定义初始和结束位置
      let start=0,end=1
      //不正常现象 ：连续页码数大于总页数
      if(continues>totalPage){
        start=1
        end=totalPage
      }else{
        //正常情况  连续页码数小于总页数
        start=pageNo-parseInt(continues/2)
        end=pageNo+parseInt(continues/2)
        //如果出现不正常现象（start数字小于等于0）
        if(start<=0){
          start=1,
          end=continues
        }
        if(end>totalPage){
          end=totalPage
          start=totalPage - continues + 1  
          //总共31   
          //pageNo=30    
           //27 28 29 30 31
        }
        
      }
       return { start, end };
    }
  },
  methods:{
    backTo(target){
     return  this.$emit('getPageNo',target)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
