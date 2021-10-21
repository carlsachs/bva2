<template>
    <div>
        <div class="text-2xl text-cyan-200 mt-10">
            <b>Add Your Strategy</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <b>1. How to send TradingView signals to our platform.</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            You simply need to add our web hook into your TradingView alert setup:
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <b>https://api-bva.herokuapp.com/tv</b>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <img class="mx-auto my-10 object-contain md:object-scale-down" alt="TradingView Alert Settings" src="/tv_alert_setting.png"/>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            The format of the alert shall be:
        </div>
        <div class="text-cyan-200 mt-10">
            <code>{{ format }}</code>
        </div>
        <div class="text-xl text-cyan-200 mt-10">
            <ul class="list-disc list-inside">
                <li><b>your_bva_key</b> is your BVA key 
                    <b v-if="auth0.state.isAuthenticated && auth0.state.user" class="text-green-200">in your case, it's {{ auth0.state.user?.data?.sub?.replace("auth0|","") }}</b>
                    <b @click="auth0.client.loginWithRedirect({ appState: { targetUrl: '/subscriptions' } })" v-if="!auth0.state.isAuthenticated && !auth0.state.user" class="text-green-200">you can find it here</b></li>
                <li><b>your strategy name</b> is the name of your strategy, changing it will track a new strategy.</li>
                <li><b>action</b> could be <i>buy</i>, <i>sell</i>, <i>take</i> or <i>close</i>.</li>
                <li><b>ticker</b> should be a valid binance pair.</li>
                <li><b>position</b> is optional, it can be <i>flat</i>, <i>long</i> or <i>short</i>.</li>
            </ul>
        </div>
        <hr class="w-5 mx-auto border-blue-400 mt-6">
        <div class="text-xl text-cyan-200 mt-10">
            <b>To add an auto trading subscription to your strat</b>, you decide its monthly price, <b>BVA takes 20%</b>.
        </div>
        <hr class="w-5 mx-auto border-blue-400 mt-6">
        <div class="text-xl text-cyan-200 mt-10">
            <b>2.</b> For the <b>developers</b>, simply <b>POST</b> call our web hook, and use the same format for the <b>BODY</b>.
            <div class="w-200 mx-auto typing pl-2 mt-3">
                <div class="text-left text-green-100 border-light-100 border-1 p-4">
                    <h2 class='font-bold text-cyan-200 mb-3'>Python Sample Code:</h2>
                    import requests <br>
                    urlbva = 'https://api-bva.herokuapp.com/tv' <br>
                    xbva = requests.post(urlbva, json = 'your bva key|Strat Test ABC|buy|BTCUSDT|') <br>
                    print(xbva.text) <br>
                </div>
            </div>
            <div class="w-200 mx-auto typing pl-2 mt-3">
                <div class="text-left text-green-100 border-light-100 border-1 p-4">
                    <h2 class='font-bold text-cyan-200 mb-3'>Node JS Sample Code:</h2>
                    const axios = require('axios') <br>
                    const data = "your BVA key|Strat Test|buy|BTCUSDT" <br>
                    axios.post('https://api-bva.herokuapp.com/tv', data, { headers: { "Content-Type": "text/plain" }} ) <br>
                    .then( (response) => { <br>
                        console.log("result:", response.data) <br>
                    }) <br>
                    .catch( (error) => { <br>
                        console.log("ERROR:", error.response.data) <br>
                    }) <br>
                </div>
            </div>
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

import { onMounted, reactive, ref, computed, toRefs, defineComponent, inject } from "vue"
import { useHead } from '@vueuse/head'

export default defineComponent({
  name: "Dashboard",
  setup: () => {

    useHead({
        title: computed( () => "Add your crypto trading signals into Bitcoin vs. Alts"),
        meta: [
            {
            name: `description`,
            content: computed( () => "To add your crypto trading signals into BVA, simply POST call our web hook either from your TradingView alerts or in your own scripts."),
            },
        ],
    })

    const auth0: any = inject("auth0")

    const state = reactive({
        auth0, 
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
