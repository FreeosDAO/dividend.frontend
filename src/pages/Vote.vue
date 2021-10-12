<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card flat class="uxblue"
    >
      <!-- This part is displayed conditionally -->
      <div class="flex justify-center" v-if="true">
      <q-card-section>
        <div class="text-h5 text-center">
          <span>Vote NFT Proposal</span></div>
        <div class="q-ma-lg uxblue" v-if="true"> Proposal Active &nbsp; {{expiration_timer}}</div>
            <div>
              <!--  -->
              <div style="align-items: center;" class="row justify-left q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Policy cap
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-7 col-sm-7">
                  <q-btn-toggle no-caps flat
                    toggle-color="blue-4"
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
                    {{eosaccount}}
                </div>
              </div>

              <!-- Percentage Section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  % for the Account
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6 uxblue">
                   {{proposal_percentage}}
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
                  {{threshold}}
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
                  {{rates_left}}
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
                  <div v-if="voteresult" style="color :white;">ACCEPT</div>
                  <div v-else style="color :red;"><b>REJECT</b></div>
                  <div v-if="isProposerActive">
                 <q-btn class="q-ma-lg uxblue" outline disable no-caps label="Submit Vote" />
                    <q-tooltip transition-show="scale"
                               transition-hide="scale"
                    >
                      <div>
                        You are the Proposer!
                      </div>
                    </q-tooltip>
                  </div>
                 <div v-else> <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit Vote" />
                 </div>
            </div>
      </q-card-section>
      </div>
      <div v-else>NOTHING TO VOTE <br> NO ACTIVE PROPOSAL</div>
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
            <span class="infotext">DAO</span>
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
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import state from 'src/store/account/state'

export default {
  name: 'Vote',
  data () {
    return {
      value: 1,
      timestamp: '',
      displayed_percentage: 0.0,
      expires: '', // normalised (UTC) expiration time for proposal
      tab: 'send',
      activeProposal: false, // if false - no active proposal - default false!
      expiration_timer: '',
      isProposerActive: false, // proposer is logged in currently if true - default false
      submitData: {
        currentAccountName: '',
        toVote: 0
      },
      voteresult: false,
      isShowApprovedDialog: false,
      // roi_target_cap: 1, // TODO!!! delete this line!!!
      isShowFailedDialog: false
    }
  },
  created () {
    this.getActionProposal()
    this.isPropoActive()
    this.setIntervalId = setInterval(() => {
      this.getActionProposal()
      this.isPropoActive() // set up 'activeProposal' and 'expiration_timer' values
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
      accountName: state => state.account.accountName,
      eosaccount: state => state.account.proposalInfo.proposalInfo.eosaccount,
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at,
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      accrued: state => state.account.proposalInfo.proposalInfo.accrued,
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      proposer: state => state.account.proposer
    })
  },
  methods: {
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['getActionProposal']),
    ...mapActions('analytics', ['getByUserTotal', 'getEwsTable']),
    submit () { // only use to send vote cast
      // const self = this
      if (this.voteresult === true) this.submitData.toVote = 2
      else this.submitData.toVote = 1
      this.submitData.currentAccountName = this.accountName
      console.log(this.submitData.currentAccountName, this.toVote, this.voteresult)
      this.actionProposalVote(this.submitData)
    },
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
        console.log(' isProposer:', this.accountName, this.proposer, this.isProposerActive)
      }
    },
    isPropoActive () {
      if (this.eosaccount !== 'empty') {
        this.expires = (this.expires_at * 1000) // normalize UTC formats
        // http://jsfiddle.net/JamesFM/bxEJd/
        const timestamp = Date.now()
        if (timestamp > this.expires) {
          this.activeProposal = false // no active proposal
          this.expiration_timer = 0.0
        } else {
          this.activeProposal = true
          this.expiration_timer = (this.expires - timestamp) / 60000 // display in minutes
          this.expiration_timer = this.expiration_timer.toFixed(2)
        }
        console.log('timestamp:', this.expires, timestamp)
      } else {
        this.activeProposal = false // no active proposal
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
