<template>
  <adbsg-header>
    <div style="width: 12%"></div>
    <div style="text-align: center">
      <div style="height: 16px" />
      <p>Filter:</p>
    </div>
    <div>
      <input type="search" class="form-control filter" v-model="filterServer" />
    </div>
    <div style="width: 1%"></div>
    <div>
      <input type="search" class="form-control filter" v-model="filterLevel" />
    </div>
    <div style="width: 1%"></div>
    <div>
      <input type="search" class="form-control filter" v-model="filterMessage" />
    </div>
  </adbsg-header>
  <table class="table">
    <thead>
      <tr>
        <th style="width: 15%" scope="col">Time stamp</th>
        <th style="width: 8%" scope="col">Server</th>
        <th style="width: 14%" scope="col">Level</th>
        <th style="text-align: left" scope="col">Message</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="message in messagesFiltered" :key="message.Id">
        <td>{{ message.Timestamp }}</td>
        <td>{{ message.Server }}</td>
        <td>{{ message.Level }}</td>
        <td style="text-align: left">{{ message.Message }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import AdbsgHeader from "@/components/adbsgHeader/adbsgHeader.vue";
import { computed, defineComponent, PropType, ref } from "vue";
import { IMessage } from "@/types/IMessage";

export default defineComponent({
  components: { AdbsgHeader },
  setup(props) {
    const filterServer = ref("");
    const filterLevel = ref("");
    const filterMessage = ref("");

    const messagesFiltered = computed(() => {
      let newList: IMessage[] = props.messages.filter((message) => {
        return (
          message.Server.includes(filterServer.value) &&
          message.Level.includes(filterLevel.value) &&
          message.Message.includes(filterMessage.value)
        );
      });
      return newList;
    });

    return { messagesFiltered, filterServer, filterLevel, filterMessage };
  },

  props: {
    messages: {
      type: Array as PropType<IMessage[]>,
      required: true,
    },
  },
});
</script>

<style>
.filter {
  width: 150px !important;
}
</style>