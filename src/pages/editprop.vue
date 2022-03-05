<template>
  <div style="max-width: 500px; margin: 0 auto;">
    <!-- Select correct roi cap -->
    <div style="align-items: center;" class="row justify-center q-mb-md q-pl-md q-pr-md q-ml-md q-mr-md q-pb-xs">
      <div class="col-xs-6 col-sm-6">
        <!-- Select Policy: -->
        <q-btn-toggle no-caps
                      spread
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
</template>

<script>
export default {
  name: 'editprop.vue'
}
</script>

<style>

</style>
