import { AppRouteRecord } from '@/types'

export const homeRoutes: AppRouteRecord = {
  name: 'Home',
  path: '/home',
  component: '/home/index',
  meta: {
    title: '首页',
    icon: 'ri:pie-chart-line',
    roles: ['R_SUPER', 'R_ADMIN', 'R_USER']
  }
}
