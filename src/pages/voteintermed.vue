<template>
  <!-- This page is intermediary between MainLayout.vue and Vote.vue.
  The purpose is to prefetch current state of the proposal. Is it active?
  This information is required for both Proposal.vue and Vote.vue pages.
  -->
  <div id="q-app" style="min-height: 100vh;">
    <div class="q-pa-md flex flex-center">
      <!-- <q-circular-progress
        indeterminate
        size="90px"
        :thickness="0.2"
        color="primary"
        center-color="grey-8"
        track-color="transparent"
        class="q-ma-md"
      ></q-circular-progress> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'voteintermed'
}

</script>

<style scoped>

</style>
