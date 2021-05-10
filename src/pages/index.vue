<template>
  <div>
    <Hero />
    <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
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
        series: [{
            name: "Bitcoin",
            data: [30, 40, 45, 50, 49, 60, 70, 99],
        }],
        chartOptions: {
        chart: {
          width: "100%",
          id: "bitcoin-chart",
          type: "area",
          stacked: false,
          zoom: {
            enabled: false,
          },
        },
        colors: ["#02182B"],
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100, 100, 100],
          },
        },
        xaxis: {
          categories: [
            1578798000000,
            1581476400000,
            1583982000000,
            1586660400000,
            1589252400000,
            1591930800000,
            1594522800000,
            1597201200000,
          ],
          type: "datetime",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          tooltip: {
            shared: true,
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            offsetX: -10,
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "BRL",
              }).format(value);
            },
          },
        },
      }
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

    /*
    onBeforeMount( () => {
        fetchResults();
    })
    */ 
    
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style>
</style>
