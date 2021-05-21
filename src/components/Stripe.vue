<template>
  <div class="m-5">
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      :pk="publishableKey"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      :customerEmail="customerEmail"
      @loading="v => loading = v"
    />
    <button class="green_button" @click="subscribe">Subscribe to {{ description }} for {{ price }} USD per month</button>
  </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe'
export default {
  props: {
    customerEmail: { type: String, required: true },
    lineItems: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
  },
  components: {
    StripeCheckout,
  },
  data () {
    this.publishableKey = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY
    return {
      loading: false,
      successURL: 'https://bva2.netlify.app/profile',
      cancelURL: 'https://bva2.netlify.app/profile',
      //successURL: 'http://localhost:3000/profile',
      //cancelURL: 'http://localhost:3000/profile',
    }
  },
  methods: {
    subscribe () {
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },
}
</script>


<style lang="postcss" scoped>
.green_button {
  @apply border-2 px-3 py-2 border-green-600 rounded-lg text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200;
}
</style>