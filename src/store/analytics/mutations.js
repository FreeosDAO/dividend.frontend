// import notifyAlert from 'src/services/notify-alert'

export const setEwsTableAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  console.log(val) // test
  state.EwsInfo[attr] = val
}
