<template>
  <section class="container flex flex-col items-center px-5 py-12 mx-auto text-gray-600 body-font md:flex-row">
    <div class="w-5/6 mb-10 lg:max-w-lg lg:w-full md:w-1/2 md:mb-0">
      <img class="object-cover object-center rounded" alt="BvA" src="/bva.png" />
    </div>
    <div class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
      <Heading1> Vite ⚡ - Vue 2 starter template </Heading1>
      <p class="mb-8 leading-relaxed text-gray-300">
        {{ rows.slice(0,1)}}
      </p>
      <div class="flex justify-center">
        <RouterLink :to="{ name: 'profile' }">
          <ButtonPrimary> Get Started </ButtonPrimary>
        </RouterLink>
      </div>
    </div>
  </section>
</template>


<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent } from "vue"
import axios from "~/utils/axios"

export default defineComponent({
  name: "Hero",
  setup: () => {

    const state = reactive({
        rows: [],
    })

    onMounted(() => {
        
    })
    
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
