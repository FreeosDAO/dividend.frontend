<template>
  <div class="text-center q-pa-lg">
    <div class="text-h4 text-weight-medium q-mb-md">Freeos</div>
    <div class="text-h6 text-weight-regular">
      <div>
        Welcome at {{this.version}}
      </div>
      <div class="q-mt-sm q-mb-sm">
        This website is for testing purposes only. It is not public and not official, however feel invited to http://freeos.io
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
