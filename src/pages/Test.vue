<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center">
    <div>
      <div>Current Configuration .env <br>
        <table left>
          <tr><td>APP_NAME:</td><td>{{this.app_name}}</td></tr>
          <tr><td>NETWORK_HOST:</td><td>{{this.network_host}}</td></tr>
          <tr><td>NETWORK_PORT:</td><td>{{this.network_port}}</td></tr>
          <tr><td>NETWORK_PROTOCOL:</td><td>{{this.network_protocol}}</td></tr>
          <tr><td>NETWORK_CHAIN_ID:</td><td>{{this.network_chain_id}}</td></tr>
          <tr><td>APP_CHAIN_ENDPOINT:</td><td>{{this.app_chain_endpoint}}</td></tr>
          <tr><td>TOKEN_NAME:</td><td>{{this.token_name}}</td></tr>
          <tr><td>TOKEN_PRECISION:</td><td>{{this.token_precision}}</td></tr>
          <tr><td>V_STRING:</td><td>{{this.v_string}}</td></tr>
        </table>
      </div>
      <div>
        {{this.v_string}} - v.0.96 - removed button 'Info' from proposal page as it duplicate info 'No Active/Active Proposal/Timer' above the separator. Also displaying by 'Info' information on content of expired proposal may have no usability (CONSIDER) for the proposer.
        - removed "Select Policy" text from the top of proposal page.
        - Added error message "You are not the proposer" for the submit button.
        - On Analytics Page: Changed 'Data Update' to 'Update Data'
        - On all PVA (Proposal, Vote, Analytics) pages changed DAO to FreeDAO
        v0.95 - removed '2nd voter solver' solution, acknowledge functionality of all pages.<br>
        v0.94 - '2nd voter solver' and shading of Submit button in Vote.vue for new events.<br>
        v0.93 - the last working version before adding '2nd voter solver'. <br>
      </div>
      <div class="text-h2" style="opacity:.4">
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      app_name: process.env.APP_NAME,
      network_host: process.env.NETWORK_HOST,
      network_port: process.env.NETWORK_PORT,
      network_protocol: process.env.NETWORK_PROTOCOL,
      network_chain_id: process.env.NETWORK_CHAIN_ID,
      app_chain_endpoint: process.env.APP_CHAIN_ENDPOINT,
      token_name: process.env.TOKEN_NAME,
      token_precision: process.env.TOKEN_PRECISION,
      v_string: process.env.V_STRING
    }
  }
}
</script>
<style>
table, th, td {
  border: 1px solid black;
}
</style>
