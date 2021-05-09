<template>
  <div>
    <Hero />
    <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
    ></apexchart>
    <Features />
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
        series: [
        {
          data: [
            {
              x: 'html',
              y: 218,
            },
            {
              x: 'css',
              y: 149,
            },
            {
              x: 'javascript',
              y: 84,
            },
            {
              x: 'typescript',
              y: 55,
            },
            {
              x: 'nodejs',
              y: 84,
            },
            {
              x: 'koajs',
              y: 31,
            },
            {
              x: 'nestjs',
              y: 70,
            },
            {
              x: 'vuejs',
              y: 80,
            },
            {
              x: 'reactjs',
              y: 44,
            },
            {
              x: 'algorithm',
              y: 68,
            },
            {
              x: 'design',
              y: 48,
            },
          ],
        },
      ],
      chartOptions: {
        legend: {
          show: false,
        },
        title: {
          text: 'Distibuted Treemap',
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 10,
          style: {
            color: '#388bfc',
          },
        },
        chart: {
          toolbar: {
            offsetY: 8,
            style: {
              color: 'red',
            },
          },
        },
        theme: {
          palette: 'palette4',
        },
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false,
          },
        },
      },
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
