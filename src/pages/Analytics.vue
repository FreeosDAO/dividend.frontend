<template>
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
          <div class="text-h6 text-center q-ma-lg">Dividend Analytics
            <q-circular-progress
              show-value
              class="text-light-blue q-ma-md"
              :value=value
              size="50px"
              color="light-blue"
            />
          </div>
            <q-btn class="q-ma-lg" color="secondary" no-caps @click="dryrun" label="Perform Dry Run"/>
            <pure-vue-chart
              :points="[Number(category1).toLocaleString(),Number(category2).toLocaleString(),Number(category3).toLocaleString()]"
              :width="400"
              :height="200"
              :show-values="true"
            />
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
          field: 'byusertotal',
          sortable: true
        }],
      category: []
    }
  },
  methods: {
    ...mapActions('analytics', ['getDryrunAction', 'getByUserTotal']),
    ...mapActions('analytics', ['getEwsTable']),
    submit () {
      const self = this
      this.getDryrunAction(self.accountName)
      this.getEwsTable()
      this.getByUserTotal()
      this.progress1 = this.value
      this.progress2 = (1.00 - this.value)
      this.progressLabel1 = String(this.value * 100) + '% - to Investors'
      this.progressLabel2 = String(100 - (this.value * 100)) + '% - to DAO'
      console.log('values=', this.progress1, this.progress2)
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category1: state => state.analytics.EwsInfo.EwsData[0].bycategory,
      category2: state => state.analytics.EwsInfo.EwsData[1].bycategory,
      category3: state => state.analytics.EwsInfo.EwsData[2].bycategory,
      value: state => state.analytics.circInfo,
      byuser: state => state.analytics.NftList
    }),
    dryrun: function () {
      this.submit()
      return true
    }
  }
}
</script>
