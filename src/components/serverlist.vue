<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Hide</th>
        <th scope="col">Up</th>
        <th scope="col">Demo</th>
        <th scope="col">Address</th>
        <th scope="col">Host</th>
        <th scope="col">Build</th>
        <th scope="col">Up time</th>
        <th scope="col">Cycle time</th>
        <th scope="col">Priority</th>
        <th scope="col">Redundancy</th>
        <th scope="col">Version</th>
        <th scope="col">State</th>
        <th scope="col">CPU %</th>
        <th scope="col">Memory %</th>
        <th scope="col">System time</th>
      </tr>
    </thead>
    <template v-for="(server, index) in servers" :key="server.Id">
      <tr v-if="server.Show != false">
        <td>
          <img src="../assets/eye.png" @click="HideServer(server, index)" />
        </td>
        <td>
          <button
            v-if="isExpertModeActive && !server.IsUpforced"
            @click="upforceServer(server.Id)"
            type="button"
            class="btn btn-outline-success btn-sm"
          >
            <img src="../assets/arrow_green_up.png" />
          </button>
          <button
            v-else-if="isExpertModeActive"
            @click="releaseServer(server.Id)"
            type="button"
            class="btn btn-outline-danger btn-sm"
          >
            <img src="../assets/arrow_red_down.png" />
          </button>
        </td>
        <td v-if="server.IsDemoActive == true">
          <img src="../assets/ic_demoMode.png" />
        </td>
        <td v-else></td>
        <td v-for="x in server.AddressList" :key="x">{{ x }}</td>
        <td>{{ server.Host }}</td>
        <td style="background-color: #f9b122">{{ server.Build }}</td>
        <td>{{ server.UpTime }}</td>
        <td>{{ server.CycleTime }}</td>
        <td>{{ server.Priority }}</td>
        <td>{{ server.Redundancy }}</td>
        <td style="background-color: #f9b122">{{ server.Version }}</td>
        <td>
          <Statearray :IDS="server.StateList"></Statearray>
          <!-- :Key -> Identifyer-->
          <button
            v-show="isDriverErrorPresent(server) && isExpertModeActive"
            @click="resetError(server.Id)"
            type="button"
            class="btn btn-outline-danger btn-sm"
          >
            clear error
          </button>
        </td>
        <td>
          <Progressbar :number="server.Cpu"></Progressbar>
        </td>
        <td>
          <Progressbar :number="server.Memory"></Progressbar>
        </td>
        <td style="background-color: #f9b122">
          {{ server.SystemTime.toLocaleString() }}
        </td>
      </tr>
    </template>
  </table>
</template>

<script lang="ts">
import Progressbar from "./Progressbar.vue";
import State from "./State.vue";
import Statearray from "./State2.vue";
import { defineComponent, PropType } from "vue";
import { IServer, ServerState } from "@/types/IServer";
import { ipcRenderer } from "electron";
import { ICommand, CommandType } from "@/types/ICommand";
import { IpcChannel } from "@/types/IpcChannel";

export default defineComponent({
  components: { Progressbar, State, Statearray },
  setup() {
    const resetError = (id: number) => {
      let command: ICommand = { Cmd: CommandType.DriverReset, Arg: id };
      ipcRenderer.send(IpcChannel.UiCommand, command);
    };

    const upforceServer = (id: number) => {
      let command: ICommand = { Cmd: CommandType.UpforceServer, Arg: id };
      ipcRenderer.send(IpcChannel.UiCommand, command);
    };

    const releaseServer = (id: number) => {
      let command: ICommand = { Cmd: CommandType.ReleaseServer, Arg: id };
      ipcRenderer.send(IpcChannel.UiCommand, command);
    };

    const isDriverErrorPresent = (server: IServer): boolean => {
      return server.StateList.includes(ServerState.ERRORDRIVER);
    };

    return { resetError, isDriverErrorPresent, upforceServer, releaseServer };
  },
  props: {
    servers: {
      type: Array as PropType<IServer[]>,
      required: true,
    },
    isExpertModeActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    HideServer(server: IServer, index: number) {
      this.servers[index]={...server, Show : false}
    },
    toggleservervisability(server: {Show : boolean}){
      server.Show = false;
    },
    ShowServer() {
      for (let index = 0; index < this.servers.length; index++) {
        this.servers[index].Show = true;
      }
    },
  },
});
</script>

<style>
thead {
  font-size: 10pt;
}
.opacity-0{ opacity: 0 }
</style>