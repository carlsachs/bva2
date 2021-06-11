<template>
  <div class="m-5">
    <button class="green_button font-bold" @click="subscribe">Subscribe to {{ description }}</button>
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

    console.log("STRIPPPPPPPPE")

    const subscribe = async () => {
      console.log("subscribe")
      const handleResult = await stripe.value.redirectToCheckout({
        //sessionId: data.sessionId,
        customerEmail: props.customerEmail,
        clientReferenceId: props.clientReferenceId,
        successUrl: 'https://bitcoinvsalts.com/profile',
        cancelUrl: 'https://bitcoinvsalts.com/profile',
        //successUrl: 'http://localhost:3000/profile',
        //cancelUrl: 'http://localhost:3000/profile',
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