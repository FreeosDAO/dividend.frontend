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
  // TODO Need to be cleared more. Especoally menulist. Enforce reload.
  // this.$router.push('/')
  this.$router.go(1) // Enforce page reload.
  await ProtonSDK.logout()
}

export function getInfo (state) { // todo why is this used? rationale?
  state.dispatch('getActionProposal')
}

export const setpath = function ({ commit }, pathe) {
  console.log(this.$route.fullPath)
  console.log('whatever', pathe)
  commit('setPath', pathe)
  // this.$router.push('/')
}

// run action query from the blockchain
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
  state.commit('setwhitelistTableAttrVal', val) // Ref. line 49 mutations.js
  this.value = val
}

//
// retrieve whitelist to find it was voted (for screen functions)
// TODO Note: Where is call for it? Line 148 in MainLayout.
export async function refreshWhitelist (state) {
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
  state.commit('WhitelistAttr', val) // (Ref. see mutations line 60)
}

// retrieve current proposal info from the backend
// (covers former verifyProposalStatus)
// verify is proposal active or not, give back result in isProposalActive
// used by the Proposal.vue and Vote.vue for initial assessment when
// initial entry to any of these pages.
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
  state.commit('setProposalAttrVal', val) // Ref: mutations.js line:
  console.log('getActionProposal - inside actions.js')
}
