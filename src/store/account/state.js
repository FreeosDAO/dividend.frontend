export default () => ({ // Data Dictionary
  isVoted: false, // todo ?? remove?
  isProposalActive: '', // Indicator of Active Proposal resides in backend. Used by Proposal and Vote pages as
  // primary indicator controlling a whole page. Note: 'proposalActiveHere' is used locally for both pages.
  // used for initial recognition of the user (proposer, voter, other?). The drawer menu is based on these data
  Whitelist: {
    whitelistInfo: [
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 },
      { idno: 1, user: '', vote: 0 }
    ]
  },
  // In: Vote.vue
  alreadyVoted: '', // Name who already voted. todo refactor to whoAlreadyVoted
  isProposalVoted: false, // Proposal was already voted by one voter.
  voterName1: '', // Voter names taken from the whitelist table.
  voterName2: '', // ...
  // ===
  accountName: null, // used by Wallet
  //
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
      eosaccount: 'empty', // TODO verify text or just null!!! Should be ''.
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
