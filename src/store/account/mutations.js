import notifyAlert from 'src/services/notify-alert'

export const setAccount = function (state, { accountName, walletId }) {
  if (!state.accountName) {
    localStorage.walletId = walletId
    state.accountName = accountName
    state.connecting = false
    if (this.$router.currentRoute.fullPath !== state.path) {
      this.$router.push({ path: state.path })
    }
  }
}

export const clearAccount = function (state) {
  localStorage.removeItem('walletId')
  state.accountName = null
  if (this.$router.currentRoute.fullPath !== '/') {
    this.$router.push({ path: '/' })
  }
  notifyAlert(1, 'logout successful')
}

export const setConnecting = (state, connecting) => {
  state.connecting = connecting
}

export const setPath = function (state, pathe) {
  // console.log('pathe1', pathe)
  state.path = pathe
}

// Identify the account name of the proposer and store it
// Identify names of the voters and store it
// Note: This is necessary as records in whitelist table may be in any order
// Ref: line 163 action.js
export const setwhitelistTableAttrVal = function (state, payload) {
  // const attr = payload.key
  const val = payload.value
  if (val[0].idno === 1) { state.proposer = val[0].user }
  if (val[1].idno === 1) { state.proposer = val[1].user }
  if (val[2].idno === 1) { state.proposer = val[2].user }
  console.log('*whitelist proposer*', state.proposer)
  // Identify names of two voters and store it
  if (val[0].idno === 2) { state.voterName1 = val[0].user }
  if (val[1].idno === 2) { state.voterName1 = val[1].user }
  if (val[2].idno === 2) { state.voterName1 = val[2].user }
  console.log('*whitelist voterName1*', state.voterName1)
  if (val[0].idno === 3) { state.voterName2 = val[0].user }
  if (val[1].idno === 3) { state.voterName2 = val[1].user }
  if (val[2].idno === 3) { state.voterName2 = val[2].user }
  console.log('*whitelist voterName2*', state.voterName2)
}

// Serves to close proposer message pop-up dialog for '2nd voter solver'.
export const showModal = function (state) {
  state.isMessage = true
}

// Finding who voted yet for proposal. Used for component switching.
// Ref: account/actions.js line 166.
export const WhitelistAttr = function (state, payload) {
  // const attr = payload.key
  const val = payload.value
  // state.Whitelist[attr] = val // not used for this function
  state.isProposalVoted = false
  for (let i = 0; i < 3; i++) {
    if (val[i].vote !== 0) { // This should happen only once in a whole loop.
      state.isProposalVoted = true // Fact that proposal was voted by someone.
      state.alreadyVoted = val[i].user // Who voted for the proposal.
    }
  }
  console.log('after for', state.isVoted, 'already voted', state.alreadyVoted)
} // keep

// Verification is proposal active, on a basis of the backend proposal data.
// This run with interval setup by MainLayout.
// export const verifyProposalStatus = function (state, payload) { TODO remove ??
// } TODO remove ??
// isProposalActive must be caught at the beginning in Proposal and Vue
// pages to determine initial way of processing. Use getter.

// Places active proposal data from backend to state.
export const setProposalAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  // console.log('proposal', val) // test
  state.proposalInfo[attr] = val
  const formattedPercentage = val.proposal_percentage
  let percentage = parseFloat(formattedPercentage)
  percentage = percentage.toFixed(2)
  state.proposalInfo.proposalInfo.proposal_percentage = percentage // Vuex store keeps formatted percentage value.
  // console.log('proposal percentage %%', percentage) // test
  // Compare with current time to know the proposal status.
  // If it is in valid time frame means active.
  const expires = (val.expires_at * 1000) // normalize UTC formats
  const timestamp = Date.now()
  console.log('timer', timestamp, expires, 'difference', (expires - timestamp))
  if (timestamp < expires) {
    state.isProposalActive = true // active proposal exists
    // TODO count minutes and seconds
    // state.timer = ((expires - timestamp) / 60000).toFixed(2)
    const minutes = Math.floor((expires - timestamp) / 60000)
    state.timer = minutes
    console.log('timer in mutations', minutes)
  } else { // timestamp >= expires
    state.isProposalActive = false // NO active proposal
    state.timer = 0
  }
}
