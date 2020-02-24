import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.use(VueApollo)

export default new VueApollo({
    defaultClient: new ApolloClient({
        // You should use an absolute URL here
        uri: 'https://api.thegraph.com/subgraphs/name/blockrockettech/erc20-airdropper'
    }),
})
