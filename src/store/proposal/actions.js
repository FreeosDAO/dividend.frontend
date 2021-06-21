import { Notify } from 'quasar'
// import { connect } from 'src/utils/smartContractRequest'
import ProtonSDK from '../../utils/proton'
// import notifyAlert from 'src/services/notify-alert'
// import { RpcError } from 'eosjs'

export async function proposalNew ({ state }, data) {
  const { currentAccountName, eosaccount, cap, percentage, threshold, ratesleft, locked } = data // eslint-disable-line
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
      threshold: '100.0000 OPTION', // `${parseFloat(threshold).toFixed(process.env.TOKEN_PRECISION)} ${process.env.TOKEN_TYPE}`,
      rates_left: ratesleft,
      locked: locked
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Proposal submission successful'
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

export async function proposalRemove ({ state }, currentAccountName) {
  const actions = [{
    account: 'freeosdiv', // process.env.APP_NAME,
    name: 'propreset',
    authorization: [{
      actor: currentAccountName,
      permission: 'active'
    }],
    data: {
      proposername: currentAccountName
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Proposal removing successful'
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
  const { currentAccountName, toVote } = data
  console.log(currentAccountName, data)
  const actions = [{
    account: process.env.APP_NAME,
    name: 'proposalvote',
    authorization: [{
      actor: currentAccountName,
      permission: 'active'
    }],
    data: {
      votername: currentAccountName,
      vote: toVote
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Voting Successful'
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
