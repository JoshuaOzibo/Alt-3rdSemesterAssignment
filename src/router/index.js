import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/SingleRepo/:id',
      name: 'SingleRepo',
      component: () => import('../views/SingleRepo.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)',
      name: 'ErrorPage',
      component: () => import('../Component/ErrorPage.vue'),
  }
  ]
})

export default router
