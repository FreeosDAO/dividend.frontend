<template>
  <div>
    <div v-show="timestamp">Timestamp:{{ timestamp }}</div>
    <div v-show="date">Date:{{ date }}</div>

    <div v-show="time">Time:{{ time }}</div>

    <div v-show="currentYear">Only year:{{ currentYear }}</div>
  </div>
</template>
<script>
export default {
  name: 'CurrentDate',
  data: () => ({
    timestamp: '',
    date: '',
    time: '',
    currentYear: ''
  }),

  props: {
    msg: String
  },
  methods: {
    getDate: function () {
      return new Date().toLocaleDateString()
    },
    getTime: function () {
      return new Date().toLocaleTimeString()
    },
    getTimestamp: function () {
      return Date.now()
    },
    getCurrentYear: function () {
      return new Date().getFullYear()
    }
  },
  mounted: function () {
    this.date = this.getDate()
    this.time = this.getTime()
    this.timestamp = this.getTimestamp()
    this.currentYear = this.getCurrentYear()
  }
}
</script>

<style>
</style>
