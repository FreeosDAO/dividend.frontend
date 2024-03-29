const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/proposal', component: () => import('pages/Proposal.vue') },
      { path: '/vote', component: () => import('pages/Vote.vue') },
      { path: '/customer', component: () => import('pages/Customer.vue') },
      { path: '/analytics', component: () => import('pages/Analytics.vue') },
      { path: '/test', component: () => import('pages/Test.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
