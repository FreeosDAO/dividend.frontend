
<template>
  <!--  View with no proposal -->
  <!-- TODO What is going on if there is a proposal when this component is active? -->
  <div>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card flat class="uxblue"
    >
      <!-- This part is displayed conditionally -->
      <div class="flex justify-center"> <!-- v-if="true"> now is displayed unconditionally all the time -->
      <q-card-section>
        <div class="text-h5 text-center">
          <span>Vote NFT Proposal</span></div>
        <div class="q-ma-lg uxblue"> No Active Proposal.</div>
            <div> <!-- -->
              <!--  -->
            </div>
      </q-card-section>
        <!-- KEEP -->
      </div>
      <!-- <div v-else>NOTHING TO VOTE <br> NO ACTIVE PROPOSAL</div> -->
    </q-card> <!-- KEEP -->
        <!--  -->
     </div>
  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import state from 'src/store/account/state'

export default {
  name: 'Vote',
  data () {
    return {
      // Screen Controlling Variables:
      // todo What should be removed?
      // isProposalExpired: false, // if true the proposal is expired or canceled - (Setup by local function) todo
      // end
      // value: 1,
      // meVoted: false, todo
      // timestamp: '',
      // displayed_percentage: 0.0
      // expires: '', // normalised (UTC) expiration time for proposal
      // tab: 'send',
      // expiration_timer: '', todo
      // submitData: {
      // currentAccountName: '', // used to submit current voter name // todo
      // toVote: 0 // current vote 1 - accepted 2 -refused. // todo
      // },
      // voteresult: false,
      // isShowApprovedDialog: false,
      // isShowFailedDialog: false
    }
  },
  // TODO NOTE: this.getActionProposal() is called in MainLayout.vue ...
  // todo ... isProposalActive is observed by the parent vote.vue.
  computed: {
    ...mapState({
      accountName: state => state.account.accountName, // this is logged in account of the current voter
      // Data displayed from current active proposal to the screen:
      eosaccount: state => state.account.proposalInfo.proposalInfo.eosaccount // this is account of the new proposal.
    })
  },
  methods: {
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['getActionProposal', 'refreshWhitelist']), // todo refresh whitelist may be not required
    ...mapActions('analytics', ['getByUserTotal', 'getEwsTable'])
  }
}
</script>

<style>
.uxblue {
  background-color: #1D2C39;
  color:#00ADEE;
}
.uxdialog {
  background-color: rgb(28, 44, 56);
  color: rgb(0,172,239);
  border-radius: 1.25rem;
  border-color: #00ADEE;
  border-style: solid;
}
.infotext {
  color: #00ADEE;
  font-size: 0.9em;
  position: relative;
  left: 5px;
}
.alerttext {
  color:#1C2C38;
  position: relative;
  left: 5px;
}
.uxbadge {
  color:#1C2C38;
  background-color:#00ADEE;
}
#text,
#icon {
  line-height: 40px;
}
#icon {
  vertical-align: middle;
  font-size: 30px;
}
#mydiv{
  position: fixed;
  bottom: 0;
}
</style>
