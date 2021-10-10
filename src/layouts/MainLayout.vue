<template>
  <q-layout view="hHh Lpr fFf">

    <q-header reveal bordered class="uxblue" height-hint="90">
      <q-toolbar bordered class="ux_bar text-uxblue" style="justify-content: space-between; ux_bar">
        <q-btn :style="'visibility: ' + (isAuthenticated ? 'visible' : 'hidden')" dense flat round icon="menu" @click="drawer = !drawer" />
        <q-btn v-if="isAuthenticated" flat no-caps color="white" label="Dividend Compute" @click="DividendCompute()"
          style="width: 150px"
        ></q-btn>
        <!-- <div v-if="isAuthenticated">{{this.version}}</div> -->
        <div style="display: flex; align-items: center;">
          <img width="35" src="~assets/decentralised.jpg"> &nbsp; &nbsp;
          <div v-if="isAuthenticated" style="margin-right: 1rem;">{{accountName}}</div>
          <q-btn color="primary" label="Login" v-if="!isAuthenticated" @click="() => connectWallet('anchor')">
          </q-btn>
          <q-btn v-if="isAuthenticated" flat no-caps style="justify-self: flex-end;" label="Logout" @click="() => logout()"></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :width="200"
      :breakpoint="800"
      content-class="uxdrawer"
    >
      <q-scroll-area class="fit">
        <q-list class="uxdrawer">
          <template v-for="(menuItem, index) in menuList">
            <q-item
                :key="index" clickable :active="selectedItemLabel === menuItem.label" active-class="uxdraweract" v-ripple @click="onSelectMenu(menuItem)">
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
            </q-item>
            <q-separator class="uxblue1" :key="'sep' + index" v-if="menuItem.separator" />
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
// import WalletLoginDialog from 'components/accountManagement/WalletLoginDialog'
import { mapState, mapActions, mapGetters } from 'vuex'
// import { getwhitelistTable } from 'src/store/account/actions'
const menuList = [
  {
    icon: 'monetization_on',
    label: 'Proposal',
    separator: true,
    route: '/proposal'
  },
  {
    icon: 'swap_horiz',
    label: 'Vote',
    separator: true,
    route: '/vote'
  },
  {
    icon: 'get_app',
    label: 'Customer',
    separator: true,
    route: '/customer'
  },
  {
    icon: 'get_app',
    label: 'Analytics',
    separator: true,
    route: '/analytics'
  },
  {
    icon: 'get_app',
    label: 'Test',
    separator: true,
    route: '/test'
  }
]
export default {
  data () {
    return {
      version: '',
      isShowDrawerButton: false,
      drawer: false,
      selectedItemLabel: null,
      tokenType: '',
      dataload: {
        progress1: 0.0,
        progress2: 0.0,
        progressLabel1: '%',
        progressLabel2: '%'
      },
      menuList
    }
  },
  created () {
    this.getEwsTable()
    this.getByUserTotal()
    // Count current bar values
    this.progress1 = this.value
    this.progress2 = (1.00 - this.value)
    this.working = this.value * 100
    this.progressLabel1 = String(this.working.toFixed(2)) + '%'
    // this.progressLabel1 = String(this.value * 100) + '% - to Investors'
    this.progressLabel2 = String(100 - this.working) + '%'
    // this.progressLabel2 = String(100 - (this.value * 100)) + '% - to DAO'
    console.log('value on layout =', this.progress1, this.progress2)
    // Store counted bar values to Vuex:
    this.dataload.progress1 = this.progress1
    this.dataload.progress2 = this.progress2
    this.dataload.progressLabel1 = this.progressLabel1
    this.dataload.progressLabel2 = this.progressLabel2
    this.updateLoading(this.dataload)
    // set interval - other TODO
    this.setIntervalId1 = setInterval(() => {
      this.getEwsTable()
      this.getByUserTotal()
      // Count current bar values
      this.progress1 = this.value
      this.progress2 = (1.00 - this.value)
      this.working = this.value * 100
      this.progressLabel1 = String(this.working.toFixed(2)) + '%'
      // this.progressLabel1 = String(this.value * 100) + '% - to Investors'
      this.progressLabel2 = String(100 - this.working) + '%'
      // this.progressLabel2 = String(100 - (this.value * 100)) + '% - to DAO'
      console.log('values on loop =', this.progress1, this.progress2)
      // Store counted bar values to Vuex:
      this.dataload.progress1 = this.progress1
      this.dataload.progress2 = this.progress2
      this.dataload.progressLabel1 = this.progressLabel1
      this.dataload.progressLabel2 = this.progressLabel2
      this.updateLoading(this.dataload)
    }, 30000) // call each 30 sec after the tests
    // document.addEventListener('beforeunload', this.handler)
    this.checkIfLoggedIn()
    // this.initiateValues() // TODO
    this.getwhitelistTable()
    this.version = process.env.V_STRING
  },
  beforeDestroy () {
    clearInterval(this.setIntervalId1)
  },
  computed: {
    ...mapState({
      accountName: state => state.account.accountName,
      value: state => state.analytics.circInfo // value is read from Vuex
    }),
    ...mapGetters('account', ['isAuthenticated', 'connecting'])
  },
  methods: {
    ...mapActions('analytics', ['getEwsTable', 'getByUserTotal']),
    ...mapActions('analytics', ['updateLoading']),
    onSigninFinish (event) {
      if (event.isFinished) {
        this.isShowDrawerButton = true
        this.drawer = true
        this.onSelectMenu(menuList[0])
      }
    },
    initiateValues () {
      this.getEwsTable()
      this.getByUserTotal()
    },
    onSelectMenu (menuItem) {
      (this.$route.path !== menuItem.route) && this.$router.push(menuItem.route)
      this.selectedItemLabel = menuItem.label
    },
    ...mapActions('account', ['checkIfLoggedIn', 'connectWallet', 'logout', 'getActionProposal']),
    ...mapActions('analytics', ['actionDividendCompute']),
    ...mapActions('analytics', ['getByUserTotal', 'getEwsTable']),
    ...mapActions('account', ['getwhitelistTable']),
    DividendCompute () {
      this.actionDividendCompute(this.accountName)
    }
  },
  watch: {
    isAuthenticated: {
      immediate: true,
      handler: function (val) {
        // if (val && this.accountName) {
        // this.getAccountInfo()
        // this.getActionProposal()
        // }
        if (val && this.$route.query.returnUrl) {
          this.$router.push({ path: this.$route.query.returnUrl })
        }
      }
    }
  } // ,
  // created () {
  // this.checkIfLoggedIn()
  // // this.initiateValues() // TODO commented
  // this.getwhitelistTable()
  // this.version = process.env.V_STRING // TODO
  // }
  // // mounted () {
  // // this.getwhitelistTable(this.accountName)
  // // }
}
</script>

<style>

#site-container {
  margin: 0px auto;
  text-align: left;
  width: 700px;
  zoom: 1;
  position: relative;
}
.start {
background-color: 'newback'
}
.ux_bar {
background-color: #3B4653;
}
.uxblue1 {
background-color: #00ACEF;
color: #00ACEF;
}
.uxdrawer {
background-color: rgb(28, 38, 47);
color:#00ACEF;
}
.uxdraweract {
  background-color: #00ACEF;
  color: #3B4653;
}
@font-face {
  font-family: 'MyWebFont';
  src: url('Franklin Gothic Medium Regular/Franklin Gothic Medium Regular.ttf')  format('truetype');
}
.my-font {
  font-family:'MyWebFont'
}

.pex1{
  padding-right: 2em;
}

.bottom-three {
  margin-bottom: 1cm;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #4080b8;
}

li {

  float: left;
}

div.a {
  font-size: 12px;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  float: right;
}

li a:hover {
  background-color: #3ab2c9;
}

li a:hover:not(.active) {
  background-color: #3ab2c0;
}

.div-with-bg {
  background-image: url("../assets/SkyColor.jpg");
  background-size: cover;
  height: 100%;
  width: 100%;
}

.text-area {
  font-size: 1.3em;
  margin: 25px;
}

.myDiv{
  width: 190px;
  padding: 10px;
  background: #f99f53;
  text-align: center;
  margin: 0 auto;
  border: 1px solid #f97200;
  color: #fff;
}

body{
  background-image: url("../assets/BetweenNightandDay.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
