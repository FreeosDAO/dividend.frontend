<template>
<div>
  <q-card class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 80%)">
    <q-card-section
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 80%)"
      >
      <div class="text-h6 text-center q-ma-lg">User Access </div>
      <q-btn class="q-ma-lg" color="secondary" no-caps @click="submit()" label="Read NFT List"/>
      <div id="q-app">
        <div class="q-pa-md">
          <q-table
            title="NFT List"
            :data="this.category"
            :columns="columns"
            row-key="name"
          ></q-table>
        </div>
        <!-- traditional table -->
        <div id="app">
          <h2>Users:</h2>
          <table>
            <thead>
            <tr>
              <th>name</th>
              <th>price</th>
            </tr>
            </thead>
            <tbody> <!--
            <tr v-for="(item, index) in orderProducts" :key="this.category.nft_key">
              <td>{{item.eosaccount}}</td>
              <td>{{item.locked}}</td>
            </tr> -->
            </tbody>
          </table>
        </div>
        <div>{{category}}/{{count}}</div>
        <!-- -->
      </div>
    </q-card-section>
    </div>
  </q-card>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import { connect } from 'src/utils/smartContractRequest'

export default {
  name: 'Customer',
  data () {
    return {
      columns: [
        {
          name: 'nft_key',
          align: 'center',
          label: 'NFT key',
          field: 'nft_key',
          sortable: true
        },
        {
          name: 'eosaccount',
          label: 'EOS account',
          field: 'eosaccount',
          sortable: true
        },
        {
          name: 'roi_target_cap',
          label: 'ROI Target Cap',
          field: 'roi_target_cap'
        },
        {
          name: 'nft_percentage',
          label: 'NFT Percentage',
          field: 'nft_percentage'
        },
        {
          name: 'mint_date',
          label: 'Mint Date',
          field: 'mint_date'
        },
        {
          name: 'locked',
          label: 'Locked',
          field: 'locked',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'threshold',
          label: 'Threshold',
          field: 'threshold',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'rates_left',
          label: 'Rates Left',
          field: 'rates_left',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'accrued',
          label: 'Accrued',
          field: 'accrued',
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      tab: 'send',
      users: [],
      loading: false,
      setIntervalId: null
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      // category: state => state.user.NftInfo.NftData
      category: state => state.user.NftList,
      count: state => state.user.count
    }),
    orderProducts () {
      // return this.state.user.NftList
      return this.$store.state.NftList
    }
  },
  methods: {
    ...mapActions('user', ['ChangeNftUserAction']),
    ...mapActions('user', ['getNftTable']),
    submit () {
      this.getNftTable()
      // .then(response => {
      // this.isDryRunfresh = true
      // })
    }
  }
}
</script>
<style scoped>
table {
  $border: 1px solid #eee;
  border: $border;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
td {
  padding: 5px;
  border: $border;
}
}

</style>
