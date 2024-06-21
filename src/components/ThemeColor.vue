<template>
    <div class="d-flex justify-content-end mt-4 mb-2 container">
        <CDropdown variant="nav-item" placement="bottom-end" title="Change Color Scheme">
            <CDropdownToggle :caret="false">
                <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
                <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
                <CIcon v-else icon="cil-contrast" size="lg" />
            </CDropdownToggle>
            <CDropdownMenu class="dropdown-menu-end">
                <CDropdownItem :active="colorMode === 'light'" class="d-flex align-items-center" component="button" type="button" @click="setColorMode('light')">
                    <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem :active="colorMode === 'dark'" class="d-flex align-items-center" component="button" type="button" @click="setColorMode('dark')">
                    <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
                </CDropdownItem>
                <!-- <CDropdownItem :active="colorMode === 'auto'" class="d-flex align-items-center" component="button" type="button" @click="setColorMode('auto')">
                    <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
                </CDropdownItem> -->
            </CDropdownMenu>
        </CDropdown>
    </div>
</template>

<script setup>
import { useColorModes } from '@coreui/vue'

const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')
</script>
