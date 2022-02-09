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

// This function serves "second voter problem" only
// Do not use for other purposes.
export const setWhitelistAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  state.Whitelist[attr] = val // not used
  // console.log('valvote0', val[0].user)
  // console.log('valvote1', val[1].user)
  // console.log('valvote2', val[2].user)
  for (let i = 0; i < 3; i++) {
    if (val[i].vote !== 0) { // Find who voted for proposal
      // everything what i need to identify the situation:
      // Note that rows of whitelist table are in random order
      // and idno number decide on person function.
      state.isVoted = true
      state.firstVoterName = val[i].user
      if (val[i].idno === 2) { // find idno = 3
        for (let k = 0; k < 3; k++) {
          if (val[k].idno === 3) {
            state.secondVoterName = val[k].user
          }
        }
      } else {
        for (let k = 0; k < 3; k++) {
          if (val[k].idno === 2) {
            state.secondVoterName = val[k].user
          }
        }
      }
    }
    console.log('i=', i, 'val.idno=', val[i].idno)
  }
  // state.secondVoterName = 'the other one' // Give account of not voting voter  }
  console.log('after for', state.isVoted,
    ' 1st:', state.firstVoterName, ' 2nd:', state.secondVoterName)
}

export const setProposalAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  console.log(val) // test
  state.proposalInfo[attr] = val
}

// export const setUserAfterBalance = (state, balance) => { TODO eventually remove
// state.userAfterBalance = balance
// }

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

export const hideModal = function (state) { // used by '2nd vote solver'
  state.isMessage = false
}

export const setPostBoxDataVal = function (state, payload) {
  const val = payload.value
  console.log('postBox', val[0].eosaccount) // test
  const extaccount = val[0].eosaccount
  // todo setup isSecondVoter here if the secondVoter from a table === currentAccountName
  // todo isSecondVoter = true
  if (extaccount === state.accountName) {
    state.isSecondVoter = true
  } else { state.isSecondVoter = false }
  //
}
