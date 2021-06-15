import notifyAlert from 'src/services/notify-alert'
import { connect } from 'src/utils/smartContractRequest'
import ProtonSDK from '../../utils/proton'

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
  await ProtonSDK.logout()

  // this.$router.push('/')
}
// export async function getLiquidInAccount (state) {
//  const result = await connect({
//    json: true,
//    code: 'eosio.token', // account containing smart contract
//    scope: state.state.accountName, // the subset of the table to query
//    table: 'accounts', // the name of the table
//    limit: -1 // limit on number of rows returned
//  })
//  const val = {
//    key: 'liquidInAccount',
//    value: result.rows[0] || null
//  }
//  state.commit('setClaimAttributeVal', val)
// }

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

// run action query from the blockchain
export async function getActionQuery ({ state }, accountName) {
  function commit (userAfterBalance) {

  }

  try {
    const actions = [{
      account: process.env.APP_NAME,
      name: 'query',
      authorization: [{
        actor: accountName,
        permission: 'active'
      }],
      data: {
        eosaccount: accountName
      }
    }]
    const result = await ProtonSDK.sendTransaction(actions)
    if (result.processed.receipt.status === 'executed') {
      notifyAlert('success', result.processed.action_traces[0].console)
      const resp3After = connect({
        json: true,
        code: process.env.APP_NAME,
        scope: accountName,
        table: 'messages',
        limit: 1
      })
      const userAfterBalance = (resp3After.rows[0].errorno) || 0 // TODO correct
      console.log(userAfterBalance)
      commit('setUserAfterBalance', userAfterBalance)
    } else {
      notifyAlert('err', 'EV01: The action could not be completed.')
    }
    return result
  } catch (e) {
    console.log(e)
    notifyAlert('err', 'Other error: ', e.message)
    if (e.message === 'UnAuthorized') {
      notifyAlert('err', 'EV02: Please check that your wallet contains the correct keys for the account you are trying to register')
    } else if (e.message.startsWith('EV03: assertion failure with message: ')) {
      notifyAlert('err', e.message.split('EV04: assertion failure with message: ')[1])
    } else if (e.message === 'EV05: unrecognized private key type') {
      notifyAlert('err', 'EV06: There is a problem with your private key. Please check your wallet has the correct key(s)')
      // } else if (e instanceof RpcError || e instanceof TypeError) {
      //   notifyAlert('err', 'Connection error. Please try later') // Notify in red
    } else {
      notifyAlert('err', 'EV07: The action could not be completed. Please try later')
    }
  }
}

// retrieve logged user type  - read from message
// export async function getActionQuery (state) {
// const result = await connect({
// json: true,
// code: process.env.APP_NAME,
// scope: process.env.APP_NAME,
// table: 'proposals',
// limit: -1
// })
// const val = {
// key: 'proposalInfo',
// value: result.rows[0]
// }
// state.commit('setProposalAttrVal', val)
// }
