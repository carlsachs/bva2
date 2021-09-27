<template>
  <div @click="subscribe" class="font-bold group flex text-xl items-center bg-indigo-900 bg-opacity-10 shadow-xl gap-5 px-6 py-5 rounded-lg mt-5 cursor-pointer hover:bg-opacity-100 transition">
      <div class="flex-auto text-green-500 text-xl font-semibold">Subscribe</div>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref, inject, reactive, toRefs } from 'vue' 
import {useStripe} from 'vue-use-stripe'

export default defineComponent({
  name: "stripe",
  props: {
    customerEmail: { type: String, required: true },
    clientReferenceId: { type: String, required: true },
    stripeId: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  setup(props) {

    const { stripe } = useStripe({
      key: import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY,
    })

    const subscribe = async () => {
      console.log("stripe subscribe")
      const handleResult = await stripe.value.redirectToCheckout({
        //sessionId: data.sessionId,
        customerEmail: props.customerEmail,
        clientReferenceId: props.clientReferenceId,
        successUrl: 'https://bitcoinvsalts.com/subscriptions',
        cancelUrl: 'https://bitcoinvsalts.com/subscriptions',
        //successUrl: 'http://localhost:3000/subscriptions',
        //cancelUrl: 'http://localhost:3000/subscriptions',
        mode: "subscription",
        lineItems: [{ 'price': props.stripeId, 'quantity': 1 }]
      })
    }

    return {
      subscribe,
    }

  }
})
</script>


<style lang="postcss" scoped>
.green_button {
  @apply border-2 px-3 py-2 border-green-600 rounded-lg text-green-400 cursor-pointer bg-green-600 text-green-200;
}
</style>