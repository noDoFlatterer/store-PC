const state = () => ({
  user: {},
})
const getters = {
  getData: (state) => state.user,
}
const mutations = {
  changeUser(state, value) {
    // console.log(value,'vue x的数据');
    state.user = value
    console.log(state.user, '接收到数据')
  },
}
const actions = {}
export default { state, getters, mutations, actions }
