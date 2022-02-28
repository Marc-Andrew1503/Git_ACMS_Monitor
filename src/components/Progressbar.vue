<template>
  <div class="OutterFrame">
    <div class="InnerFrame" v-bind:style="{ width: number + '%' }"></div>
  </div>
</template>

<script>
export default {
  props: ["number"],
};
</script>

<style scoped>
.OutterFrame {
  min-width: 70px;
  background-color: rgb(200, 200, 200);
  border-radius: 10px;
  /* (height of inner div) / 2 + padding */
  padding: 3px;
}

.InnerFrame {
  background-color: orange;
  width: 40%;
  /* Adjust with JavaScript */
  height: 16px;
  border-radius: 13px;
}
</style>
