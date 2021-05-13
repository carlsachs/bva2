<template>
  <div>
    <stripe-checkout
      ref="checkoutRef"
      mode="subscription"
      :pk="publishableKey"
      :line-items="lineItems"
      :success-url="successURL"
      :cancel-url="cancelURL"
      :clientReferenceId="clientReferenceId"
      :customerEmail="customerEmail"
      @loading="v => loading = v"
    />
    <button class="green_button mx-auto" @click="submit">Subscribe</button>
  </div>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';
export default {
  components: {
    StripeCheckout,
  },
  data () {
    this.publishableKey = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY
    return {
      loading: false,
      lineItems: [
        {
          price: 'price_1IqheJ4v5ia3fxwPKEJMLptX',
          quantity: 1,
        },
      ],
      successURL: 'http://localhost:3000/profile?success',
      cancelURL: 'http://localhost:3000/profile',
      customerEmail: 'herve76@gmail.com',
      clientReferenceId: "1"
    };
  },
  methods: {
    submit () {
      this.$refs.checkoutRef.redirectToCheckout();
    },
  },
};
</script>


<style lang="postcss" scoped>
.blue_button {
  @apply text-blue-400 cursor-pointer border-2 border-blue-600 hover:bg-blue-600 hover:text-blue-200 px-3 py-2 rounded-lg flex flex-row items-center;
}
.green_button {
  @apply border-2 border-green-600 rounded-lg px-3 py-2 text-green-400 cursor-pointer hover:bg-green-600 hover:text-green-200 flex flex-row items-center;
}
</style>