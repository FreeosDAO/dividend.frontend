<template>
<div>
  <q-card class="q-pa-md" style="background: #1C2D39;">
    <div class="q-gutter-y-md q-mx-auto" style="background: #1C2D39;">
    <q-card-section
      class="my-card text-white"
      style="background: #1C2D39;"
      >
      <div id="nav" class="text-h6 text-center q-ma-lg"> <img id="icon" width="65" src="~assets/decentralised.jpg">
        <span id="text">&nbsp; NFT Summary by Owner</span></div>
      <!-- <q-btn class="q-ma-lg" color="secondary" no-caps @click="submit()" label="Refresh"/> -->
      <div id="q-a">
        <div class="q-pa-md">
          <q-btn icon="link" label="Change NFT Ownership" color="primary" @click="dialog = true"></q-btn>
          <q-dialog v-model="dialog">
            <q-card>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">Change NFT Ownership</div>
                <q-space></q-space>
                <q-btn icon="close" flat round dense v-close-popup></q-btn>
              </q-card-section>
              <q-card-section class="row items-center q-gutter-sm">
                <!--   -->
                <!-- eosaccount section -->
                <!-- <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                  <div class="col-xs-5 col-sm-4 text-right">
                    Old Owner Account
                  </div>
                  <div class="col-xs-1 col-sm-2"></div>
                  <div class="col-xs-6 col-sm-6">
                    <q-input
                      v-model="submitData.currentAccountName"
                      type="text"
                      outlined
                      dense
                    />
                  </div>
                </div> -->
                <!-- eosaccount section -->
                <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                  <div class="col-xs-5 col-sm-4 text-right">
                    New Owner Account
                  </div>
                  <div class="col-xs-1 col-sm-2"></div>
                  <div class="col-xs-6 col-sm-6">
                    <q-input
                      v-model="submitData.targetAccountName"
                      type="text"
                      outlined
                      dense
                    />
                  </div>
                </div>
                <!-- rates_left conditional section -->
                  <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                    <div class="col-xs-5 col-sm-4 text-right">
                      Key of NFT to transfer
                    </div>
                    <div class="col-xs-1 col-sm-2"></div>
                    <div class="col-xs-6 col-sm-6">
                      <q-input
                        v-model="submitData.nftKey"
                        type="number"
                        outlined
                        dense
                      />
                    </div>
                </div>
                <!--   -->
                <div>
                  <q-btn class="q-ma-lg" color="orange" no-caps @click="submit()" label="Make Change" :disable="!isFormFilled"/>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
      <div id="q-pp">
        <div class="q-pa-md">
          <div id="q-app" style="min-height: 100vh;">
            <div class="q-pa-md">
              <div class="q-pa-md">
                <q-table
                  title="NFT Summary by Owner"
                  :data="this.category"
                  :table-style="{ backgroundColor: '#101c28' }"
                  :columns="columns"
                  row-key="name"
                  :pagination.sync="pagination"
                >      <template v-slot:body-cell-roi_target_cap="props">
                  <q-td :props="props">
                    <div>
                      <q-badge v-if="props.value==2" color="purple" :label="props.value"></q-badge>
                      <q-badge v-else-if="props.value==3" color="green" :label="props.value"></q-badge>
                      <q-badge v-else color="blue" :label="props.value"></q-badge>
                    </div>
                    <div class="my-table-details">
                      {{ props.row.details }}
                    </div>
                  </q-td>
                </template></q-table>
            </div>
          </div>
        </div>
      </div>
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
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
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
          label: 'Account',
          field: 'eosaccount',
          sortable: true
        },
        {
          name: 'roi_target_cap',
          label: 'ROI Cap',
          field: 'roi_target_cap',
          sortable: true
        },
        {
          name: 'nft_percentage',
          label: 'NFT Percentage',
          field: 'nft_percentage',
          format: (val) => `${parseFloat(val)}%`,
          sortable: true
        },
        {
          name: 'mint_date',
          label: 'Mint Date',
          field: 'mint_date',
          sortable: true
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
          label: 'Iterations Left',
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
      users: [], // ??
      loading: false,
      setIntervalId: null,
      dialog: false,
      submitData: {
        currentAccountName: '',
        targetAccountName: '',
        nftKey: ''
      }
    }
  },
  created () {
    this.getNftTable()
    this.setIntervalId = setInterval(() => {
      this.getNftTable()
    }, 60000) // call each 60 seconds
    document.addEventListener('beforeunload', this.handler)
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category: state => state.user.NftList,
      count: state => state.user.count
    }),
    isFormFilled () {
      let a = false
      a = ((this.submitData.targetAccountName) && (this.submitData.nftKey))
      return a
    }
  },
  methods: {
    ...mapActions('user', ['actionOwnerChange', 'getNftTable']),
    submit () {
      const self = this
      this.submitData.currentAccountName = this.accountName
      console.log(this.submitData.currentAccountName)
      this.actionOwnerChange(this.submitData)
        .then(response => {
          // self.getAccountInfo()
          self.resetForm()
          this.getNftTable() // refresh table after operation
        })
    },
    resetForm () {
      this.submitData = {
        currentAccountName: '',
        targetAccountName: null,
        nftKey: ''
      }
    }
  }
}
</script>
<style scoped>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>
