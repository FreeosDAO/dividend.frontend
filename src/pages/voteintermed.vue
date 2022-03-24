<template>
  <!-- This page is intermediary between MainLayout.vue and Vote.vue.
  The purpose is to prefetch current state of the proposal and vote.
  Details are in this script comment.
  This information is required for both Proposal.vue and Vote.vue pages.
  This page is also called to refresh Vote.vue page when change state.
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
// This page pre-fetch which of the following states is active before entry to voting:
/* 1) Vote possible - (proposal active) && (current voter not voted) => display screen && unlock vote.
   2) Current voter already voted - (current voter already voted) => display screen && lock vote for current voter.
   3) No proposal - (no proposal) => screen blank && no voting option.
*/
import { mapActions } from 'vuex'
export default {
  name: 'voteintermed',
  created () {
    //
    this.getActionProposal()
      .then(() => {
        // callback function after success call to the server
        console.log('voteintermed in verifyProposalActive !!!')
        this.$router.push('/vote')
      })
      .catch(() => {
        // error callback function
        console.log('propintermed callback error !!!')
      })
    // this.$router.push('/proposal')
    console.log('-voteintermed-')
  },
  methods: {
    ...mapActions('account', ['getActionProposal']),
    ...mapActions('analytics', ['getEwsTable'])
  }
}
</script>

<style>

</style>
