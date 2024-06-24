<template>
  <ChangePassword/>
  <!-- <CButton @click="logout" > <CIcon :icon="cilAccountLogout" /> Logout </CButton>  -->
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <i class="fa-solid fa-gear"></i>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Account
      </CDropdownHeader>
      <CDropdownItem @click="changePassword">
        <i class="fa-solid fa-key"></i>&nbsp; Change Password
      </CDropdownItem> 
      <!-- <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>  -->
      <!-- <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Settings
      </CDropdownHeader> 
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>  -->
      <CDropdownDivider /> 
      <!-- <CDropdownItem> <CIcon icon="cil-shield-alt" /> Lock Account </CDropdownItem>  -->
      <CButton @click="logout" > <CIcon :icon="cilAccountLogout" />&nbsp;  Logout </CButton> 
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import avatar from '@/assets/images/avatars/8.jpg'
import ChangePassword from '@/views/authentication/ChangePassword.vue';
import { cilAccountLogout  } from '@coreui/icons';

import { useAuthStore } from '@/stores/auth-store.js';

const logout = () => useAuthStore().logout();
const changePassword = function(){
  const modal_id = document.getElementById("change-password-modal");
  const modal = bootstrap.Modal.getOrCreateInstance(modal_id);
  modal.show();
}
const itemsCount = 42
</script>



