import Vue from 'vue'
import App from './App.vue'
import VueRouter from '../vue-router'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('./components/HelloWorld.vue')
    }, {
      path: '/test',
      component: () => import('./components/test.vue'),
      beforeEnter: (to, from, next) => {
        console.log(`from:${from}`, `to:${to}`)
        setTimeout(()=>{
          next()
        },3000)
      }
    }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
