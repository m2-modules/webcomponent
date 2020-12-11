import { addPages, route } from '@m2fw/router'

import { store } from '@m2fw/redux-manager'

store.addReducers({
  route: route as any,
})

const pages = [
  {
    title: 'Menu Manager',
    tagName: 'menu-management',
    route: 'menus',
    importer: async () => console.log('sample'),
  },
]
debugger
addPages(pages)

import('./playground-app').then(() => {
  console.log(`playground-cli is launched! (Powered by M2FW)`)
})