<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="(floor, index) in floorList" :list="floor" :key="floor.id"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from '@/pages/Home/ListContainer'
import Recommend from '@/pages/Home/Recommend'
import Rank from '@/pages/Home/Rank'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  methods: {
    ...mapActions('home', ['getFloorList']),
  },
  computed: {
    ...mapState('home', ['floorList']),
  },
  mounted() {
    //派发action，获取floor组件
    this.getFloorList()
  },
  // created(){
  //  reqCategoryList().then(res=>{console.log(res)})
  // }
}
</script>

<style></style>
