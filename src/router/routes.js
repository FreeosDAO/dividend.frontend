const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/propintermed', component: () => import('pages/propintermed.vue') },
      { path: '/voteintermed', component: () => import('pages/voteintermed.vue') },
      { path: '/proposal', component: () => import('pages/Proposal.vue') },
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
