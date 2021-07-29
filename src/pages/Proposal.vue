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
      <q-card-section>
            <div id="nav" class="text-h6 text-center q-ma-lg"> <img id="icon" width="65" src="~assets/decentralised.jpg">
              <span id="text">&nbsp; Create NFT Proposal</span></div>
<!-- Dialog -->
        <div class="q-pa-md">
          <q-dialog v-model="dialogreset">
            <q-card>
              <q-card-section class="row items-center q-gutter-sm">Remove Active Blockchain Proposal</q-card-section>
              <q-card-section class="row items-center q-gutter-sm">
                <q-btn class="q-ma-lg" color="orange" no-caps @click="breset()" label="Cancel Active Proposal"/>
                <q-btn no-caps label="Close Dialog" color="primary" v-close-popup></q-btn>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
<!-- end of DIALOG -->
        <!-- Dialog Info Content -->
        <div class="q-pa-md">
          <q-dialog v-model="dialoginfo">
            <q-card>
                <q-card-section class="row items-center q-gutter-sm">
                <p>Proposal Information <br>
                Proposal (acct) {{propaccount}}<br>
                Percentage {{proposal_percentage}}<br>
                Expiration {{expires_at}}</p>
                <q-btn no-caps label="Close dialog" color="primary" v-close-popup></q-btn>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
        <!-- end of DIALOG Info Content-->
            <div style="max-width: 500px; margin: 0 auto;">
              <!-- Select correct roi cap -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-6 col-sm-6">
                  <q-btn-toggle no-caps
                    v-model="submitData.cap"
                    push
                    glossy
                    toggle-color="green"
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
                <div class="col-xs-5 col-sm-4 text-right">
                  Account
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  <q-input
                    v-model="submitData.eosaccount"
                    type="text"
                    color="white"
                    outlined
                    dense
                  />
                </div>
              </div>
              <!-- Percentage Section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Percentage
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  <q-input dense outlined color="white" v-model="submitData.percentage" />
                </div>
              </div>
              <!-- Threshold conditional section -->
              <div v-if="submitData.cap!==1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Threshold
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6" color="white">
                  <q-input outlined v-model="submitData.threshold" label="POINT" color="white"
                    placeholder='0.0000' dense >
                  </q-input>
                </div>
              </div>
              </div>
              <!-- rates_left conditional section -->
              <div v-if="submitData.cap===1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Iterations to pay
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  <q-input
                    v-model="submitData.ratesleft"
                    type="number"
                    outlined
                    dense
                  />
                </div>
              </div>
              </div>
              <!-- locked conditional section -->
              <div v-if="submitData.cap===3">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Locked
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                <q-toggle
                  v-model="submitData.value"
                  color="red"
                ></q-toggle>
                </div>
              </div>
              </div>
            </div>
            <div class="flex justify-center">
              <div class="flex justify-center" v-if="isProposerActive">
               <q-btn icon="link" class="q-ma-lg" color="primary" no-caps @click="submit()" label="Submit" :disable="!isFormFilled"/>
              </div>
              <div id="div1" v-else>You're not the proposer</div>
              <q-btn class="q-ma-lg" color="secondary" no-caps @click="resetForm()" label="Clear"/>
              <q-btn round class="q-ma-lg" color="primary" glossy icon="info">
                 <q-tooltip glossy icon="info"
                     transition-show="scale"
                     transition-hide="scale"
                 >
                 <div>
                     <p>Proposal Information <br>
                      Proposal (acct) {{propaccount}}<br>
                      Percentage {{proposal_percentage}}<br>
                      Expiration {{expires_at}}</p>
                 </div>
                 </q-tooltip>
              </q-btn>
              <div class="q-ma-lg" v-if="activeProposal"> Proposal Active &nbsp; {{expiration_timer}}</div>
              <div class="q-ma-lg" v-else> No Active Proposal </div>
            </div>
      </q-card-section>
          <div id="div2" class="flex justify-center">Fill up the Form before Submit.</div>
    </q-card>
      </q-card>
      <div id="q-app" style="min-height: 100vh;">
        <div class="row items-center q-gutter-sm">
          <q-linear-progress size="25px" :value="progress1" color="accent">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel1"></q-badge>
            </div>
          </q-linear-progress>
          <q-linear-progress size="25px" :value="progress2" color="accent" class="q-mt-sm">
            <div class="absolute-full flex flex-center">
              <q-badge color="white" text-color="accent" :label="progressLabel2"></q-badge>
            </div>
          </q-linear-progress>
          <!--  unlock dialog  -->
          <div class="row items-center q-gutter-sm">
            <q-btn flat icon="link" label="Cancel Proposal" color="orange" @click="dialogreset = true"></q-btn>
            <q-btn flat icon="link" label="Unlock NFT" color="secondary" @click="dialog = true"></q-btn>
            <q-btn flat label="NFT List" color="blue" @click="$router.push('/customer')"></q-btn>
            <q-btn flat label="Analytics" color="blue" @click="$router.push('/analytics')"></q-btn>
            <q-dialog v-model="dialog">
              <q-card>
                <q-card-section class="row items-center q-gutter-sm">
                  <!-- NFT key section -->
                  <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                    <div class="col-xs-5 col-sm-4 text-right">
                      Key of NFT to unlock
                    </div>
                    <div class="col-xs-1 col-sm-2"></div>
                    <div class="col-xs-6 col-sm-6">
                      <q-input
                        v-model="submitData1.nftKey"
                        type="number"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                  <!--   -->
                  <div>
                    <q-btn icon="link" class="q-ma-lg" color="orange" no-caps @click="submit1()" label="Unlock"/>
                    <q-btn no-caps label="Close dialog" color="primary" v-close-popup></q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
          <!-- -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Proposal',
  data () {
    return {
      tab: 'send',
      dialog: false,
      dialogreset: false,
      dialoginfo: false,
      activeProposal: false, // if false - no active proposal
      expiration_timer: 0.0,
      isProposerActive: false,
      submitData: {
        currentAccountName: '',
        eosaccount: null,
        cap: 1,
        percentage: 0.0,
        threshold: '',
        ratesleft: 0,
        locked: false
      },
      submitData1: {
        NFTAccountName: '',
        nftKey: null
      },
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  mounted () {
    this.isProposer1()
  },
  created () { // for automatic logout
    this.isProActive()
    this.setIntervalId = setInterval(() => {
      this.getActionProposal()
      this.isProActive()
      this.isProposer1()
    }, 30000) // call each 30 sec after the tests
    document.addEventListener('beforeunload', this.handler)
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      propaccount: state => state.account.proposalInfo.proposalInfo.eosaccount,
      value: state => state.analytics.circInfo,
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      isProposalActive: state => state.proposal.isproposalactive,
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at,
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      accrued: state => state.account.proposalInfo.proposalInfo.accrued,
      proposer: state => state.account.proposer
    }),
    isFormFilled () {
      let a = false
      if (this.submitData.cap === 1) a = ((this.submitData.percentage > 0) && (this.submitData.ratesleft > 0))
      else a = ((this.submitData.percentage > 0) && (this.submitData.threshold > 0))
      return a
    }
  },
  methods: {
    ...mapActions('proposal', ['proposalNew', 'proposalRemove', 'actionUnlockNFT', 'setProposalActive']),
    ...mapActions('account', ['getActionProposal']),
    submit () {
      const self = this
      console.log('TOKEN: ', `${parseFloat(this.submitData.threshold).toFixed(process.env.TOKEN_PRECISION)} ${this.submitData.tokenType}`)
      this.submitData.currentAccountName = this.accountName
      this.proposalNew(this.submitData)
        .then(response => { // TODO remove it
          // this.setProposalActive(1) // TODO ?? remove it
          this.getActionProposal() // updates info on proposal
          self.resetForm()
        })
    },
    isProposer1 () {
      if (this.accountName === this.proposer) {
        this.isProposerActive = true
        console.log(' isProposer1:', this.accountName, this.proposer, this.isProposerActive)
      }
    },
    // yourOpenFn () {
    // console.log('yourOpenFn invoked.')
    // },
    // yourCloseFn () {
    // console.log('yourCloseFn invoked.')
    // },
    submit1 () {
      this.submitData1.NFTAccountName = this.accountName
      console.log('submitData1 = ', this.submitData1)
      this.actionUnlockNFT(this.submitData1)
        .then(response => {
          // self.getAccountInfo()
          this.submitData1.NFTAccountName = '' // reset mini-form
        })
    },
    // dialogInfoService () {
    // this.dialoginfo = true
    // this.getActionProposal()
    // },
    isProActive () {
      if (this.eosaccount !== 'empty') {
        this.expires = (this.expires_at * 1000) // normalize UTC formats
        // http://jsfiddle.net/JamesFM/bxEJd/
        const timestamp = Date.now()
        if (timestamp > this.expires) {
          this.activeProposal = false // no active proposal
          this.expiration_timer = 0.0
        } else {
          this.activeProposal = true // active proposal
          this.expiration_timer = (this.expires - timestamp) / 60000 // display in minutes
          this.expiration_timer = this.expiration_timer.toFixed(2)
        }
        console.log('timestamp:', this.expires, timestamp)
      } else { // proposal 'empty'
        this.activeProposal = false // no active proposal
        this.expiration_timer = 0.0
      }
    },
    breset () { // removes active proposal
      this.submitData.currentAccountName = this.accountName
      this.proposalRemove(this.accountName)
      this.setProposalActive(0)
      this.getActionProposal()
      // .then(response => {
      // this.isProposalActive()
      // })
    },
    resetForm () {
      this.submitData = {
        eosaccount: '',
        cap: 1,
        percentage: 0.0,
        threshold: 0.0,
        ratesleft: 0,
        locked: false
      }
    }
  }
}
</script>

<style>
nav {
  display: inline-block;
  height: 50px;
  margin: 30px;
  padding: 2px;
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
.Row {
  display: table;
  width: 100%; /*Optional*/
  table-layout: fixed; /*Optional*/
  border-spacing: 10px; /*Optional*/
}
#div1{
  color:yellow;
}
#div2{
  color:lightblue;
}
.Column {
  display: table-cell;
}
</style>
