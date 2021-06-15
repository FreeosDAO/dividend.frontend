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
          <div class="text-h6 text-center q-ma-lg">Dividend Analytics</div>
            <q-btn class="q-ma-lg" color="secondary" no-caps @click="submit()" label="Perform Dry Run"/>
            {{category1}}{{category2}}{{category3}}
        </q-card-section>
      </q-card>
    </div>
  </q-card>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Analytics',
  data () {
    return {
      tab: 'send',
      value: 61,
      datacollection: null
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      category1: state => state.analytics.EwsInfo.EwsData[0].bycategory,
      category2: state => state.analytics.EwsInfo.EwsData[1].bycategory,
      category3: state => state.analytics.EwsInfo.EwsData[2].bycategory
    })
  },
  methods: {
    ...mapActions('analytics', ['getDryrunAction']),
    ...mapActions('analytics', ['getEwsTable']),
    submit () {
      const self = this
      this.getDryrunAction(self.accountName)
      this.getEwsTable()
      // .then(response => {
      // this.isDryRunfresh = true
      // })
    }
  }
}
</script>
