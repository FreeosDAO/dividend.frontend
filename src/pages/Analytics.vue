<template xmlns:justify-content="http://www.w3.org/1999/xhtml">
<div>
  <q-card class="q-pa-md" style="background: #1C2D39;">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card
        class="my-card text-white"
        style="background: #1C2D39;"
        >
        <q-card-section
          class="my-card text-white"
          style="background: #1C2D39;"
        >
          <div id="nav" class="text-h6 text-center q-ma-lg"> <img id="icon" width="65" src="~assets/decentralised.jpg"><span id="text">&nbsp; Dividend Analytics</span></div>
          <q-btn class="q-ma-lg" color="blue" rounded no-caps @click="submit()" label="Data Update">
            <q-tooltip anchor="top middle" round self="bottom middle" :offset="[10, 10]">
              <strong>Updates dryrun data. <br> Require transaction acceptance</strong>
            </q-tooltip>
          </q-btn>
          <div class="container">
            <div class="child">
          <pure-vue-chart
              :points="[Number(category1).toLocaleString(),Number(category2).toLocaleString(),Number(category3).toLocaleString()]"
              :width="400"
              :height="200"
              :show-values="true"
            />
            </div>
          </div>
          <q-breadcrumbs separator="--" align="center" class="white" active-color="white">
            <q-breadcrumbs-el class="text-blue" label="WayFinder"></q-breadcrumbs-el>
            <q-breadcrumbs-el class="text-red" label="WayFarer"></q-breadcrumbs-el>
            <q-breadcrumbs-el class="text-green" label="WayFounder"></q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-card-section>
        <div id="q-app" style="min-height: 100vh;">
          <div class="q-pa-md">
            <q-linear-progress size="25px" :value="progress1" color="accent">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="accent" :label="progressLabel1"></q-badge>
              </div>
            </q-linear-progress>

            <q-linear-progress size="25px" :value="progress2" color="accent" class="q-mt-sm">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="accent" :label="progressLabel2"></q-badge>
              </div>
            </q-linear-progress>
          </div>
          <q-table
            title="NFTs Summary by Owner "
            :data="this.byuser"
            :columns="columns"
            row-key="name"
            :pagination.sync="pagination"
          ></q-table>
        </div>
      </q-card>
    </div>
  </q-card>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PureVueChart from 'pure-vue-chart'
export default {
  name: 'Analytics',
  components: {
    PureVueChart
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 30 // current rows per page being displayed
      },
      tab: 'send',
      isProposerActive: false,
      working: '',
      dataload: {
        progress1: 0.0,
        progress2: 0.0,
        progressLabel1: '',
        progressLabel2: ''
      },
      value1: null,
      columns: [
        {
          name: 'user',
          align: 'center',
          label: 'Account Name',
          field: 'user',
          sortable: true
        },
        {
          name: 'byusertotal',
          label: 'Total %',
          format: (val) => `${parseFloat(val)}%`,
          sort: (a, b) => parseFloat(a) - parseFloat(b),
          field: 'byusertotal',
          sortable: true
        }],
      category: []
    }
  },
  created () {
    this.isProposer()
  },
  // mounted () {
  // this.getEwsTable()
  //   this.submit()
  // },
  methods: {
    ...mapActions('analytics', ['getDryrunAction', 'getByUserTotal']),
    ...mapActions('analytics', ['getEwsTable', 'updateLoading']),
    ...mapActions('account', ['logout']),
    isProposer () {
      if (this.accountName === this.proposer) {
        this.isProposerActive = true
        console.log(' isProposer:', this.accountName, this.proposer, this.isProposerActive)
      }
    },
    submit () {
      const self = this
      this.getDryrunAction(self.accountName) // value is counted here from categories
      this.getEwsTable()
      this.getByUserTotal()
      // Count current bar values
      console.log('value circInfo', this.value)
      this.dataload.progress1 = this.value
      this.dataload.progress2 = (1.00 - this.value)
      this.working = this.value * 100
      this.dataload.progressLabel1 = String(this.working.toFixed(2)) + '%'
      // this.progressLabel1 = String(this.value * 100) + '% - to Investors'
      this.dataload.progressLabel2 = String(100 - this.working) + '%'
      // this.progressLabel2 = String(100 - (this.value * 100)) + '% - to DAO'
      console.log('values=', this.progress1, this.progress2)
      // Store counted bar values to Vuex:
      // this.dataload.progress1 = this.progress1
      // this.dataload.progress2 = this.progress2
      // this.dataload.progressLabel1 = this.progressLabel1
      // this.dataload.progressLabel2 = this.progressLabel2
      this.updateLoading(this.dataload) // Packs all above to Vuex (update on button request)
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category1: state => state.analytics.EwsInfo.EwsData[0].bycategory,
      category2: state => state.analytics.EwsInfo.EwsData[1].bycategory,
      category3: state => state.analytics.EwsInfo.EwsData[2].bycategory,
      // From Vuex to Display
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      value: state => state.analytics.circInfo, // value is read from Vuex
      byuser: state => state.analytics.NftList,
      proposer: state => state.account.proposer
    })
    // dryrun () {
    // this.submit()
    // }
  }
}
</script>
<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
