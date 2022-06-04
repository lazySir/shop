<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer v-show='isShow'></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed:{
    isShow(){
      return this.$route.meta.show
    }
  }
}
</script>

<style>

</style>
