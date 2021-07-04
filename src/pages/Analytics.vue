<template xmlns:justify-content="http://www.w3.org/1999/xhtml">
<div>
  <q-card class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 80%)"
        >
        <q-card-section
          class="my-card text-white"
          style="background: radial-gradient(circle, #35a2ff 0%, #014a88 80%)"
        >
          <div id="nav" class="text-h6 text-center q-ma-lg"> <img id="icon" width="65" src="~assets/decentralised.jpg">
            <span id="text">&nbsp; Dividend Analytics</span></div>
            <q-btn class="q-ma-lg" color="blue" no-caps @click="submit()" label="Perform Dry Run"/>
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
            <q-breadcrumbs-el label="WayFinder"></q-breadcrumbs-el>
            <q-breadcrumbs-el label="WayFarer"></q-breadcrumbs-el>
            <q-breadcrumbs-el label="WayFounder"></q-breadcrumbs-el>
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
            title="NFT List"
            :data="this.byuser"
            :columns="columns"
            row-key="name"
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
      tab: 'send',
      progress1: 0.0,
      progress2: 0.0,
      progressLabel1: '%',
      progressLabel2: '%',
      dataload: {
        progress1: 0.0,
        progress2: 0.0,
        progressLabel1: '%',
        progressLabel2: '%'
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
  mounted () {
    this.getEwsTable()
    this.submit()
  },
  methods: {
    ...mapActions('analytics', ['getDryrunAction', 'getByUserTotal']),
    ...mapActions('analytics', ['getEwsTable', 'updateLoading']),
    ...mapActions('account', ['logout']),
    submit () {
      const self = this
      this.getDryrunAction(self.accountName) // value is counter here from categories
      this.getEwsTable()
      this.getByUserTotal()
      // Count current bar values
      this.progress1 = this.value
      this.progress2 = (1.00 - this.value)
      this.progressLabel1 = String(this.value * 100) + '% - to Investors'
      this.progressLabel2 = String(100 - (this.value * 100)) + '% - to DAO'
      console.log('values=', this.progress1, this.progress2)
      // Counted bar values are stored in Vuex:
      this.dataload.progress1 = this.progress1
      this.dataload.progress2 = this.progress2
      this.dataload.progressLabel1 = this.progressLabel1
      this.dataload.progressLabel2 = this.progressLabel2
      this.updateLoading(this.dataload)
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category1: state => state.analytics.EwsInfo.EwsData[0].bycategory,
      category2: state => state.analytics.EwsInfo.EwsData[1].bycategory,
      category3: state => state.analytics.EwsInfo.EwsData[2].bycategory,
      // progress1: state => state.analytics.progress1,
      // progress2: state => state.analytics.progress2,
      // progressLabel1: state => state.analytics.progressLabel1,
      // progressLabel2: state => state.analytics.progressLabel2,
      value: state => state.analytics.circInfo, // value is read from Vuex
      byuser: state => state.analytics.NftList
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
