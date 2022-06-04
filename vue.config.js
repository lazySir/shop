const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  //配置代理跨域
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
      },
    },
  },
  //运行配置
  // devServer:{
  //   host:'localhost',
  //   port:8080,
  //   //open:true  因为在别的地方已经设置过了
  // }
})
