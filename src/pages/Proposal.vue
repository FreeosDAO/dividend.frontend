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
            <div class="text-h6 text-center q-ma-lg">Create NFT Proposal {{eosaccount}}</div>
<!-- Dialog -->
        <div class="q-pa-md">
          <q-btn flat justify-center label="(Remove Active)" color="white" @click="dialog = true"></q-btn>

          <q-dialog v-model="dialog">
            <q-card>
              <q-card-section class="row items-center q-gutter-sm"> <!-- TODO -->
                Remove Active Blockchain Proposal
                <q-btn class="q-ma-lg" color="orange" no-caps @click="breset()" label="DO IT!"/>
                <q-btn no-caps label="Close dialog" color="primary" v-close-popup></q-btn>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
<!-- end of DIALOG -->
            <div style="max-width: 500px; margin: 0 auto;">
              <!-- Select corect roi cap -->
              <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs"> -->
                <div class="col-xs-5 col-sm-4 text-right">
                  Policy cap
                </div>
                <div class="col-xs-1 col-sm-2"></div>
                <div class="col-xs-6 col-sm-6">
                  <q-btn-toggle
                    v-model="submitData.cap"
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
                  EOS account
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
                  Percentage {{submitData.cap}}
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
                  Rates to pay
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
              <q-btn class="q-ma-lg" color="primary" no-caps @click="submit()" label="Submit" :disable="!isFormFilled"/>
              <q-btn class="q-ma-lg" color="secondary" no-caps @click="resetForm()" label="Clear"/>
            </div>
      </q-card-section>
    </q-card>
    {{eosaccount}}
      </q-card>
      <div id="q-app" style="min-height: 100vh;">
        <div class="q-pa-md">
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
          <div class="q-pa-md">
            <q-btn outline label="Unlock NFT" color="secondary" @click="dialog = true"></q-btn>
            <q-btn outline label="NFT List" color="primary" @click="$router.push('/customer')"></q-btn>
            <q-btn outline label="Analytics" color="primary" @click="$router.push('/analytics')"></q-btn>
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
                        v-model="submitData.nftKey"
                        type="number"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                  <!--   -->
                  <div>
                    <q-btn class="q-ma-lg" color="orange" no-caps @click="submit()" label="Unlock"/>
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
      submitData: {
        currentAccountName: '',
        eosaccount: null,
        cap: 1,
        percentage: 0.0,
        threshold: null,
        ratesleft: 0,
        locked: false,
        tokenType: 'OPTION'
      },
      isShowApprovedDialog: false,
      isShowFailedDialog: false
    }
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      eosaccount: state => state.account.proposalInfo.eosaccount,
      value: state => state.analytics.circInfo,
      progress1: state => state.analytics.progress1,
      progress2: state => state.analytics.progress2,
      progressLabel1: state => state.analytics.progressLabel1,
      progressLabel2: state => state.analytics.progressLabel2
    }),
    isFormFilled () {
      let a = false
      if (this.submitData.cap === 1) a = ((this.submitData.percentage > 0) && (this.submitData.ratesleft > 0))
      else a = ((this.submitData.percentage > 0) && (this.submitData.threshold > 0))
      return a
    }
  },
  methods: {
    ...mapActions('proposal', ['proposalNew', 'proposalRemove']),
    ...mapActions('account', ['getActionProposal']),
    submit () {
      const self = this
      console.log(`${parseFloat(this.submitData.threshold).toFixed(process.env.TOKEN_PRECISION)} ${this.submitData.tokenType}`)
      this.submitData.currentAccountName = this.accountName
      this.proposalNew(this.submitData)
        .then(response => {
          // self.getAccountInfo()
          self.resetForm()
        })
    },

    breset () {
      this.submitData.currentAccountName = this.accountName
      this.proposalRemove(this.accountName)
        .then(response => {
          // self.getAccountInfo()
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

<style scoped>
</style>
// cleos --url https://proton-testnet.eosphere.io:443
// push action freeosdiv unlocknft '{"nft_id":3}' -p freeandyandy@active
