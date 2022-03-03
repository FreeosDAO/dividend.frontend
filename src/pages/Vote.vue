<template>
  <div>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <!-- <q-dialog v-model="this.isSecondVoter"
                persistent
                transition-show="flip-down"
                transition-hide="flip-up"
      >
      2nd voter problem solver - This pop-up must appear only for second voter
        <q-card class="bg-primary text-white">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 alerttext">Important Message from the Proposer</div>
            <q-space></q-space>
          </q-card-section>
          <q-card-section>
            <h7>The Actual proposal must be cancelled.</h7> <br/>
            Please, press the button bellow to vote 'no' and cancel the current proposal.<br>
            <q-btn class="alerttext" label="Authorise Current Proposal Removal" no-caps flat style="justify-self: flex-end;" @click="byebye()"></q-btn>
          </q-card-section>
        </q-card>
      </q-dialog> -->
      <q-card flat class="uxblue"
    >
      <!-- This part is displayed conditionally -->
      <div class="flex justify-center"> <!-- v-if="true"> now is displayed unconditionally all the time -->
      <q-card-section>
        <div class="text-h5 text-center">
          <span>Vote NFT Proposal</span></div>
        <div class="q-ma-lg uxblue" v-if="true"> Proposal expire in:&nbsp;{{expiration_timer}} min.</div>
            <div>
              <!--  -->
              <div style="align-items: center;" class="row justify-left q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  <!-- Policy cap -->
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-7 col-sm-7">
                  <q-btn-toggle no-caps flat
                    toggle-color="white"
                    v-model="roi_target_cap"
                    :options="[
                      {label: 'WayFinder', value: 1},
                      {label: 'WayFarer', value: 2},
                      {label: 'WayFounder', value: 3}
                    ]"
                  ></q-btn-toggle>
                </div>
              </div>

              <!-- eosaccount section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Account (Name)
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6 uxblue">
                    <div v-if = "!this.isProposalExpired">{{eosaccount}}</div>
                    <div v-else> N/A </div>
                </div>
              </div>

              <!-- Percentage Section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  % for the Account
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6 uxblue">
                  <div v-if = "!this.isProposalExpired">{{proposal_percentage}}</div>
                  <div v-else> N/A </div>
                </div>
              </div>
              <!-- Threshold conditional section -->
              <div v-if="roi_target_cap!==1">
                <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                  <div class="col-xs-5 col-sm-4 text-left">
                  Threshold
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6 uxblue">
                  <div v-if = "!this.isProposalExpired">{{threshold}}</div>
                  <div v-else> N/A </div>
                </div>
              </div>
              </div>
              <!-- rates_left conditional section -->
              <div v-if="roi_target_cap===1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Rates to pay
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6 uxblue">
                  <div v-if = "!this.isProposalExpired">{{rates_left}}</div>
                  <div v-else> N/A </div>
                </div>
              </div>
              </div>
              <!-- locked conditional section -->
              <div v-if="roi_target_cap===3">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Locked
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                <q-toggle
                  v-model="locked"
                  color="red"
                  disable
                ></q-toggle>
                </div>
              </div>
              </div>
            </div>
            <div class="flex justify-center">
               <q-toggle size="xl"
                 v-model="voteresult"
                 checked-icon="check"
                 color="green"
                 unchecked-icon="clear"
               ></q-toggle>
               <!-- white or red text above screen switch -->
               <div v-if="voteresult" style="color :white;">ACCEPT</div>
               <div v-else style="color :red;"><b>REJECT</b></div>
               <!-- greyed submit button under certain conditions -->
               <div v-if="!this.conditions()">
                    <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit Vote" />
                    conditions:{{this.conditions()}}
               </div>
               <div v-else>
                  <q-btn class="q-ma-lg uxblue" outline disable no-caps label="Submit Vote" />
                  <q-tooltip transition-show="scale"
                             transition-hide="scale"
                             content-class="uxdialog"
                             class="q-ma-lg text-h7"
                  >
                      <div id="app">
                        <h6 v-if="this.isProposalExpired">proposal expired</h6>
                        <!-- <h6 v-else-if=></h6> -->
                        <h6 v-if="this.isProposerActive">you are active proposer</h6>
                        <h6 v-else-if="this.meVoted">you already voted</h6>
                      </div>
                    {{this.isProposalExpired}}/{{this.isProposerActive}}/{{this.meVoted}}
                  </q-tooltip>
               </div>
            </div>
      </q-card-section>
      </div>
      <!-- <div v-else>NOTHING TO VOTE <br> NO ACTIVE PROPOSAL</div> -->
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

export default {
  name: 'Vote',
  data () {
    return {
      // Screen Controlling Variables:
      // isProposerMessage: false, // todo !!! true if message from the proposer - default false todo isSecondVoter duplicated function
      isProposalExpired: false, // if true the proposal is expired or canceled - (Setup by local function)
      isProposerActive: false, // you are active proposer  - (setup by local function)
      // end
      value: 1,
      meVoted: false,
      timestamp: '',
      displayed_percentage: 0.0,
      expires: '', // normalised (UTC) expiration time for proposal
      tab: 'send',
      expiration_timer: '',
      submitData: {
        currentAccountName: '', // used to submit current voter name
        toVote: 0 // current vote 1 - accepted 2 -refused.
      },
      voteresult: false,
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  created () {
    // this.readPostBox() // reads eventual message from proposer - 2nd voter solver - not longer needed
    this.getActionProposal() // retrieve current proposal info from the backend - actions.js line 96
    this.isProposalActive() // local call in methods
    this.refreshWhitelist() // refresh isProposalVoted status.
    this.setIntervalId = setInterval(() => {
      this.getActionProposal() // this set up 'activeProposal' and 'expiration_timer' values
      this.refreshWhitelist() // refresh isProposalVoted.
      this.isProposalActive() //
    }, 30000) // call each 30 seconds then
    document.addEventListener('beforeunload', this.handler)
    this.isProposer()
    this.update()
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
  },
  // mounted () {
  // this.update()
  // },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName, // this is logged in account of the current voter
      // Data displayed from current active proposal to the screen:
      eosaccount: state => state.account.proposalInfo.proposalInfo.eosaccount, // this is account of the new proposal.
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at,
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      accrued: state => state.account.proposalInfo.proposalInfo.accrued,
      // Other data on Screen: are mostly on data section
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      proposer: state => state.account.proposer, // todo better use getter todo
      // isSecondVoter: state => state.account.isSecondVoter, // todo seems to be unusable
      // Does anybody already voted?
      alreadyVotedName: state => state.account.alreadyVoted, // name who already voted
      isProposalVoted: state => state.account.isProposalVoted // if true proposal was voted one voter with name above
    })
  },
  methods: {
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['getActionProposal', 'refreshWhitelist']), // todo refresh whitelist may be not required
    ...mapActions('analytics', ['getByUserTotal', 'getEwsTable']),
    // ...mapMutations('account', ['hideModal']), // todo what hideModal is doing?
    submit () { // only use to send vote cast
      // const self = this
      if (this.voteresult === true) this.submitData.toVote = 2
      else this.submitData.toVote = 1
      this.submitData.currentAccountName = this.accountName
      console.log(this.submitData.currentAccountName, this.toVote, this.voteresult)
      this.actionProposalVote(this.submitData) // standard voting action (proposal/actions.js)
      this.refreshWhitelist() // refresh isProposalVoted status.
      // this.isProposalVoted = true // Marker is removed by isProposalActive()
    },
    conditions () {
      // (current user different than proposer) || (proposal not voted here) ||
      // (proposal not expired yet) - all should be false to make submit button visible
      // this.meVoted = this.isProposalVoted && (this.alreadyVotedName === this.accountName)
      this.meVoted = false
      console.log('this.alreadyVotedName', this.alreadyVotedName, 'this.accountName', this.accountName, 'meVoted', this.meVoted)
      const result = ((this.isProposerActive) || (this.meVoted) || (this.isProposalExpired))
      console.log('conditions=', result)
      console.log('conditions=', this.isProposalExpired, this.isProposerActive, this.isProposalVoted)
      return result
      // if return = false - submit button visible
    },
    // byebye () {
    //  2nd voter solver - no longer needed
    //  this.submitData.toVote = 2 // Reject current proposal.
    //  this.submitData.currentAccountName = this.accountName
    //  console.log('bye bye', this.submitData.currentAccountName)
    //  this.hideModal()
    //  // this.isProposalVoted = true // Marker is removed by isProposalActive()
    //  this.refreshWhitelist() // refresh isProposalVoted status.
    //  this.cleanUpMessageTrigger(this.accountName) // make postbox clean
    //  this.actionProposalVote(this.submitData) // standard voting action (proposal/actions.js)
    // },
    getTimestamp: function () {
      return Date.now()
    },
    update () {
      this.getEwsTable()
      this.getByUserTotal()
      // this.displayed_percentage = this.proposal_percentage.toFixed(2)
    },
    isProposer () {
      if (this.accountName === this.proposer) {
        this.isProposerActive = true
      } else {
        this.isProposerActive = false
      }
      console.log(' conditions isProposer() --- ', this.accountName, this.proposer, this.isProposerActive)
    },
    isProposalActive () { // Is proposal active ? - it means not expired ?
      if ((this.eosaccount !== 'empty') && (this.account !== 'erased')) {
        this.expires = (this.expires_at * 1000) // normalize UTC formats
        // http://jsfiddle.net/JamesFM/bxEJd/
        const timestamp = Date.now()
        if (timestamp > this.expires) {
          this.isProposalExpired = true // no active proposal
          // this.isProposalVoted = false // voting marker cancelled after expiration
          this.refreshWhitelist() // refresh isProposalVoted status.
          this.expiration_timer = 0.0
        } else { // proposal is active
          this.isProposalExpired = false // proposal actually active
          this.expiration_timer = (this.expires - timestamp) / 60000 // display in minutes
          this.expiration_timer = this.expiration_timer.toFixed(2)
          this.expiration_timer = this.expiration_timer.replace('.', ' : ')
        }
        console.log('timestamp:', this.expires, timestamp)
      } else {
        this.isProposalExpired = true // no active proposal
        // this.isProposalVoted = false // voting marker cancelled after expiration
        this.refreshWhitelist() // refresh isProposalVoted status.
        this.expiration_timer = 0.0
      }
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
