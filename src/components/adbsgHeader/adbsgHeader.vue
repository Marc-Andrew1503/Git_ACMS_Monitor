<template>
<div class="adbsgHeader">
  <slot class="actionarea"/>
  <img src="./Logo_ADBSFGT.png" class="logo"/>
</div>
</template>

<script>
export default {

}
</script>

<style>
  .adbsgHeader{
    position: relative;
    display:flex;
    align-items: center;
    width: 100%;
    height: 88px;
    border-style: solid;
    border-width: 1px;
    border-color:grey;
    margin: 1px;
  }
  .logo{
    position:absolute;
    right:0px;
    margin-right: 10px;
  }
   .actionarea{
    position:absolute;
    left:0px;
    margin-left: 10px;
  }
</style>