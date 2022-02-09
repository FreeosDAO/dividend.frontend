export default () => ({
  isMessage: false, // used by '2nd voter solver'
  isVoted: false, // '2nd voter solver' problem indicator
  Whitelist: {
    whitelistInfo: [
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 }
    ]
  },
  //
  accountName: null,
  secondVoterName: null,
  autoLogout: false, // Automatic logout at the end of each page not used yet
  connecting: false,
  userType: 0, // 1- proposer, 2,3 - voters, 4 - other
  path: '/',
  active: true,
  proposer: '', // proposer account name
  isProposer: false,
  // postBoxData: {
  // postBoxData: {
  // key: 0,
  // eosaccount: ''
  // }
  // },
  isSecondVoter: '',
  proposalInfo: {
    proposalInfo: {
      key: '',
      eosaccount: 'empty account', // TODO verify text !!!
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
