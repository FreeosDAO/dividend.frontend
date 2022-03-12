<template>
  <div class="text-white text-left q-pa-md flex flex-center">
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
        <h6>{{this.v_string}} current</h6> - <u>This version start new branch</u> &nbsp; <b style="color:#4fa9e9">'io-changes'</b> &nbsp; reflecting input/output changes to remove display update delays
        and flickering. <br>Primary change: Type (VIP or other) of logged in account is verified at the very beginning.
        Pages inappropriate for the current user doesn't appear on the screen (E.g. proposal page is not displayed
        for voter, etc.)<br>
        Changes on proposal page. Separating page behavior for active and non-active proposal. Lock screen if there is already
        active proposal. So it is possible only waiting for voting, expiration, or cancellation by the proposer. These events bring page
        back to the edit mode where new proposal may be entered. This mechanism prevents situations where backend is enforced
        by the frontend to display unnecessary error messages.
        <h6>v0.96</h6> - removed button 'Info' from proposal page as it duplicate info 'No Active/Active Proposal/Timer' above the separator.
        - removed "Select Policy" text from the top of proposal page.<br>
        - Added error message "You are not the proposer" for the proposal submit button.<br>
        - On Analytics Page: Changed 'Data Update' to 'Update Data'<br>
        - On all PVA (Proposal, Vote, Analytics) pages changed DAO to FreeDAO
        <h6>v0.95</h6> - removed '2nd voter solver' solution, acknowledge functionality of all pages.
        <h6>v0.94</h6> - '2nd voter solver' and shading of Submit button in Vote.vue for new events.
        <h6>v0.93</h6> - the last working version before adding '2nd voter solver'.
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
