<template>
  <!-- This page is intermediary between MainLayout.vue and Proposal.vue.
  The purpose is to prefetch current state of the proposal. Is it active?
  This information is required for both Proposal.vue and Vote.vue pages.
  -->
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-md flex flex-center">
  <!--    <q-circular-progress
        indeterminate
        size="90px"
        :thickness="0.2"
        color="blue"
        center-color="grey-8"
        track-color="transparent"
        class="q-ma-md"
      ></q-circular-progress> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'propintermed',
  created () {
    // this.verifyProposalActive() // todo it should be also reading current proposal data at the same time
    this.verifyProposalActive()
      .then(() => {
        // callback function after success call to the server
        console.log('propintermed in verifyProposalActive !!!')
        this.$router.push('/proposal')
      })
      .catch(() => {
        // error callback function
        console.log('propintermed callback error !!!')
      })
    // this.$router.push('/proposal')
    console.log('-propintermed-')
  },
  methods: {
    ...mapActions('account', ['verifyProposalActive'])
  }
}
</script>

<style>

</style>
