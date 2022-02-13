<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto" style="max-width: 550px">
    <q-card flat
      class="uxblue"
    >
      <q-card-section>
            <!-- <div id="nav" class="text-h6 text-center q-ma-lg"> -->
              <div class="text-h5 text-center">
              <span id="text">Create NFT Proposal</span></div>
        <!-- Dialog --- for proposal cancellation -->
        <!--                                      -->
        <div class="q-pa-md">
          <q-dialog v-model="dialogreset">
            <q-card class="uxdialog">
              <q-card-section class="row items-center q-gutter-sm">
          <q-toolbar>
            <q-toolbar-title>Remove Active Blockchain Proposal</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"></q-btn>
          </q-toolbar>
              </q-card-section>
              <!-- Removal of proposal is fully allowed - no special condition: -->
              <q-card-section v-if="!isVoted" class="row items-center q-gutter-sm">
                <q-btn outline class="q-ma-lg" style="color:#4fa9e9" no-caps @click="breset()" label="Cancel Active Proposal"/>
                <!-- <q-btn outline label="Close Dialog" style="color:#4fa9e9" no-caps v-close-popup></q-btn> -->
              </q-card-section>
              <!-- 2nd voter solver --- Special case of proposal removal - actions to avoid software glitch: -->
              <q-card-section v-else>
                <q-btn outline class="q-ma-lg" style="color:#4fa9e9" no-caps @click="dialogreset = false" label="Abort proposal cancellation"/>
                <q-btn outline class="q-ma-lg" style="color:#4fa9e9" no-caps @click="pushToVoter()" label="Push to the second voter"/>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
<!-- end of DIALOG -->
<!-- Dialog Info Content -->
        <div class="q-pa-md">
          <q-dialog v-model="dialoginfo">
            <q-card style="uxdialog">
                <q-card-section class="row items-center q-gutter-sm uxdialog">
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
                  Select Policy:
                  <q-btn-toggle no-caps flat
                    spread
                    v-model="submitData.cap"
                    push
                    toggle-color="blue-4"
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
                  <q-input
                    input-style="color: #00ADEE"
                    v-model="submitData.eosaccount"
                    type="text"
                    outlined
                    dense
                  />
                </div>
              </div>
              <!-- Percentage Section -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  % for the Account
                </div>
                <div class="col-xs-7 col-sm-7">
                  <q-input
                  input-style="color: #00ADEE"
                  dense
                  outlined v-model="submitData.percentage" />
                </div>
              </div>
              <!-- Threshold conditional section -->
              <div v-if="submitData.cap!==1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Threshold Point
                </div>
                <div class="col-xs-7 col-sm-7">
                  <q-input outlined
                    input-style="color: #00ADEE"
                    v-model="submitData.threshold" label="POINT"
                    placeholder='0.0000' dense >
                  </q-input>
                </div>
              </div>
              </div>
              <!-- rates_left conditional section -->
              <div v-if="submitData.cap===1">
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                <div class="col-xs-5 col-sm-4 text-left">
                  Iterations to pay
                </div>
                <div class="col-xs-7 col-sm-7">
                  <q-input
                    input-style="color: #00ADEE"
                    class="form-control"
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
                <div class="col-xs-5 col-sm-4 text-left">
                  Locked
                </div>
                <div class="col-xs-7 col-sm-7">
                <q-toggle
                  size="xl"
                  keep-color
                  checked-icon="check"
                  v-model="submitData.value"
                  color="blue"
                ></q-toggle>
                </div>
              </div>
              </div>
            </div>
            <div class="flex justify-center">
              <q-btn outline class="q-ma-lg uxblue" no-caps @click="resetForm()" label="Clear Form"/>
              <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit" :disable="!isFormFilled"/>
              <q-btn outline class="q-ma-lg uxblue" no-caps label="Info">
                 <q-tooltip
                     content-class="uxdialog"
                     transition-show="scale"
                     transition-hide="scale"
                 >
                     <p style="font-size: 0.8rem;">Proposal Information <br>
                      Proposal (acct) {{propaccount}}<br>
                      Percentage {{proposal_percentage}}<br>
                      Expiration {{expires_at}}</p>
                 </q-tooltip>
              </q-btn>
            </div>
      </q-card-section>
      <div class="q-ma-lg" v-if="activeProposal"> Proposal Active &nbsp; {{expiration_timer}}</div>
      <div class="q-ma-lg" v-else> No Active Proposal </div>
    </q-card>
    <!-- </q-card> -->
    <!-- Clear/Submit Form section -->
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
          <q-separator color="blue"></q-separator>
          <!--  unlock dialog  -->
          <div class="row items-center q-gutter-sm">
            <q-btn outline no-caps label="Cancel Proposal" class="uxblue" @click="dialogreset = true"></q-btn>
            <q-btn outline no-caps label="Unlock NFT" class="uxblue" @click="dialog = true"></q-btn>
            <q-btn outline no-caps label="NFT List" class="uxblue" @click="$router.push('/customer')"></q-btn>
            <q-btn outline no-caps label="Analytics" class="uxblue" @click="$router.push('/analytics')"></q-btn>
              <q-dialog rounded v-model="dialog" style="uxdialog">
              <q-card style="max-width: 350px" class="uxdialog">
                          <q-toolbar>
            <q-toolbar-title>Unlock Given NFT</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"></q-btn>
          </q-toolbar>
                <q-card-section class="row items-center start q-gutter-sm" style="uxdialog">
                  <!-- NFT key section -->
                  <div style="align-items: uxdialog center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
                    <div class="col-xs-5 col-sm-4 text-right">
                      Enter the Key of NFT to unlock
                    </div>
                    <div class="col-xs-1 col-sm-2"></div>
                    <div class="col-xs-6 col-sm-6">
                      <q-input
                        input-style="color: #00ADEE"
                        v-model="submitData1.nftKey"
                        type="number"
                        outlined
                        dense
                        placeholder=0
                      />
                    </div>
                  </div>
                  <!--   -->
                  <div>
                    <q-btn no-caps outline class="q-ma-lg" style="color:#4fa9e9" @click="submit1()" label="Unlock"/>
                    <!-- <q-btn no-caps outline label="Close dialog" class="start" v-close-popup></q-btn> -->
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
          <!-- -->
        </div>
      </div>
    </div>
    <q-separator color="blue"></q-separator>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Proposal',
  data () {
    return {
      tab: 'send',
      dialog: false,
      dialogreset: false, // If true and proposal already voted display pop-up window. TODO make it faster.
      dialoginfo: false,
      activeProposal: false, // if false - no active proposal
      expiration_timer: 0.0,
      isProposerActive: false,
      submitData: {
        currentAccountName: '',
        eosaccount: null,
        cap: 1,
        percentage: 0.0,
        threshold: 0,
        ratesleft: 0,
        locked: false
      },
      submitData1: {
        NFTAccountName: '',
        nftKey: null
      },
      submitData2: { // used for so called '2nd voter problem'.
        currentAccountName: '',
        secondVoterName: ''
      },
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  created () {
    this.isProActive()
    this.getVoteStatus() // new
    this.setIntervalId = setInterval(() => {
      this.getActionProposal()
      this.isProActive()
      this.getVoteStatus() // new
      console.log('in Proposal')
    }, 30000) // call each 30 sec after the tests
    document.addEventListener('beforeunload', this.handler)
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      secondVoterName: state => state.account.secondVoterName,
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
      isVoted: state => state.account.isVoted // '2nd Voter solver'
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
    ...mapActions('account', ['reqVoterAct']), // '2nd voter problem' solving
    ...mapActions('account', ['getActionProposal', 'getVoteStatus']),
    ...mapMutations('account', ['hideModal']),
    submit () {
      const self = this
      console.log('TOKEN: ', `${parseFloat(this.submitData.threshold).toFixed(process.env.TOKEN_PRECISION)} ${process.env.TOKEN_NAME}`)
      this.submitData.currentAccountName = this.accountName
      console.log('PROPOSAL DATA=', this.submitData)
      this.proposalNew(this.submitData)
      // .then(response => { // TODO remove it
      // this.setProposalActive(1) // TODO ?? remove it
      this.getActionProposal() // updates info on proposal
      self.resetForm()
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
    pushToVoter () { // sends message to not-voting voter through trigger contract
      console.log('pushToVoter()')
      this.dialogreset = false
      this.submitData2.secondVoterName = this.secondVoterName // TODO maybe use getter to setup data directly?
      this.submitData2.currentAccountName = this.accountName
      this.reqVoterAct(this.submitData2) // call request for 2nd voter action
      //
    },
    isProActive () {
      if ((this.eosaccount !== 'empty') && (this.eosaccount !== 'erased')) {
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
      } else { // proposal 'empty' or 'erased'
        this.activeProposal = false // no active proposal
        this.expiration_timer = 0.0
      }
    },
    breset () { // safely removes active proposal
      this.submitData.currentAccountName = this.accountName
      this.proposalRemove(this.accountName)
      this.setProposalActive(0)
      this.getActionProposal() // todo verify - does it exists
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
  } // methods
}
</script >

<style language=scss>
nav {
  display: inline-block;
  height: 20px;
  margin: 10px;
  padding: 2px;
}
.uxdialog {
background-color: rgb(28, 44, 56);
color: rgb(0,172,239);
border-radius: 1.25rem;
border-color: #00ADEE;
border-style: solid;
}
.uxblue {
background-color: #1C2C38;
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
input {
  color: white;
}
.Row {
  display: table;
  width: 100%; /*Optional*/
  table-layout: fixed; /*Optional*/
  border-spacing: 10px; /*Optional*/
}
.form-control {
    background-color: transparent;
    color: red;
}
textarea:focus, input:focus {
    color: #00ADEE;
}
#div1{
  color:yellow;
}
#div2{
  color:lightblue;
}
.q-if-control {
  color: blue !important;
}
.q-field__input{
color:#00ADEE !important;
}
.Column {
  display: table-cell;
}
h5 {
    color: #00ADEE;
    font-size: 1.0em;
    position: relative;
    left: 5px;
}
#info {
    height: 100px;
    width: 300px;
}
.infotext {
    color: #00ADEE;
    font-size: 0.9em;
    position: relative;
    left: 5px;
}
</style>
