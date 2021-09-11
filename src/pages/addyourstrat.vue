<template>
    <div>
        <div class="text-2xl text-cyan-200 mt-10">
            <b>Add Your Strategy</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <b>To Send Your Signals to BVA from your TradingView Strategy</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            You need to add our web hook into your TradingView alert setting:
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <b>https://api-bva.herokuapp.com/tv</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <img class="mx-auto my-10 object-contain md:object-scale-down" alt="TradingView Alert Settings" src="/tv_alert_setting.png"/>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            The format of your alert should be:
        </div>
        <div class="text-cyan-200 mt-10">
            <code>{{ format }}</code>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <ul class="list-disc list-inside">
                <li><b>your_bva_key</b> is your BVA key  you find after signing up at <a href='https://bitcoinvsaltcoins.com/' target=_new>https://bitcoinvsaltcoins.com/</a></li>
                <li><b>your strategy name</b> is the name of your strategy, changing it will track a new strategy.</li>
                <li><b>action</b> could be <i>buy</i>, <i>sell</i>, <i>take</i> or <i>close</i>.</li>
                <li><b>ticker</b> should be a valid binance pair.</li>
                <li><b>position</b> can be empty or be either <i>flat</i>, <i>long</i> or <i>short</i>.</li>
            </ul>
        </div>
        <hr class="w-5 mx-auto border-blue-400 mt-6">
        <div class="text-xl text-cyan-200 mt-10">
            For the <b>developers</b>, simply <b>POST</b> call our web hook, and use the same format for the <b>BODY</b>.
        </div>
        <hr class="w-5 mx-auto border-blue-400 mt-6">
        <div class="text-xl text-cyan-200 mt-10">
            <div class="text-center p-5 m-6 flex flex-row items-center justify-center p-2 space-x-5 mb-5">
                <div class="text-gray-300 font-bold">Feel free to contact us </div> &nbsp;
                <a href="email:support@bitcoinvsalts.com" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=24 alt="GitHub" src="/email.png"/></a> &nbsp;
                <a href="https://t.me/joinchat/lmQ_xPE0WBo5NzYx" class="text-green-500 font-bold" target="_new"><img class="mx-auto" width=20 alt="GitHub" src="/tg.png"/></a> &nbsp;
                <a href="https://discordapp.com/invite/4EQrEgj" target="_new" class="text-purple-500 font-bold"><img class="mx-auto" width=20 alt="Discord" src="/discord.png"/></a> &nbsp;
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { onMounted, reactive, ref, toRefs, defineComponent, inject } from "vue"

export default defineComponent({
  name: "Dashboard",
  setup: () => {

    const state = reactive({
        format: "your_bva_key|your strategy name|{{strategy.order.action}}|{{ticker}}|{{strategy.market_position}}",
    })

      
    return {
        ...toRefs(state),
    }
  },
})
</script>

<style>
</style>