<template>
  <section class="container flex flex-col items-center px-5 py-12 mx-auto text-gray-600 body-font md:flex-row">
    <div class="flex flex-col items-center text-center lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 md:items-start md:text-left">
      <Heading1> Vite ⚡ - Vue 2 starter template </Heading1>
      <p class="mb-8 leading-relaxed text-gray-300">
        {{ rows.slice(0,1)}}
      </p>
    </div>
  </section>
</template>


<script lang="ts">

import { reactive, ref, toRefs, defineComponent, inject } from "vue"
import { useRequest } from 'vue-request'
import axios from "~/utils/axios"

export default defineComponent({
  name: "TradedChart",
  props: {
    uid: { type: Number, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
  },
  setup: () => {

    const state = reactive({
      rows: [],
      stratname: "",
      ///////// ///////// ///////// /////////
      series: [
          {
              name: "Bitcoin",
              data: [],
          },
          {
              name: "You",
              data: [],
          }
      ],
      ///////// ///////// ///////// /////////
      chartOptions: {
        chart: { width: "100%", type: 'area', stacked: true },
        colors: ['#00E396','#0080FB'],
        dataLabels: { enabled: false, enabledOnSeries: false },
        legend: {
          show: true,
          offsetY: 20, itemMargin: { horizontal: 10, vertical: 20 },
          labels: { colors: '#ffffff', },
        },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.6, opacityTo: 0.8 } },
        stroke: { curve: 'smooth', width: 2, },
        tooltip: { enabled: true, theme: 'dark', },
        xaxis: {
          type: "datetime",
          labels: { show: true, style: { colors: '#FFFFFF', fontSize: '12px' }, }
        },
        yaxis: { forceNiceScale: true, labels: { show: true, style: { colors: '#FFFFFF', fontSize: '10px' },
            formatter: (value) => { return value+'%' },
          },
        }
      },
      ///////// ///////// ///////// /////////
    })
    
    return {
      ...toRefs(state),
    }
    
  },
})
</script>

<style>
</style>
