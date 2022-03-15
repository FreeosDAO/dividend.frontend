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
      <!-- === START OF DATA DISPLAY PART === This is only used if already is active proposal in the backend. -->
      <div style="max-width: 500px; margin: 0 auto;">
        <!-- Select correct roi cap -->
        <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-6 col-sm-6">
            <!-- Passive data display Select Policy: -->
            <q-btn-toggle
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
            <div>{{this.propaccount}}</div>
          </div>
        </div>
        <!-- Percentage Section -->
        <div style="align-items: center;"
             class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
          <div class="col-xs-5 col-sm-4 text-left">
            % for the Account
          </div>
          <div class="col-xs-7 col-sm-7">
            <div>{{this.proposal_percentage}}</div>
          </div>
        </div>
        <!-- Threshold conditional section -->
        <div v-if="submitData.cap!==1"> cap &nbsp;{{submitData.cap}}
          <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
            <div class="col-xs-5 col-sm-4 text-left">
              Threshold Point
            </div>
            <div class="col-xs-7 col-sm-7">
              <div>{{this.threshold}}</div>
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
              <div>{{this.rates_left}}</div>
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
              <q-toggle /> <!-- todo rewrite lock only to display data -->
                size="xl"
                keep-color
                checked-icon="check"
                v-model="submitData.value"
                color="blue"
              >
            </div>
          </div>
        </div>
      </div>
      <!-- === END OF DATA DISPLAY PART PART === -->
      <div class="flex justify-center">
        <!-- todo 'proposal cancel' button here -->
      </div>
    </q-card-section>
    <div class="q-ma-lg"> Active Proposal expire in: &nbsp; &nbsp; {{expiration_timer}}</div>
  </q-card>
</template>

<script>
export default {
  name: 'activeComponent'
}
</script>

<style scoped>

</style>
