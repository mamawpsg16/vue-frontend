import { h, resolveComponent } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout'


export default [
    {
      path: '/',
      name: 'Home',
      // component: DefaultLayout,
      redirect: '/dashboard',
      children: [
            {
            path: '/dashboard',
            name: 'Dashboard',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(
                /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
                ),
            },
          ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/Login'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/pages/Register'),
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render() {
          return h(resolveComponent('router-view'))
        },
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: () => import('@/views/pages/Page404'),
        },
        {
          path: '500',
          name: 'Page500',
          component: () => import('@/views/pages/Page500'),
        },
       
      ],
    },
  ]
