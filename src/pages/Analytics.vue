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
          <div class="text-h6 text-center q-ma-lg">Dividend Analytics {{category1}}
            <q-circular-progress
              show-value
              class="text-light-blue q-ma-md"
              :value=value
              size="50px"
              color="light-blue"
            />
          </div>
            <q-btn class="q-ma-lg" color="secondary" no-caps @click="submit()" label="Perform Dry Run"/>
            <pure-vue-chart
              :points="[Number(category1).toLocaleString(),Number(category2).toLocaleString(),Number(category3).toLocaleString()]"
              :width="400"
              :height="200"
              :show-values="true"
            />
        </q-card-section>
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
      value1: null,
      datacollection: null
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category1: state => state.analytics.EwsInfo.EwsData[0].bycategory,
      category2: state => state.analytics.EwsInfo.EwsData[1].bycategory,
      category3: state => state.analytics.EwsInfo.EwsData[2].bycategory,
      value: state => state.analytics.circInfo
    })
  },
  methods: {
    ...mapActions('analytics', ['getDryrunAction']),
    ...mapActions('analytics', ['getEwsTable', 'setInfo']),
    submit () {
      const self = this
      this.getDryrunAction(self.accountName)
      this.getEwsTable()
      // this.setup()
      this.setInfo(this.setup())
      // .then(response => {
      // this.isDryRunfresh = true
      // })
    },
    setup () {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      const cat1 = self.category1
      const cat2 = self.category2
      const cat3 = self.category3
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.value1 = cat1 + cat2 + cat3
      console.log('from setup:', cat1, cat2, cat3, this.value1)
      return this.value1
    }
  },
  filters: {
    toNum (value) {
      return `$${value.toLocaleString()}`
    }
  }
}
</script>
