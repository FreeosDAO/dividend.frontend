// import notifyAlert from 'src/services/notify-alert'

export const setEwsTableAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  state.circInfo = val[0].bycategory + val[1].bycategory + val[2].bycategory
  console.log('payload', val[2].bycategory) // test
  state.EwsInfo[attr] = val
}

export const setValue = function (state, circularValue) {
  state.circInfo = circularValue
  console.log(circularValue)
}
