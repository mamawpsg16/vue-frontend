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
              children: [
                {
                  path: 'users',
                  component: () => import('@/views/admin/user/Index.vue'),
                  name: 'admin-users',
                  meta: { requiresAuth: true,  breadcrumb:'Users' }
                },
                {
                  path: 'menus',
                  component: () => import('@/views/admin/menu/Index.vue'),
                  name: 'admin-menus',
                  meta: { requiresAuth: true,  breadcrumb:'Menus' }
                },
              ],
            },
            {
              path: 'dashboard',
              name: 'dashboard',
              component: () =>import('@/views/dashboard/Dashboard.vue'),
              meta: { breadcrumb:'Dashboard' },
            },
            {
              path: 'tasks',
              name: 'tasks',
              component: () => import('@/views/task/Index.vue'),
              meta: { breadcrumb:'Tasks' },
            },
            {
              path: '/report',
              name: 'report',
              meta: { breadcrumb:'Report' },
              children: [
                {
                  path: '',
                  component: () => import('@/views/report/Index.vue'),
                  name: 'home',
                  meta: { requiresAuth: true, breadcrumb:'Report' },
                },
                {
                  path: 'create',
                  component: () => import('@/views/report/Create.vue'),
                  name: 'report-create',
                  meta: { requiresAuth: true, breadcrumb: 'Create' }
                },
                {
                  path: ':uuid',
                  component: () => import('@/views/report/Details.vue'),
                  name: 'report-details',
                  meta: { requiresAuth: true, breadcrumb:'Details'  }
                },
              ],
            },
            // { 
            //   path: '/forbidden',
            //   component: Forbidden, 
            //   name: 'forbidden', 
            //   meta: { requiresAuth: true } 
            // },
            { 
              path: '/email-verification', 
              component: () => import('@/views/authentication/EmailVerification.vue'), 
              name: 'email-verification', 
              meta: { requiresAuth: true }
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
    { 
      path: '/reset-password/:token',
      component: () => import('@/views/authentication/ResetPasswordConfirmation.vue'),
      name:'reset-password-confirmation',
    },
  ]
