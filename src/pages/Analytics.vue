<template xmlns:justify-content="http://www.w3.org/1999/xhtml">
<div>
  <q-card class="q-pa-md" style="background: #1C2C38;">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card
        class="my-card text-white"
        flat
        style="background: #1C2C38;"
        >
        <q-card-section
          class="texblue"
          style="background: #1C2C38;"
        >
          <div class="text-h5 text-center">
            <span id="text">Dividend Analytics</span> &nbsp;
            <q-btn outline no-caps label="Data Update" style="color:#00ADEE" @click="submit()">
             <q-tooltip anchor="top middle" round self="bottom middle" :offset="[10, 10]">
               <strong>Updates dryrun data. <br> Require transaction acceptance</strong>
             </q-tooltip>
            </q-btn>
          </div>
          <br>
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
          <q-breadcrumbs gutter="xl" separator=" " align="center" class="texblue" active-color="#00ADEE">
            <q-breadcrumbs-el class="text-lightblue" label="WayFinder"></q-breadcrumbs-el>
            <q-breadcrumbs-el class="text-lightblue" label="WayFarer"></q-breadcrumbs-el>
            <q-breadcrumbs-el class="text-lightblue" label="WayFounder"></q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-card-section>
        <q-separator color="blue"></q-separator>
        <div id="q-app" style="min-height: 100vh;">
          <div class="q-pa-md q-gutter-sm">
            <div id="container">
              <span class="infotext" style="font-size:16px;"><b>Percentage share</b></span><br>
              <span class="infotext">Investors/Founders</span>
            </div>
            <q-linear-progress style="border-radius: 25px;" size="25px" :value="progress1"
                               track-color="black"
                               class="uxblue">
              <div class="absolute-full flex flex-left">
                <q-badge class="uxbadge" :label="progressLabel1"></q-badge>
              </div>
            </q-linear-progress>
            <div class="q-gutter-sm">
              <span class="infotext">DAO</span>
            </div>
            <q-linear-progress style="border-radius: 25px;" size="25px" :value="progress2"
                               track-color="black"
                               class="uxblue">
              <div class="absolute-full flex flex-left">
                <q-badge class="uxbadge" :label="progressLabel2"></q-badge>
              </div>
            </q-linear-progress>
          </div>
          <q-table
            title="NFTs Summary by Owner "
            card-class="uxtable text-lightblue"
            table-class="text-lightblue"
            table-header-class="text-lightblue"
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
.texblue {
  color:#00ADEE;
}
.uxbadge {
  color:#1C2C38;
  background-color:#00ADEE;
}
.uxblue {
  background-color: #1C2D39;
  color:#00ADEE;
}
.texblue {
  color:#00ADEE;
}
.infotext {
  color: #00ADEE;
  font-size: 0.9em;
  position: relative;
}
.uxtable {
  background-color: #101C28;
  color:#00ADEE;
}
</style>
