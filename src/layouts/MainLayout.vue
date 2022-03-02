<template>
  <q-layout view="hHh Lpr fFf">
    <q-header reveal bordered class="uxtext" height-hint="90">
      <q-toolbar bordered class="ux_bar text-uxblue">
        <q-btn :style="'visibility: ' + (isAuthenticated ? 'visible' : 'hidden')" dense flat round icon="menu" @click="drawer = !drawer" />
        <q-toolbar-title>
        <q-btn v-if="isAuthenticated" flat no-caps class="uxtext" label="Compute Dividend" @click="DividendCompute()"
          style="width: 150px"
        ></q-btn>
        </q-toolbar-title>
        <q-space></q-space>
        <!--  <div v-if="isAuthenticated">{{this.version}}</div> -->
        <div style="display: flex; align-items: center;">
          {{version}}&nbsp;&nbsp;&nbsp;&nbsp;
          <img width="35" src="~assets/decentralised.png"> &nbsp; &nbsp;
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
                :key="index" clickable :active="selectedItemLabel === menuItem.label" active-class="uxdraweract"
                v-ripple @click="onSelectMenu(menuItem)">
                <q-item-section avatar>
                  <img :src="menuItem.image" class="img-fluid"/>
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
    <q-page-container v-if="isAuthenticated">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
// import { isAuthenticated } from 'src/store/account/getters'
const menuList = [
  {
    image: [require('../assets/Home.png')],
    label: 'Home',
    separator: true,
    route: '/'
  },
  {
    image: [require('../assets/Proposal.png')],
    label: 'Proposal',
    separator: true,
    route: '/proposal'
  },
  {
    image: [require('../assets/Vote1.png')],
    label: 'Vote',
    separator: true,
    route: '/vote'
  },
  {
    image: [require('../assets/Customer.png')],
    label: 'Customer',
    separator: true,
    route: '/customer'
  },
  {
    image: [require('../assets/Analytics.png')],
    label: 'Analytics',
    separator: true,
    route: '/analytics'
  },
  {
    image: [require('../assets/Analytics.png')],
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
    this.checkIfLoggedIn()
    // this.version = process.env.V_STRING
    // Count current bar values - note that are not displayed on this page.
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
    //
    this.setIntervalId1 = setInterval(() => {
      this.getEwsTable()
      this.getByUserTotal()
      this.checkIfLoggedIn()
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
background-color: #3B4752;
}
.uxblue1 {
background-color: #00ADEE;
color: #00ADEE;
}
.uxtext {
  color: #00ADEE;
}
.uxdrawer {
background-color: rgb(28, 38, 47);
color:#00ADEE;
}
.uxdraweract {
  background-color: #00ADEE;
  color: #3B4653;
}
@font-face {
  font-family: 'MyWebFont';
  src: url('Franklin Gothic Medium Regular/Franklin Gothic Medium Regular.ttf')  format('truetype');
}
.my-font {
  font-family:'MyWebFont'
}
.img-fluid {
  gutter: 6px;
  width: 28px;
  text-align: center;
  height: 30px;
  padding-bottom: 4px;
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
