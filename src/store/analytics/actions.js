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
      responseMessage = 'Dry Run Successfull'
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
