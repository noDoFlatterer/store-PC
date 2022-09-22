const state = () => ({
  user: {
    category: '', // 种类
    goods_name: '', //名称
    introduce: '', //介绍
    original_price: '', //原价
    price: '', //售价
    count: '', // 库存
    tag: '', //标签
    status: '', // 上架状态
    image: '', //主图
    detail_goods: '', //详细信息
    goods_id: '', //商品id
  },
})
const getters = {
  getData: (state) => state.user,
}
const mutations = {
  changeUser(state, value) {
    state.user.category = value.category
    state.user.goods_name = value.goods_name
    state.user.introduce = value.introduce
    state.user.original_price = value.original_price
    state.user.price = value.price
    state.user.count = value.count
    state.user.tag = value.tag
    state.user.status = value.status
    state.user.image = value.image
    state.user.detail_goods = value.detail_goods
    state.user.goods_id = value.goods_id

    console.log(state.user, '接收到数据')
  },
}
const actions = {}
export default { state, getters, mutations, actions }
