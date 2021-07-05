import { Notify } from 'quasar'
import ProtonSDK from '../../utils/proton'
import { connect } from 'src/utils/smartContractRequest'
// import notifyAlert from 'src/services/notify-alert'
// import { RpcError } from 'eosjs'

export async function getDryrunAction ({ state }, AccountName) {
  const actions = [{
    account: process.env.APP_NAME, // freeosdiv
    name: 'dryrun',
    authorization: [{
      actor: AccountName,
      permission: 'active'
    }],
    data: {
      proposername: AccountName
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Dry Run Successful'
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

export async function actionDividendCompute ({ state }, AccountName) {
  const actions = [{
    account: process.env.APP_NAME, // freeosdiv
    name: 'dividcompute',
    authorization: [{
      actor: AccountName,
      permission: 'active'
    }],
    data: {
    }
  }]

  try {
    const result = await ProtonSDK.sendTransaction(actions)
    let responseMessage = result.processed.action_traces[0].console
    if (!responseMessage) {
      responseMessage = 'Dividend Compute Successful'
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

// retrieve current proposal info
export async function getEwsTable (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'ewstables',
    limit: 3
  })
  const val = {
    key: 'EwsData',
    value: result.rows
  }
  state.commit('setEwsTableAttrVal', val)
}

// export const setInfo = function ({ commit }, cInfo) {
// commit('setValue', cInfo)
// }

// retrieve dryrub info by user
export async function getByUserTotal (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'dryruns',
    limit: 200
  })
  const val = {
    key: 'Dry_Data',
    value: result.rows
  }
  state.commit('setDryTableAttrVal', val)
  state.commit('setCount', result.rows.length)
}

export function updateLoading (state, load) {
  state.commit('updateLoading', load)
}
