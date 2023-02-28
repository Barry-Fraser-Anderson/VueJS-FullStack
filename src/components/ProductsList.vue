<template>
  <div v-if='products.length > 0'>
    <ProductsListItem v-for="product in products" :key="product.id" :product='product' />
  </div>
  <p v-else>You haven't added anything to your cart</p>
</template>

<script>
import ProductsListItem from './ProductsListItem'
export default {
  name: 'ProductsList',
  props: ['products'],
  components: {
    ProductsListItem
  }
}
</script>

<style scoped>
</style>
