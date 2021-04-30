<template>
  <div>
    <p>{{ user }}</p>
  </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue";
import axios from "~/utils/axios";

export default defineComponent({
  name: "Dashboard",
  setup: () => {

    const state = reactive({
        user: null,
    })

    onMounted(() => {
      axios.get('/api/signals')
      .then(res => {
        state.user = res
      })
      .catch((err) => {
        console.log(err)
      })
    })
    
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
