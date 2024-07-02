// import apiClient from '@/helpers/http/api-client.js';
// import { useAuthStore } from '@/stores/auth-store.js';
// import { computed } from 'vue';
// const isUserAuthenticated = computed(() => localStorage.getItem('authenticated') == true) ; //
// console.log(isUserAuthenticated,'isUserAuthenticated');
// let data = [];
// async function fetchMenus() {
//   const response = await apiClient.get('/api/menus');
//   if (!response.data.menus.length) return [];
//   const { menus } = response.data;
//   // Step 1: Nest children under their respective parents
//   for (const item of menus) {
//     if (!item.parent_id && !item.is_item){
//       item.items = menus.filter(menu => menu.parent_id === item.id);
//     }
//   }

//   // Step 2: Remove nested children from the original array
//   return menus.filter(item => !item.parent_id);
// }
// data = await fetchMenus();

// export default data;
// // console.log(data,'data');
// // const constructMenu = (data) => {
  
// // }

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
        name: 'Menus',
        to: '/admin/menus',
        icon: 'fa-solid fa-bars',
      },
      {
        component: 'CNavItem',
        name: 'Users',
        to: '/admin/users',
        icon: 'fa-solid fa-users',
      },
      {
        component: 'CNavItem',
        name: 'Report',
        to: '/report',
        icon: 'fa-solid fa-ticket',
      },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Tasks',
    to: '/tasks',
    icon: 'cil-list',
  },
]
