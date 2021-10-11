<template>
  <div class="text-center q-pa-lg">
      <div class="text-center q-ma-md row">
        <div class="col-md-5"></div>
         <div class="col-xs-12 col-md-2 q-mb-md">
          <img width="110" src="~assets/decentralised.png">
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      version: ''
    }
  },
  methods: {
    ver () {
      this.version = process.env.V_STRING
    }
  },
  created () {
    this.ver()
  }
}
</script>
