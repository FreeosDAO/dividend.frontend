import { connect } from 'src/utils/smartContractRequest'
// import ProtonSDK from 'src/utils/proton'
// import { Notify } from 'quasar'
// import notifyAlert from 'src/services/notify-alert'
// import { RpcError } from 'eosjs'

// retrieve all NFTs info
export async function getNftTable (state) {
  const result = await connect({
    json: true,
    code: process.env.APP_NAME,
    scope: process.env.APP_NAME,
    table: 'nfts'
    // limit: 3
  })
  const val = {
    key: 'Nft_Data',
    value: result.rows
  }
  state.commit('setNftTableAttrVal', val)
  state.commit('setCount', result.rows.length)
}

export async function ChangeNftUserAction ({ state }, AccountName) {
  /*
  const actions = [{
    account: process.env.APP_NAME, // freeosdiv
    name: '', // TODO
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
  } */
}
