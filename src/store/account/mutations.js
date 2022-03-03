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

// // This function serves "2nd voter solver" exclusively. - not used anymore
// // Second voter is someone who not voted yet so still may reject the proposal.
// // === Do not use for other purposes. ===
// export const setWhitelistAttrVal = function (state, payload) {
//  const attr = payload.key
//  const val = payload.value
//  state.Whitelist[attr] = val // not used
//  // console.log('valvote0', val[0].user)
//  // console.log('valvote1', val[1].user)
//  // console.log('valvote2', val[2].user)
//  for (let i = 0; i < 3; i++) {
//    if (val[i].vote !== 0) { // Find who voted for proposal
//      // everything what i need to identify the situation:
//      // Note that rows of whitelist table are in random order
//      // and idno number decide on person function.
//      state.isVoted = true
//      state.firstVoterName = val[i].user
//      if (val[i].idno === 2) { // find idno = 3
//        for (let k = 0; k < 3; k++) {
//          if (val[k].idno === 3) {
//            state.secondVoterName = val[k].user
//          }
//        }
//      } else {
//        for (let k = 0; k < 3; k++) {
//          if (val[k].idno === 2) {
//            state.secondVoterName = val[k].user
//          }
//        }
//      }
//    }
//    console.log('i=', i, 'val.idno=', val[i].idno)
//  }
//  // state.secondVoterName = 'the other one' // Give account of not voting voter  }
//  console.log('after for', state.isVoted,
//    ' 1st:', state.firstVoterName, ' 2nd:', state.secondVoterName)
// }

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
}

// Identify the account name of the proposer and store it
// Compare proposer account with current account - store the result
// Note: This is used for other purposes than "second voter problem"
// Do not touch anyway.
export const setwhitelistTableAttrVal = function (state, payload) {
  // const attr = payload.key
  const val = payload.value
  if (val[0].idno === 1) { state.proposer = val[0].user }
  if (val[1].idno === 1) { state.proposer = val[1].user }
  if (val[2].idno === 1) { state.proposer = val[2].user }
  console.log('*whitelist proposer*', state.proposer)
}

// Serves to close proposer message pop-up dialog for '2nd voter solver'.
export const showModal = function (state) {
  state.isMessage = true
}

// 2nd voter solver - not used anymore
// This should be called from action which clean up message trigger in divpropdel
// export const hideModal = function (state) { // used by '2nd vote solver'
//  state.isSecondVoter = false
// }
//
// export const setPostBoxDataVal = function (state, payload) { // '2nd voter solver' only. Set-up postbox.
//  const val = payload.value
//  console.log('postBox', val[0].eosaccount) // test
//  const extaccount = val[0].eosaccount
//  if (extaccount === state.accountName) {
//    state.isSecondVoter = true // this is only set-up if current voter should receive message,
//  } else { state.isSecondVoter = false }// ... current voter is this who not voted yet.
//
// }

// Finding who voted yet for proposal. Used for block voting if user already voted.
export const WhitelistAttr = function (state, payload) {
  // const attr = payload.key
  const val = payload.value
  // state.Whitelist[attr] = val // not used for this function
  state.isProposalVoted = false
  for (let i = 0; i < 3; i++) {
    if (val[i].vote !== 0) { // This should happen only once in a whole loop.
      state.isProposalVoted = true
      state.alreadyVoted = val[i].user // Find who voted for proposal
    }
  }
  console.log('after for', state.isVoted, 'already voted', state.alreadyVoted)
}
