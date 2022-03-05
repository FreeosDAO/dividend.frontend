export default () => ({
  isVoted: false,
  // isSecondVoter: false, // '2nd voter solver'
  // secondVoterName: null, // todo is it used anymore.
  isProposalVoted: false, // Proposal was already voted by one voter ...
  alreadyVoted: '', // ... this is name who already voted.
  //
  Whitelist: { // todo take care is it used anymore ?
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
  isProposer: false, // does current account belongs to proposer?
  // }
  // },
  //
  // All proposal data to display for Vote
  // todo Note: For Vote should be read from the active proposal in backend (verify).
  proposalInfo: {
    proposalInfo: {
      key: '',
      eosaccount: 'empty', // TODO verify text or just null!!!
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
