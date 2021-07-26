<template>
<q-page>
  {{eosaccount}}<br>
  {{roi_target_cap}}<br>
  {{proposal_percentage}}<br>
  {{locked}}<br>
</q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import state from 'src/store/account/state'

export default {
  name: 'ReadProposal',
  data () {
    return {
      value: 1,
      timestamp: '',
      expires: ''
    }
  },
  created () {
    this.getActionProposal()
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      eosaccount: state => state.account.proposalInfo.proposalInfo.eosaccount,
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at,
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      accrued: state => state.account.proposalInfo.proposalInfo.accrued
      // active: state => state.account.active
    })
  },
  methods: {
    ...mapActions('account', ['getActionProposal']),
  }
}
</script>

<style scoped>

</style>
