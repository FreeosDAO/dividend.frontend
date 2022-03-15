<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md q-mx-auto uxblue" style="max-width: 550px">
      <div class="text-h5 text-center">
        <span id="text">Create NFT Proposal</span>
      </div>
      <q-card flat
              class="uxblue"
      >
        <component :is="comp" />
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
          <span class="infotext">FreeDAO</span>
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
import { mapState, mapActions } from 'vuex'
// import editComponent from '../components/editComponent.vue'
// import activeComponent from '../components/activeComponent.vue'
const activeComponent = () => import('../components/activeComponent.vue')
const editComponent = () => import('../components/editComponent.vue')
// let activeProposal
export default {
  name: 'Proposal',
  components: {
    editComponent,
    activeComponent
  },
  data () {
    return {
      tab: 'send',
      // comp: '',
      dialog: false,
      dialogreset: false,
      dialoginfo: false, // todo remove
      activeProposal: this.isProposalActive, // Setup by 'VerifyProposalActive' in 'action.js' line 189. This is main
      // indicator of active proposal on this page. If false - no proposal active.
      expiration_timer: 0.0, // clock
      isProposerActive: false, // is set up by local function (not Vuex) // todo verify is required
      submitData1: {
        NFTAccountName: '',
        nftKey: null
      },
      // submitData2: { // used for so called '2nd voter problem'.
      //  currentAccountName: '',
      //  secondVoterName: ''
      // },
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  created () {
    this.isProActive() // todo remove??
    this.setIntervalId = setInterval(() => { // todo interval not needed remove??
      // this.getActionProposal() // call in layout is enough - reads active proposal data
      // this.isProActive() // todo this is temporarily locked - remove??
      console.log('in Proposal')
    }, 30000) // call each 30 sec after the tests
    document.addEventListener('beforeunload', this.handler)
    this.isProposer()
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId)
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      propaccount: state => state.account.proposalInfo.proposalInfo.eosaccount, // account 'inside proposal'
      value: state => state.analytics.circInfo,
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2,
      roi_target_cap: state => state.account.proposalInfo.proposalInfo.roi_target_cap,
      proposal_percentage: state => state.account.proposalInfo.proposalInfo.proposal_percentage,
      locked: state => state.account.proposalInfo.proposalInfo.locked,
      expires_at: state => state.account.proposalInfo.proposalInfo.expires_at, // prefetched by page
      threshold: state => state.account.proposalInfo.proposalInfo.threshold,
      rates_left: state => state.account.proposalInfo.proposalInfo.rates_left,
      accrued: state => state.account.proposalInfo.proposalInfo.accrued,
      // Delivered by the VerifyProposalActive in actions.js line 189, called in propintermed.vue line 25/
      isProposalActive: state => state.account.isProposalActive // prefetched once by propintermed page
    }),
    comp () {
      console.log('comp is.ProposalActive', this.isProposalActive)
      if (this.isProposalActive) {
        return activeComponent
      } else {
        return editComponent
      }
    }
    // ...mapGetters('account', ['isProposalActive']),
  },
  methods: {
    ...mapActions('proposal', ['proposalNew', 'proposalRemove', 'actionUnlockNFT']),
    ...mapActions('account', ['getActionProposal']),
    submit1 () {
      this.submitData1.NFTAccountName = this.accountName
      console.log('submitData1 = ', this.submitData1)
      this.actionUnlockNFT(this.submitData1)
      this.submitData1.NFTAccountName = '' // reset mini-form
    },
    isProActive () { // todo rewrite
      // Note: Only expiration is enough to be tested. 'erase' or 'empty' conditions are always reflected by expiration.
      // NOTE: IF not expired that means proposal is active.
      this.expires = (this.expires_at * 1000) // normalize UTC formats
      // http://jsfiddle.net/JamesFM/bxEJd/
      const timestamp = Date.now()
      if (timestamp > this.expires) {
        this.activeProposal = false // no active proposal
        this.expiration_timer = 0.0
        console.log('isProActive expired_at', this.expires_at, 'no active proposal') // todo it is misguiding
      } else { // timestamp <= this.expires current time below expiration time
        this.activeProposal = true // active proposal exists on backend
        this.submitData.cap = this.roi_target_cap // Necessary for passive screen display when in non-edit mode.
        this.expiration_timer = (this.expires - timestamp) / 60000 // display in minutes and parts of minutes todo change to seconds
        this.expiration_timer = this.expiration_timer.toFixed(2) // todo change to seconds
      }
    },
    breset () { // safely removes active proposal from backend
      this.submitData.currentAccountName = this.accountName
      this.proposalRemove(this.accountName)
      // this.getActionProposal() // todo verify
      // this.activeProposal = false // temporary update activeProposal before be updated from backend each 30s.
      this.dialogreset = false // todo not clear usage
      this.$router.push('/propintermed')
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
  } //, // methods
  // watch: {
  // isProposalActive: {
  // immediate: true,
  // handler: function (val) {
  // //
  // // this.$router.push('/propintermed')
  // console.log('isProposalActive Change')
  // if (val && this.$route.query.returnUrl) {
  // this.$router.push({ path: this.$route.query.returnUrl })
  // }
  // }
  // }
  // }
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
