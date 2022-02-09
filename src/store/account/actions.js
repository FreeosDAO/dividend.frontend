import notifyAlert from 'src/services/notify-alert'
import { connect } from 'src/utils/smartContractRequest'
import ProtonSDK from '../../utils/proton'
import { Notify } from 'quasar'

export async function checkIfLoggedIn (state) {
  const { auth } = await ProtonSDK.restoreSession()
  if (auth && auth.actor && auth.permission) {
    state.commit('setAccount', {
      accountName: auth.actor,
      walletId: ProtonSDK.link.walletType
    })
  }
}

export function connectWallet (state, name) {
  // if (name === 'scatter') {
  //   state.dispatch('connectScatter', 'scatter')
  // } else if (name === 'anchor') {
  state.dispatch('connectProton', name)
  // }
}

/**
 * Connect to a wallet
 * Don't use arrow function here to have access to Vue prototype (this.$...)
 *
 * @param commit
 * @param walletId
 * @returns {Promise<void>}
 */
export const connectScatter = async function ({ commit }, walletId) {
  commit('setConnecting', true)
  const wallet = this.$transit.accessContext.initWallet(this.$transit.accessContext.getWalletProviders().find(r => r.id === walletId))
  wallet.subscribe(walletState => {
    let message
    let messageStatus = 1
    if (walletState.connecting) {
      message = `Connecting to ${walletId}`
    } else if (walletState.authenticating) {
      message = `Logging in to ${walletId}`
    } else if (walletState.authenticationError) {
      message = walletState.authenticationErrorMessage
      messageStatus = 0
    } else if (walletState.connectionError) {
      message = walletState.connectionErrorMessage
      messageStatus = 0
    } else if (walletState.accountInfo) {
      if (!this.$transit.wallet || !this.$transit.wallet.accountInfo) {
        message = 'login successfully'
        commit('setAccount', {
          accountName: walletState.accountInfo.account_name,
          walletId
        })
      }
    }
    if (message) {
      // You can add some snackbar message here
      // console.log(message)
      notifyAlert(messageStatus, message)
    }
  })
  await wallet.connect()
  await wallet.login()
  this.$transit.wallet = wallet
  this.$transit.eosApi = wallet.eosApi
}

export async function connectProton (state, name) {
  try {
    // this.setState({ isLoggingIn: true })
    const { auth } = await ProtonSDK.login()
    if (auth && auth.actor && auth.permission) {
      state.commit('setAccount', {
        accountName: auth.actor,
        walletId: ProtonSDK.link.walletType
      })
      // setLoggedInState(auth.actor, auth.permission, accountData)
    }
    // this.setState({ isLoggingIn: false })
  } catch (e) {
    console.error(e)
  }
}

export const logout = async function ({ commit }) {
  commit('clearAccount', null)
  // this.$router.push('/')
  await ProtonSDK.logout()
}

export function getInfo (state) {
  state.dispatch('getActionProposal')
}

// retrieve current proposal info
export async function getActionProposal (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'proposals',
    limit: -1
  })
  const val = {
    key: 'proposalInfo',
    value: result.rows[0]
  }
  state.commit('setProposalAttrVal', val)
}

export const setpath = function ({ commit }, pathe) {
  console.log(this.$route.fullPath)
  console.log('whatever', pathe)
  commit('setPath', pathe)
  // this.$router.push('/')
}

// run action query from the blockchain TODO replace whole function
export async function getVersionQuery ({ state }, accountName) {
  const actions = [{
    account: process.env.APP_NAME,
    name: 'version',
    authorization: [{
      actor: accountName,
      permission: 'active'
    }],
    data: {
      eosaccount: accountName
    }
  }]
  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Version identified'
    }
    Notify.create({
      message: responseMessage,
      color: 'positive'
    })
    return result
  } catch (e) {
    console.log(e)
    return e
  }
}

// retrieve whitelist
// retrieve ews info
export async function getwhitelistTable (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'whitelist',
    limit: 3
  })
  const val = {
    // key: accountName,
    value: result.rows
  }
  state.commit('setwhitelistTableAttrVal', val)
}

// Used by '2nd vote solver'
// === Ref: Called by push2Vote line 345 in proposal.vue
export async function callDividendVote ({ state }, currentAccountName) {
  // currentAccountName at this moment should be second voter name what we want
  console.log(' ----- call remotely the dividend negative vote === ', currentAccountName)
  try {
    const actions = [{
      account: 'divpropdel', // process.env.DIVPROPDEL_APP,
      name: 'div2ndvote',
      authorization: [{
        actor: currentAccountName,
        permission: 'active'
      }],
      data: {
        voter: currentAccountName
        // Rejecting vote is already hard wired in divpropdel contract.
      }
    }]
    const result = await ProtonSDK.sendTransaction(actions)
    return result
  } catch (e) {
    console.log(e)
  }
}

// Used by '2nd vote solver'
// === Ref: Called by push2Vote line 345 in proposal.vue
export async function reqVoterAct ({ state }, data) {
  const { currentAccountName, secondVoterName } = data
  console.log(' ----- request 2nd voter action ----- ', data)
  try {
    const actions = [{
      account: 'divpropdel', // lprocess.env.DIVPROPDEL_APP, // 'divpropdel',
      name: 'dropmessage',
      authorization: [{
        actor: currentAccountName,
        permission: 'active'
      }],
      data: {
        proposer: currentAccountName,
        second_voter: secondVoterName
      }
    }]
    const result = await ProtonSDK.sendTransaction(actions)
    return result
  } catch (e) {
    console.log(e)
  }
}

// TODO readPostBox()
// read the table from backend contract divpropdel. If name of current
// voter is equal to the name in the table, the pop-up box with the message will be opened.
// === g e t S y s t e m T a b l e ===
// Where called: MainLayout.vue
export async function readPostBox (state) {
  const result = await connect({
    json: true,
    code: 'divpropdel',
    scope: 'divpropdel',
    table: 'postboxs',
    limit: 1
  })
  const val = {
    key: 'postBoxData',
    value: result.rows
  }
  console.log('postBoxData', JSON.stringify(val))
  state.commit('setPostBoxDataVal', val)
}

// TODO Action getVoteStatus for use with solution of "2nd voter solver"
// retrieve current proposal info
export async function getVoteStatus (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'whitelist',
    limit: 3
  })
  const val = {
    key: 'whitelistInfo',
    value: result.rows
  }
  console.log('WhitelistAttrVal', JSON.stringify(val))
  state.commit('setWhitelistAttrVal', val)
}
// TODO
