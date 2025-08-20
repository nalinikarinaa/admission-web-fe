import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import Dashboard from '../views/Dashboard.vue'
import Class from '@/views/Class.vue'
import ClassActive from '@/views/ClassActive.vue'
import RegisterClass from '@/views/RegisterClass.vue'
import Transaction from '@/views/Transaction.vue'
import ClassHistory from '@/views/ClassHistory.vue'
import LoginForm from '@/views/LoginForm.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
import ClassListAdmin from '@/views/ClassListAdmin.vue'
import AddClass from '@/views/AddClass.vue'
import ClassManajemen from '@/views/ClassManajemen.vue'
import ClassHistoryAdmin from '@/views/ClassHistoryAdmin.vue'
import CreateAccount from '@/views/CreateAccount.vue'
import DetailClassManajemen from '@/views/DetailClassManajemen.vue'
import DetailClassHistory from '@/views/DetailClassHistory.vue'

const routes = [
  { path: '/', component: Homepage }, 
  { path: '/dashboard', component: Dashboard },
  { path: '/classlist', component: Class},
  { path: '/classactive', component: ClassActive, props: true},
  { path: '/registerclass/:classId', component: RegisterClass, props: true},
  { path: '/transaction', component: Transaction},
  { path: '/classhistory', component: ClassHistory},
  { path: '/login', component: LoginForm},
  { path: '/dashboard/admin', component: DashboardAdmin},
  { path: '/classlist/admin', component: ClassListAdmin},
  { path: '/classlist/addclass', component: AddClass},
  { path: '/classlist/classmanajemen', component: ClassManajemen},
  { path: '/classlist/classhistory', component: ClassHistoryAdmin},
  { path: '/createaccount' , component: CreateAccount},
  { path: '/classlist/classmanajemen/detailclass/:id' , component: DetailClassManajemen, props: true},
  { path: '/classlist/classhistory/detailclass/:id' , component: DetailClassHistory, props: true},
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

export default router
