import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
    })

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              item.icon && item.icon.includes('cil-')
              ? h(resolveComponent('CIcon'), {
                  customClassName: 'nav-icon sidebar-nav-item',
                  name: item.icon,
                })
              : item.icon && !item.icon.includes('cil-')
              ?  h('i', {
                  class: `nav-icon sidebar-nav-item ${item.icon}`,
                  name: item.icon,
                })
              : "",
              item.name,
            ],
              default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: false,
              class:'sidebar-nav-item'
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    class: 'sidebar-nav-item'
                  },
                  {
                    default: () => [
                      item.icon && item.icon.includes('cil-')
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon sidebar-nav-item',
                            name: item.icon,
                          })
                        : item.icon && !item.icon.includes('cil-')
                        ?  h('i', {
                            class: `nav-icon sidebar-nav-item ${item.icon}`,
                            name: item.icon,
                          })
                        : "",
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
              class:'sidebar-nav-item'
            },
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
          class:'sidebar-nav-item'
        },
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav }