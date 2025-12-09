import { createRouter, createWebHistory } from 'vue-router'
import FlowChartView from '../views/FlowChartView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'flowchart',
      component: FlowChartView,
    },
    {
      path: '/node/:id',
      name: 'node-details',
      component: FlowChartView,
      props: true,
    },
  ],
})

export default router

