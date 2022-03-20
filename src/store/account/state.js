export default () => ({ // Data Dictionary
  isVoted: false, // todo ?? remove?
  isProposalActive: '', // Indicator of Active Proposal (Bool)
  // Used by Proposal and Vote pages as
  // primary indicator controlling a whole page.
  //
  // The drawer menu is based on these data.
  // It is setup by the action
  Whitelist: {
    whitelistInfo: [
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 }
    ]
  },
  // In: Vote.vue
  alreadyVoted: '', // (alreadyVotedName) Name who already voted.
  isProposalVoted: false, // Proposal was already voted by one voter. todo remove ??
  voterName1: '', // Voter names taken from the whitelist table. todo remove ??
  voterName2: '', // ... todo remove ??
  // ===
  accountName: null, // used by Wallet
  //
  connecting: false,
  timer: 0, // active proposal timer for Proposal and Vote pages. todo remove ??
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
      eosaccount: '',
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
