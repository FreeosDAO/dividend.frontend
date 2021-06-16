import { Notify } from 'quasar'
import ProtonSDK from '../../utils/proton'
import notifyAlert from 'src/services/notify-alert'
import { RpcError } from 'eosjs'

export async function proposalNew ({ state }, data) {
  const { currentAccountName, eosaccount, cap, percentage, threshold, ratesleft, locked } = data
  const actions = [{
    account: 'freeosdiv', // process.env.APP_NAME,
    name: 'proposalnew',
    authorization: [{
      actor: currentAccountName,
      permission: 'active'
    }],
    data: {
      proposername: currentAccountName,
      eosaccount: eosaccount,
      roi_target_cap: cap,
      period_percentage: percentage,
      threshold: threshold, // `${parseFloat(threshold).toFixed(process.env.TOKEN_PRECISION)} ${tokenType}`,
      rates_left: ratesleft,
      locked: locked
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Proposal submission successfull'
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

export async function onVersion ({ state }, accountName) { // function not used
  try {
    const actions = [{
      account: process.env.APP_NAME,
      name: 'sendversion',
      authorization: [{
        actor: accountName,
        permission: 'active'
      }],
      data: {}
    }]
    const result = await ProtonSDK.sendTransaction(actions)
    return result
  } catch (e) {
    console.log(e)
  }
}

export async function actionProposalVote ({ state }, data) {
  try {
    const { castvote, accountName } = data
    const actions = [{
      account: 'freeosdiv',
      name: 'proposalvote',
      authorization: [{
        actor: accountName,
        permission: 'active'
      }],
      data: {
        votername: accountName,
        vote: castvote
      }
    }]

    const result = await ProtonSDK.sendTransaction(actions)
    if (result.processed.receipt.status === 'executed') {
      notifyAlert('success', result.processed.action_traces[0].console + 'success')
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
    return result
  } catch (e) {
    if (e.message.startsWith("proposal already expired'")) {
      notifyAlert('err', 'The Proposal already expired')
    } else if (e.message === 'UnAuthorized') {
      notifyAlert('err', 'Please check that your wallet contains the correct keys for the account you are trying to register')
    } else if (e.message.startsWith('assertion failure with message: ')) {
      notifyAlert('err', e.message.split('assertion failure with message: ')[1])
    } else if (e.message === 'unrecognized private key type') {
      notifyAlert('err', 'There is a problem with your private key. Please check your wallet has the correct key(s)')
    } else if (e instanceof RpcError || e instanceof TypeError) {
      notifyAlert('err', 'Connection error. Please try later')
    } else {
      notifyAlert('err', 'The action could not be completed. Please try later')
    }
  }
}
/*
export async function actionProposalVote ({ state }, fromVoterName, toVote) {
  const actions = [{
    account: process.env.APP_NAME,
    name: 'proposalvote',
    authorization: [{
      actor: fromVoterName,
      permission: 'active'
    }],
    data: {
      votername: fromVoterName,
      vote: toVote
    }
  }]
  console.log(fromVoterName, toVote)
  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      // responseMessage = 'Vote Successfull'
    }
    Notify.create({
      message: result, // responseMessage,
      color: 'positive'
    })
    return result
  } catch (e) {
    return e
  }
}
*/
