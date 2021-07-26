// import notifyAlert from 'src/services/notify-alert'

export const setEwsTableAttrVal = function (state, payload) {
  const attr = payload.key
  const val = payload.value
  const numb = (Number(val[0].bycategory) + Number(val[1].bycategory) + Number(val[2].bycategory)) / 100
  console.log('payload', numb) // test
  state.circInfo = numb
  state.EwsInfo[attr] = val
}

// export const setValue = function (state, circularValue) { TODO eventually remove
// state.circInfo = circularValue
// console.log(circularValue)
// }

export const setDryTableAttrVal = function (state, payload) {
  // const attr = payload.key
  const val = payload.value
  console.log('DRYTABLE=', JSON.stringify(val)) // test
  console.log(val)
  state.NftList = val
}

export const setCount = function (state, count) {
  state.count = count
}

export const updateLoading = function (state, loading) {
  const { progress1, progress2, progressLabel1, progressLabel2 } = loading
  state.progress1 = progress1
  state.progress2 = progress2
  state.progressLabel1 = progressLabel1
  state.progressLabel2 = progressLabel2
}
