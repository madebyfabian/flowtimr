import { createWebHistory, createRouter } from 'vue-router'

import MainView from '@/views/Main.view'
import { store } from '@/store'



const routes = [
  {
    path: '/',
    name: 'MainView',
    component: MainView
	},
  {
    path: '/auth',
		name: 'AuthView',
		component: () => import('@/views/Auth.view.vue'),
		children: [
			{
				path: 'callback/:provider',
				name: 'AuthCallback',
				beforeEnter: store.APIService.handleAuthCallback
			}
		]
	}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router