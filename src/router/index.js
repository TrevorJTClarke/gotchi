import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Detail from '@/components/Detail'
import MyGotchis from '@/components/MyGotchis'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/list',
      name: 'list',
      component: MyGotchis
    },
    {
      path: '/:contract/:id',
      name: 'detail',
      component: Detail,
      props: true
    }
  ]
})
