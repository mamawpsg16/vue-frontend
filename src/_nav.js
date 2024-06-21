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
    icon: 'cil-bell',
    items: [
      {
        component: 'CNavItem',
        name: 'User',
        to: '/admin/users',
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
    to: '/report',
    icon: 'fa-solid fa-user-tie',
  },
]
