<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 600px">
      <q-card>
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
        </q-tabs>
        <q-separator />
        <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 80%)"
    >
      <!-- This part is displayed conditionally -->
      <div class="flex justify-center" v-if="active">
      <q-card-section>
            <div class="text-h6 text-center q-ma-lg">Vote this NFT Proposal</div>
            <div style="max-width: 500px; margin: 0 auto;">
              <!-- Select corect roi cap -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <!--<div class="col-xs-5 col-sm-4 text-right">
                  Policy cap
                </div>
                <div class="col-xs-1 col-sm-2"></div> -->
                <div class="col-xs-6 col-sm-6">
                  <q-btn-toggle
                    toggle-color="blue"
                    v-model="roi_target_cap"
                    :options="[
                      {label: 'Horizontal', value: 1},
                      {label: 'Vertical', value: 2},
                      {label: 'Iterative', value: 3}
                    ]"
                  ></q-btn-toggle>
                </div>
              </div>

              <!-- eosaccount section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  EOS-type account
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                    {{eosaccount}}
                </div>
              </div>

              <!-- Percentage Section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Percentage
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                   {{proposal_percentage}}
                </div>
              </div>
              <!-- Threshold conditional section -->
              <div v-if="roi_target_cap!==1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Threshold
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  {{threshold}}
                </div>
              </div>
              </div>
              <!-- rates_left conditional section -->
              <div v-if="roi_target_cap===1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Rates to pay
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  {{rates_left}}
                </div>
              </div>
              </div>
              <!-- locked conditional section -->
              <div v-if="roi_target_cap===3">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
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
                 <q-btn class="q-ma-lg" color="blue" no-caps @click="submit()" label="Submit" />
            </div>
      </q-card-section>
      </div>
      <div v-else>NOTHING TO VOTE <br> NO ACTIVE PROPOSAL</div>
    </q-card>
      </q-card>
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
      expires: '',
      tab: 'send',
      active: false,
      submitData: {
        currentAccountName: '',
        toVote: 0
      },
      voteresult: false,
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  created () {
    this.getActionProposal()
    this.setIntervalId = setInterval(() => {
      this.getActionProposal()
    }, 300000) // call each 30 seconds then
    this.isProposalActive()
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
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
    ...mapActions('proposal', ['actionProposalVote']),
    ...mapActions('account', ['getActionProposal']),
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
    isProposalActive () {
      this.active = true// false
      // blockchain already added one hour to expires_at
      this.expires = (this.expires_at * 1000) + 43200000 // +12h
      this.timestamp = this.getTimestamp()
      console.log(this.expires) // http://jsfiddle.net/JamesFM/bxEJd/
      console.log(this.timestamp)
      if (this.expires > this.timestamp) {
        this.active = true
      }
    }
  }
}
</script>

<style scoped>
</style>
