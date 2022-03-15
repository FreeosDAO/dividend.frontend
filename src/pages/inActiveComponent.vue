<template>
  <q-card flat
          class="uxblue"
  >
    <q-card-section>
      <!-- <div id="nav" class="text-h6 text-center q-ma-lg"> -->
      <!-- Dialog --- for proposal cancellation -->
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
      <!-- Dialog Info Content
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
      end of Dialog Info Content -->
      <!-- === START OF EDITING PART === This is only used to enter new proposal and this part should be
      invisible if proposal is active -->
      <div style="max-width: 500px; margin: 0 auto;">
        <!-- Select correct roi cap -->
        <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-6 col-sm-6">
            <!-- Select Policy: -->
            <q-btn-toggle v-if="!this.activeProposal"
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
            <q-btn-toggle v-else
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
            <q-input v-if="!this.activeProposal"
                     input-style="color: #00ADEE"
                     v-model="submitData.eosaccount"
                     type="text"
                     outlined
                     dense
            />
            <div v-else>{{this.propaccount}}</div>
          </div>
        </div>
        <!-- Percentage Section -->
        <div style="align-items: center;"
             class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-5 col-sm-4 text-left">
            % for the Account
          </div>
          <div class="col-xs-7 col-sm-7">
            <q-input v-if="!this.activeProposal"
                     input-style="color: #00ADEE"
                     dense
                     outlined v-model="submitData.percentage" />
            <div v-else>{{this.proposal_percentage}}</div>
          </div>
        </div>
        <!-- Threshold conditional section -->
        <div v-if="submitData.cap!==1"> cap &nbsp;{{submitData.cap}}
          <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-xs-5 col-sm-4 text-left">
              Threshold Point
            </div>
            <div class="col-xs-7 col-sm-7">
              <q-input outlined v-if="!this.activeProposal"
                       input-style="color: #00ADEE"
                       v-model="submitData.threshold" label="POINT"
                       placeholder='0.0000' dense >
              </q-input>
              <div v-else>{{this.threshold}}</div>
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
              <q-input v-if="!this.activeProposal"
                       input-style="color: #00ADEE"
                       class="form-control"
                       v-model="submitData.ratesleft"
                       type="number"
                       outlined
                       dense
              />
              <div v-else>{{this.rates_left}}</div>
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
        <div v-if="!this.conditions()"> <!-- Process Submit further -->
          <q-btn outline class="q-ma-lg uxblue" no-caps @click="submit()" label="Submit" :disable="!isFormFilled" />
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            content-class="uxdialog"
            class="q-ma-sm text-subtitle2"
          >
            <div>
              <h6 v-if="!isFormFilled">The proposal is not filled up.</h6>
            </div>
          </q-tooltip>
          conditions:{{this.conditions()}}
        </div>
        <div v-else> <!-- inactivate submit due to different reasons - Conditions ON-->
          <q-btn class="q-ma-lg uxblue" outline disable no-caps label="Submit" />
          <q-tooltip
            transition-show="scale"
            transition-hide="scale"
            content-class="uxdialog"
            class="q-ma-sm text-subtitle2"
          >
            <div id="app">
              <h6 v-if="activeProposal"> Proposal is Active. Before changes consider to
                remove the current proposal.</h6>
            </div>
          </q-tooltip>
        </div>
        <!-- end of Submit Button service -->
        <!-- <q-btn outline class="q-ma-lg uxblue" no-caps label="Info">
           <q-tooltip
               content-class="uxdialog"
               transition-show="scale"
               transition-hide="scale"
           >
                <h7 v-if="!activeProposal">No ActivProposal Expired</h7><br>
                Proposal (acct) {{propaccount}}<br>
                Percentage {{proposal_percentage}}<br>
                Expiration {{expires_at}}
           </q-tooltip>
        </q-btn> todo for consideration -->
      </div>
    </q-card-section>
    <div class="q-ma-lg" v-if="activeProposal"> Active Proposal expire in: &nbsp; &nbsp; {{expiration_timer}}</div>
    <div class="q-ma-lg" v-else> No Active Proposal </div>
  </q-card>
</template>

<script>
export default {
  name: 'inActiveComponent'
}
</script>

<style scoped>

</style>
