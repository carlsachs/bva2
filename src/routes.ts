import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'pages-generated'
import { setupLayouts } from 'layouts-generated'
//import { authGuard } from '~/modules/auth0'

/*
generatedRoutes.map( route => {
  if (route.name === 'profile') {
    route.beforeEnter = authGuard
  }
})
*/

const routes = setupLayouts(generatedRoutes)

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

