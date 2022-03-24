<template>
  <!-- Notes:
  Going back to 'editComponent' may happen only in three cases"
  1) Proposer will cancel the proposal (initiated by proposer using button).
  2) Proposal will naturally expire (local timer expired, local timer must be updated from backend.
  3) Both voters voted on proposal (will be scanned each 30 sec.).
  The 'activeComponent' must verify all above cases.
  Tech notes:
  - Only active component has timer.
  -->
  <q-card flat
          class="uxblue"
  >
    <q-card-section>
      <!-- <div id="nav" class="text-h6 text-center q-ma-lg"> -->
      <!-- Dialog --- for proposal cancellation (note 1 top) -->
      <div class="q-pa-md">
        <q-dialog v-model="this.dialogreset">
          <q-card class="uxdialog">
            <q-card-section class="row items-center q-gutter-sm">
              <q-toolbar>
                <q-toolbar-title>Remove Active Blockchain Proposal</q-toolbar-title>
                <q-btn flat v-close-popup round dense icon="close"></q-btn>
              </q-toolbar>
              <q-card-section class="row items-center q-gutter-sm">
                <q-btn outline class="q-ma-lg" style="color:#4fa9e9" no-caps @click="breset()" label="Cancel Active Proposal"/>
                <q-btn outline label="Close Dialog" style="color:#4fa9e9" no-caps v-close-popup></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-dialog> <!-- end of dialog reset -->
      </div> <!-- end for dialog -->
      <!-- end of DIALOG -->
      <!-- === START OF DATA DISPLAY PART === This is only used if already is active proposal in the backend. -->
      <div style="max-width: 500px; margin: 0 auto;">
        <!-- Select correct roi cap -->
        <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-6 col-sm-6">
            <!-- Passive data display Select Policy: -->
            <q-btn-toggle
                          no-caps
                          flat
                          disable: true
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
          <div class="col-xs-7 col-sm-7">
            <div>{{this.propaccount}}</div>
          </div>
        </div>
        <!-- Percentage Section -->
        <div style="align-items: center;"
             class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-5 col-sm-4 text-left">
            % for the Account
          </div>
          <div class="col-xs-7 col-sm-7">
            <div>{{this.proposal_percentage}}</div>
          </div>
        </div>
        <!-- Threshold conditional section -->
        <div v-if="roi_target_cap!==1"> cap &nbsp;{{roi_target_cap}}
          <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-xs-5 col-sm-4 text-left">
              Threshold Point
            </div>
            <div class="col-xs-7 col-sm-7">
              <div>{{this.threshold}}</div>
            </div>
          </div>
        </div>
        <!-- rates_left conditional section -->
        <div v-if="roi_target_cap===1">cap &nbsp;{{roi_target_cap}}
          <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-xs-5 col-sm-4 text-left">
              Iterations to pay
            </div>
            <div class="col-xs-7 col-sm-7">
              <div>{{this.rates_left}}</div>
            </div>
          </div>
        </div>
        <!-- locked conditional section -->
        <div v-if="roi_target_cap===3">
          <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-xs-5 col-sm-4 text-left">
              Locked
            </div>
            <div class="col-xs-7 col-sm-7">
              <q-toggle /> <!-- todo rewrite lock only to display data -->
                size="xl"
                keep-color
                checked-icon="check"
                v-model="submitData.value"
                color="blue"
              >
            </div>
          </div>
        </div>
      </div>
      <!-- === END OF DATA DISPLAY PART PART === -->
      <div class="flex justify-center">
        <!-- todo 'proposal cancel' button here -->
        <q-btn outline no-caps label="Cancel Proposal" class="uxblue" @click="dialogreset = true"></q-btn>
      </div>
    </q-card-section>
    <div class="q-ma-lg"> Active Proposal expire in: &nbsp; &nbsp; {{this.expiration_timer}}</div>
  </q-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import router from '../router'
// import router from '../router/index.js'

export default {
  name: 'activeComponent',
  data () {
    return {
      dialogreset: false
      // expiration_timer: 0
      // for display only
      // currentAccountName: '',
      // eosaccount: null,
      // cap: 1,
      // percentage: 0.0,
      // threshold: 0,
      // ratesleft: 0,
      // locked: false
    } // closes return
  }, // closes data
  computed: {
    ...mapState({ // these values are displayed on the screen as active proposal
      accountName: state => state.account.accountName,
      propaccount: state => state.account.proposalInfo.proposalInfo.eosaccount, // account 'inside proposal'
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      // expires_at: state => state.account.proposalInfo.proposalInfo.expires_at, // prefetched by page
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      expiration_timer: state => state.account.timer,
      // Delivered by the VerifyProposalActive in actions.js line 189, called in propintermed.vue line 25/
      isProposalActive: state => state.account.isProposalActive // prefetched once by propintermed page
    })
  },
  methods: {
    ...mapActions('proposal', ['proposalRemove']),
    breset () { // safely removes active proposal from backend
      this.dialogreset = false
      console.log('breset activeComponent.vue !!!')
      this.proposalRemove(this.accountName) // Additionally, setup route back to propintermed.
    }
    // secondsToDHms (a) { // format given number of seconds 'a' as number of days, hours, and minutes.
    // a = Number(a)
    // const d = Math.floor(a / 86400)
    // const h = Math.floor(a % 86400 / 3600)
    // const m = Math.floor(a % 3600 / 60)
    // const dDisplay = d > 0 ? d + (h === 1 ? ' day, ' : ' days, ') : ''
    // const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
    // const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
    // return dDisplay + hDisplay + mDisplay
    // // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    // // https://www.epochconverter.com/
    // }
  } // , // end of methods
  // watch: { // todo watchers can be removed at all
  // isProposalActive: function (value) { // TODO cannot be isProposalActive as this duplicate regular 30sec way
  // // todo ... and don't give any time profit. Eventually may be based on local not external timer!
  // console.log('WATCH', value)
  // }
  // } // ,
  // watch: {
  // isProposalActive: {
  // immediate: true,
  // handler: function (val) {
  // if (val && this.isProposalActive) {
  // console.log('insider watch')
  // // this.getAccountInfo()
  // // this.getActionProposal()
  // }
  // }
  // }
  // }
}
</script>

<style>

</style>
