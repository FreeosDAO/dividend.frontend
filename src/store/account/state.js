export default () => ({
  accountName: null,
  autoLogout: false, // Automatic logout at the end of each page.
  connecting: false,
  path: '/',
  active: true,
  proposalInfo: {
    proposalInfo: {
      key: '',
      eosaccount: 'empty account',
      roi_target_cap: '',
      proposal_percentage: '',
      locked: '',
      expires_at: '',
      threshold: '',
      rates_left: '',
      accrued: ''
    }
  }
})
