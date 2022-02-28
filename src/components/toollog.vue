<template>
    <table class="table">
        <tr>
          <th scope="col">Time stamp</th>
          <th scope="col">Level</th>
          <th scope="col">Message</th>         
        </tr>
        <tr v-for="(msg, index) in messages" :key="index"  >
          <td v-if="msg.Message != ''">{{msg.Timestamp}}</td>
          <td v-if="msg.Message != ''">{{msg.Level}}</td>
          <td v-if="msg.Message != ''">{{msg.Message}}</td>
        </tr>       
    </table>
</template>

<script lang="ts">
import { IMessage } from "@/types/IMessage";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
  props: {
    messages: {
      type: Array as PropType<IMessage[]>,
      required: true,
    },
  },
  
});
</script>

<style>

</style>