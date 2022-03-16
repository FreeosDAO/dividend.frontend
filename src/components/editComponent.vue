<template>
  <!-- editComponent - serves only preparation of a new proposal under condition that there is
  no current proposal. -->
  <q-card flat
          class="uxblue"
  >
    <q-card-section>
      <!-- <div id="nav" class="text-h6 text-center q-ma-lg"> -->
      <!-- === START OF EDITING PART === -->
      <div style="max-width: 500px; margin: 0 auto;">
        <!-- Select correct roi cap -->
        <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-6 col-sm-6">
            <!-- Select Policy: -->
            <q-btn-toggle
                          no-caps
                          spread
                          flat
                          v-model="submitData.cap"
                          push
                          toggle-color="white"
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
        <div style="align-items: center;"
             class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
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
        <div v-if="submitData.cap!==1"> cap &nbsp;{{submitData.cap}}
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
        <div v-if="submitData.cap===1">cap &nbsp;{{submitData.cap}}
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
      <!-- === END OF EDITING PART === -->
      <div class="flex justify-center">
        <q-btn outline class="q-ma-lg uxblue" no-caps @click="resetForm()" label="Clear Form"/>
        <!-- todo remove <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit" :disable="!isFormFilled"/> todo -->
        <!-- Submit Button Service -->
        <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit" :disable="!isFormFilled" />
          <q-tooltip  v-if="!isFormFilled"
            transition-show="scale"
            transition-hide="scale"
            content-class="uxdialog"
            class="q-ma-sm text-subtitle2"
          >
            <div> Form is not filled up.</div>
          </q-tooltip>
        </div>
        <!-- end of Submit Button service -->
    </q-card-section>
    <!-- <div class="q-ma-lg" v-if="activeProposal"> Active Proposal expire in: &nbsp; &nbsp; {{expiration_timer}}</div>
    <div class="q-ma-lg" v-else> No Active Proposal </div> -->
  </q-card>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'editComponent',
  data () {
    return {
      submitData: {
        currentAccountName: '',
        eosaccount: null,
        cap: 1,
        percentage: 0.0,
        threshold: 0,
        ratesleft: 0,
        locked: false
      }
    } // closes return
  }, // closes data
  methods: {
    ...mapActions('proposal', ['proposalNew']),
    submit () {
      // const self = this
      console.log('TOKEN: ', `${parseFloat(this.submitData.threshold).toFixed(process.env.TOKEN_PRECISION)} ${process.env.TOKEN_NAME}`)
      this.submitData.currentAccountName = this.accountName
      console.log('PROPOSAL DATA=', this.submitData)
      // this.proposalNew(this.submitData) // TODO (this is async!!!)
      // this.$router.push('/propintermed')
      console.log('propintermed submit end')
      this.proposalNew(this.submitData)
        .then(() => {
          // callback function after success call to the server
          console.log('propintermed in then !!!')
          this.$router.push('/propintermed')
        })
        .catch(() => {
          // error callback function
          console.log('propintermed callback error !!!')
        })
    } // closes submit
  }, // closes methods
  computed: {
    ...mapState({
      accountName: state => state.account.accountName
    }),
    isFormFilled () {
      let a = false
      if (this.submitData.cap === 1) a = ((this.submitData.percentage > 0) && (this.submitData.ratesleft > 0))
      else a = ((this.submitData.percentage > 0) && (this.submitData.threshold > 0))
      return a
    },
    // changeRoute (route) { // TODO
    // // `route` is either a string or object
    // return this.$router.push(route)
    // },
    conditions () {
      // exists active proposal on backend
      const result = this.activeProposal
      console.log('conditions results=', result)
      return result
      // if return = false - submit button visible
    }
    // ===
  } // closes computed
} // closes default
</script>

<style>

</style>
