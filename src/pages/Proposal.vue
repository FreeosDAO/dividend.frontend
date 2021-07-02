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
                <q-btn class="q-ma-lg" color="orange" no-caps @click="breset()" label="Remove Proposal"/>
                <q-btn no-caps label="Close Dialog" color="primary" v-close-popup></q-btn>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
<!-- end of DIALOG -->
        <!-- Dialog Info -->
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
        <!-- end of DIALOG  Info -->
            <div style="max-width: 500px; margin: 0 auto;">
              <!-- Select correct roi cap -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-6 col-sm-6">
                  <q-btn-toggle no-caps
                    v-model="submitData.cap"
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
                  <q-input dense outlined v-model="submitData.percentage" />
                </div>
              </div>
              <!-- Threshold conditional section -->
              <div v-if="submitData.cap!==1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-right">
                  Threshold
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  <q-input
                    v-model="submitData.threshold"
                    type="number"
                    outlined
                    dense
                  />
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
              <q-btn icon="link" class="q-ma-lg" color="primary" no-caps @click="submit()" label="Submit" :disable="!isFormFilled"/>
              <q-btn class="q-ma-lg" color="secondary" no-caps @click="resetForm()" label="Clear"/><br>
              <q-btn v-if="isProposalActive===1" icon="info" no-caps class="q-ma-lg" label="Proposal Active" @click="dialogInfoService()" />
              <q-btn v-else icon="info" class="q-ma-lg" no-caps label="No Active Proposal" @click="dialogInfoService()" />
            </div>
      </q-card-section>
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
      submitData: {
        currentAccountName: '',
        eosaccount: null,
        cap: 1,
        percentage: 0.0,
        threshold: 0.0,
        ratesleft: 0,
        locked: false,
        tokenType: 'OPTION'
      },
      submitData1: {
        NFTAccountName: '',
        nftKey: null
      },
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  created () { // for automatic logout
    document.addEventListener('beforeunload', this.handler)
    this.getActionProposal()
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
      accrued: state => state.account.proposalInfo.proposalInfo.accrued
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
        .then(response => {
          this.setProposalActive(1)
          this.getActionProposal()
          self.resetForm()
        })
    },
    yourOpenFn () {
      console.log('yourOpenFn invoked.')
    },
    yourCloseFn () {
      console.log('yourCloseFn invoked.')
    },
    submit1 () {
      this.submitData1.NFTAccountName = this.accountName
      console.log('submitData1 = ', this.submitData1)
      this.actionUnlockNFT(this.submitData1)
        .then(response => {
          // self.getAccountInfo()
          this.submitData1.NFTAccountName = '' // reset mini-form
        })
    },
    dialogInfoService () {
      this.dialoginfo = true
      this.getActionProposal()
    },
    breset () {
      this.submitData.currentAccountName = this.accountName
      this.proposalRemove(this.accountName)
      this.setProposalActive(0)
      this.getActionProposal()
        .then(response => {
          // this.setProposalActive(0)
        })
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
</style>

// push action freeosdiv unlocknft '{"nft_id":3}' -p freeosfreeos@active
