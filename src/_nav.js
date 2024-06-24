export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavGroup',
    name: 'Admin',
    to: '/admin',
    icon: 'fa-solid fa-user-tie',
    items: [
      {
        component: 'CNavItem',
        name: 'Users',
        to: '/admin/users',
        icon: 'fa-solid fa-users',
      },
      {
        component: 'CNavItem',
        name: 'Report Monitoring',
        to: '/report/monitoring',
        icon: 'fa-solid fa-ticket',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Task',
    to: '/task',
    icon: 'cil-list',
  },
  {
    component: 'CNavItem',
    name: 'Report',
    to: '/report/create',
    icon: 'fa-solid fa-ticket-simple',
  },

]
