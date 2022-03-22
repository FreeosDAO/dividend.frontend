<template>
  <div>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
    <q-card flat class="uxblue">
        <component :is="voteComponent" />
    </q-card>
        <!--  -->
        <div id="q-app" style="min-height: 100vh;">
          <div class="row items-center q-gutter-sm">
            <q-separator color="blue"></q-separator>
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
            <span class="infotext">FreeDAO</span>
            <q-linear-progress style="border-radius: 25px;" round size="25px" :value="progress2"
                               track-color="black"
                               class="uxblue q-mt-sm">
              <div class="absolute-full flex flex-left">
                <q-badge class="uxbadge" :label="progressLabel2"></q-badge>
              </div>
            </q-linear-progress>
            <q-space></q-space>
            <q-separator color="blue"></q-separator>
            <!--  unlock dialog  -->
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import state from 'src/store/account/state'
const voteNoProp = () => import('../components/voteNoProp.vue')
const voteOpen = () => import('../components/voteOpen.vue')
const waitOthers = () => import('../components/waitOthers.vue')

export default {
  name: 'Vote',
  components: {
    voteOpen,
    waitOthers,
    voteNoProp
  },
  data () {
    return {
      // Screen Controlling Variables:
      // isProposalExpired: false, // if true the proposal is expired or canceled - todo remove
      // end
      value: 1,
      meVoted: false,
      timestamp: '',
      displayed_percentage: 0.0,
      expires: '', // normalised (UTC) expiration time for proposal
      tab: 'send',
      expiration_timer: ''
      // submitData: { todo remove
      // currentAccountName: '', // used to submit current voter name
      // toVote: 0 // current vote 1 - accepted 2 -refused.
      // },
      // voteresult: false, todo remove
      // isShowApprovedDialog: false,
      // isShowFailedDialog: false
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName, // this is logged in account of the current voter
      // Vote do not display any proposal data on the screen. See voteOpen.vue and waitOthers.vue
      eosaccount: state => state.account.proposalInfo.proposalInfo.eosaccount, // account of the new proposal.
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at,
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      // Does anybody already voted?
      alreadyVotedName: state => state.account.alreadyVoted, // name who already voted Ref: mutations.js line 69.
      isProposalVoted: state => state.account.isProposalVoted, // if true proposal was voted one voter with name above
      isProposalActive: state => state.account.isProposalActive //
    }),
    // - Components Control -
    voteComponent () { // Components switching - nothing else needed todo note this :)
      console.log('comp isProposalActive', this.isProposalActive)
      console.log('comp alreadyVotedName', this.alreadyVotedName)
      if (this.isProposalActive) {
        if ((this.isProposalVoted) && (this.alreadyVotedName === this.accountName)) { // (2) you already voted
          console.log('--- vote_waitOthers ---')
          return waitOthers
        } else { // (1) you can vote, proposal is active
          console.log('--- vote_Open ---')
          return voteOpen
        }
      } else { // (3) no proposal
        console.log('--- vote_NoProp ---')
        return voteNoProp
      }
    } // end of function
  },
  methods: {
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['refreshWhitelist']), // todo refresh whitelist may be not required
    ...mapActions('analytics', ['getByUserTotal', 'getEwsTable']),
    update () {
      this.getEwsTable()
      this.getByUserTotal()
      // this.displayed_percentage = this.proposal_percentage.toFixed(2)
    }
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
