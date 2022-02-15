export default () => ({
  isMessage: false, // used by '2nd voter solver'
  isVoted: false, // '2nd voter solver' problem indicator
  isSecondVoter: false, // '2nd voter solver' todo what is the purpose of this again?
  secondVoterName: null,
  //
  Whitelist: {
    whitelistInfo: [
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 }
    ]
  },
  //
  accountName: null,
  //
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
  //
  // All proposal data to display for Vote
  // todo Note: For Vote should be read from the active proposal in backend (verify).
  proposalInfo: {
    proposalInfo: {
      key: '',
      eosaccount: 'empty account', // TODO verify text or just null!!!
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
