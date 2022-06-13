# shop

尚品会前端练习项目  已完成。

# 接口
```
//配置反向代理
//baseUrl：api
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn',
      },
    },
  },
 
```

# 账号密码

账号:13700000000

密码:111111

注意：这个账号可以填写购物车地址  如果不需要的话可以自己注册。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
