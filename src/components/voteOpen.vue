<template>
  <!-- voteOpen -->
  <!-- --- --- ---
  Component for Vote.vue used when:
  1. Proposal active
  2. You are not voted yet
  then 'You can submit your vote'.
  TODO Timer not ready.
  -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
        <q-card flat class="uxblue"
        >
          <div class="flex justify-center">
            <q-card-section>
              <div class="text-h5 text-center">
                <span>Vote NFT Proposal</span></div>
              <div class="q-ma-lg uxblue"> Proposal expire in:&nbsp;{{expiration_timer}} min.</div>
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
                    <div>{{eosaccount}}</div>
                  </div>
                </div>

                <!-- Percentage Section -->
                <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                  <div class="col-xs-5 col-sm-4 text-left">
                    % for the Account
                  </div>
                  <div class="col-xs-1 col-sm-2"></div>
                  <div class="col-xs-6 col-sm-6 uxblue">
                    <div>{{proposal_percentage}}</div>
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
                      <div>{{threshold}}</div>
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
                      <div>{{rates_left}}</div>
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
                <!-- -->
                <div>
                  <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit Vote" />
                </div>
              </div>
            </q-card-section>
          </div>
        </q-card> <!-- end of component -->
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'voteOpen',
  data () {
    return {
      // Screen Controlling Variables:
      isProposalExpired: false, // if true the proposal is expired or canceled - (Setup by local function)
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
      // Does anybody already voted?
      alreadyVotedName: state => state.account.alreadyVoted, // name who already voted
      isProposalVoted: state => state.account.isProposalVoted // if true proposal was voted one voter with name above
    })
  },
  methods: {
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['refreshWhitelist']),
    submit () { // voting todo rewrite
      // const self = this
      if (this.voteresult === true) this.submitData.toVote = 2
      else this.submitData.toVote = 1
      this.submitData.currentAccountName = this.accountName
      console.log(this.submitData.currentAccountName, this.toVote, this.voteresult)
      this.actionProposalVote(this.submitData) // standard voting action (proposal/actions.js)
      this.refreshWhitelist() // refresh isProposalVoted status.
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
