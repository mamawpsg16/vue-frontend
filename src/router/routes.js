export default [
    { path: '/:pathMatch(.*)*', name: 'PageNotFound', component: () => import('@/views/pages/Page404.vue') },
    {
      path: '/',
      name: 'Home',
      meta: { requiresAuth: true },
      component: () => import('@/layouts/DefaultLayout.vue'),
      redirect: '/dashboard',
      children: [
            // ADMIN routes
            { 
              path: '/admin',
              name: 'Admin',
              meta:{ parent:true },
              children: [
                {
                  path: 'users',
                  component: () => import('@/views/admin/user/Index.vue'),
                  name: 'admin-users',
                  meta: { requiresAuth: true }
                },
              ],
            },
            {
              path: 'dashboard',
              name: 'dashboard',
              component: () =>import('@/views/dashboard/Dashboard.vue')
            },
            {
              path: 'task',
              name: 'task',
              component: () => import('@/views/task/Index.vue'),
            },
            {
              path: '/report',
              name: 'Report',
              meta:{ parent:true },
              children: [
                {
                  path: '',
                  component: () => import('@/views/report/Index.vue'),
                  name: 'monitoring',
                  meta: { requiresAuth: true }
                },
                {
                  path: ':uuid',
                  component: () => import('@/views/report/Details.vue'),
                  name: 'report-details',
                  meta: { requiresAuth: true }
                },
              ],
            },
            {
              path: 'report',
              name: 'report',
              component: () =>import('@/views/report/Index.vue')
            },
           
          ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/authentication/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/authentication/Register.vue'),
    },
  ]
