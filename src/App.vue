<template>
  <alert
    :triggerShow="triggerAlert"
    :titel="alertTitel"
    :message="alertMessage"
  />
  <enter-expert-mode
    :triggerShow="triggerExpertDialog"
    @expertModeActivated="(isExpertModeActive = true),Expertmode_Log()"
  />
  <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="serverlist-tab"
        data-bs-toggle="tab"
        data-bs-target="#serverlist"
        type="button"
        role="tab"
        aria-controls="serverlist"
        aria-selected="true"
      >
        Server list
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="servermessages-tab"
        data-bs-toggle="tab"
        data-bs-target="#servermessages"
        type="button"
        role="tab"
        aria-controls="servermessages"
        aria-selected="false"
      >
        Server messages
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="toollog-tab"
        data-bs-toggle="tab"
        data-bs-target="#toollog"
        type="button"
        role="tab"
        aria-controls="toollog"
        aria-selected="false"
      >
        Tool log
      </button>
    </li>
  </ul>
  <div class="tab-content" id="myTabContent">
    <div
      class="tab-pane fade show active"
      id="serverlist"
      role="tabpanel"
      aria-labelledby="serverlist-tab"
    >
      <adbsg-header>
        <button type="button" class="btn btn-light" @click="startReceiver()">
          <img style="width: 32px; height: 32px" src="./assets/start.png" />
        </button>
        <button type="button" class="btn btn-light" @click="stopReceiver()">
          <img style="width: 32px; height: 32px" src="./assets/stop.png" />
        </button>
        <button type="button" class="btn btn-light" @click="ShowServers">
          <img style="width: 32px; height: 32px" src="./assets/eyeShow.png" />
        </button>
        <button
          type="button"
          class="btn btn-light"
          @click="triggerExpertDialog = !triggerExpertDialog"
        >
          <img style="width: 32px; height: 32px" src="./assets/lock.png" />
        </button>
        <button type="button" class="btn btn-light">
          <img style="width: 32px; height: 32px" src="./assets/clean.png" />
        </button>
      </adbsg-header>
      <serverlist :servers="servers" :isExpertModeActive="isExpertModeActive" />
    </div>
    <div
      class="tab-pane fade"
      id="servermessages"
      role="tabpanel"
      aria-labelledby="servermessages-tab"
    >
      <!-- header is part of component servermessages because in controls the content of it -->
      <servermessages :messages="messages" />
    </div>
    <div
      class="tab-pane fade"
      id="toollog"
      role="tabpanel"
      aria-labelledby="toollog-tab"
    >
      <adbsg-header />
      <toollog :messages="logmsg" />
    </div>
  </div>
  <adbsg-status />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { ipcRenderer } from "electron";
import { ICommand, CommandType } from "@/types/ICommand";
import { IpcChannel } from "@/types/IpcChannel";
import { IUpdate, UpdateType } from "@/types/IUpdate";
import { IServer } from "@/types/IServer";
import { IMessage } from "./types/IMessage";
import AdbsgHeader from "@/components/adbsgHeader/adbsgHeader.vue";
import serverlist from "@/components/serverlist.vue";
import toollog from "@/components/toollog.vue";
import servermessages from "@/components/servermessages.vue";
import AdbsgStatus from "./components/adbsgStatus/adbsgStatus.vue";
import alert from "./components/alert.vue";
import EnterExpertMode from "./components/enterExpertMode.vue";

export default defineComponent({
  name: "App",
  components: {
    AdbsgHeader,
    serverlist,
    toollog,
    servermessages,
    AdbsgStatus,
    alert,
    EnterExpertMode,
  },
  setup() {
    //exported data structures
    let servers = ref<IServer[]>([]);
    let messages = ref<IMessage[]>([]);
    let logmsg = ref<IMessage[]>([]);
    let isReceiverRunning = ref(false);
    let isExpertModeActive = ref(false);
    let isHiddenServerListEmpty = ref(true);
    let triggerAlert = ref(false);
    let alertTitel = ref("");
    let alertMessage = ref("");
    let triggerExpertDialog = ref(false);

    //internal data structures
    let lastError = ref("");

    //sets a property of an object defined by its name(=string variable)
    type serverKeys = keyof IServer;
    function propSet<T, K extends keyof T>(obj: T, key: K, value: any) {
      obj[key] = value;
    }

    const stopReceiver = () => {
      let command: ICommand = { Cmd: CommandType.StopReceiver, Arg: null };
      ipcRenderer.send(IpcChannel.UiCommand, command);
    };

    const startReceiver = () => {
      let command: ICommand = { Cmd: CommandType.StartReceiver, Arg: null };
      ipcRenderer.send(IpcChannel.UiCommand, command);
    };

    //if new error ocurred a modal alert will be shown
    watch(lastError, (newErr, oldErr) => {
      if (oldErr !== newErr && newErr !== "") {
        alertTitel.value = "An error ocurred";
        alertMessage.value = newErr;
        triggerAlert.value = !triggerAlert.value;
      }
    });

    ipcRenderer.on(IpcChannel.UpdateData, (evt, dataObject: IUpdate) => {
      switch (dataObject.UpdateType) {
        case UpdateType.ServerListChanged:
          //build list of new added servers
          const oldList = servers.value;
          const newList = dataObject.UpdateData.serverList;
          const newServer: IServer[] = [];
          for (const s of newList) {
            if (oldList.find((elem) => elem.Id === s.Id) === undefined) {
              newServer.push(s);
            }
          }

          //replace list of server
          servers.value = dataObject.UpdateData.serverList;

          //force update for new added servers
          for (const s of newServer) {
            let command = {
              Cmd: CommandType.ForceServerChangedUpdate,
              Arg: s.Id,
            } as ICommand;
            ipcRenderer.send(IpcChannel.UiCommand, command);
          }
          break;
        case UpdateType.ServerPropertyChanged:
          let server: IServer | null = null;
          for (const s of servers.value) {
            if (s.Id === dataObject.UpdateData.serverId) {
              server = s as IServer;
              break;
            }
          }
          if (server !== null) {
            propSet(
              server,
              dataObject.UpdateData.property as serverKeys,
              dataObject.UpdateData.value
            );
          }
          break;
        case UpdateType.ServerChanged:
          const serverId: number = dataObject.UpdateData.Id;
          const index = servers.value.findIndex((elem) => elem.Id === serverId);
          if (index >= 0) {
            servers.value.splice(index, 1, dataObject.UpdateData);
          }
          break;
        case UpdateType.MonitorPropertyChanged:
          switch (dataObject.UpdateData.property) {
            case "IsReceiverRunning":
              let now= new Date();
              let msgmsg = "";
              if(dataObject.UpdateData.value){msgmsg = "Reciver is running"}
              else {msgmsg ="Reciver isn't running"};
                          isReceiverRunning.value = dataObject.UpdateData.value;
                          let msg: IMessage = {
                          Message: msgmsg,
                          Timestamp: now.toLocaleString(),
                          Server: "",
                          Level: "info",
                          Id: 0,
                }
              logmsg.value.push(msg);
              break;
            case "IsHiddenServerListEmpty":
              let now_IsHiddenServerListEmpty= new Date();
              let msgmsg_IsHiddenServerListEmpty = "";
              if(isHiddenServerListEmpty.value){msgmsg_IsHiddenServerListEmpty = "Hidden server list is empty"}
              else {msgmsg_IsHiddenServerListEmpty ="Hidden server list is not empty"};
                          isHiddenServerListEmpty.value = dataObject.UpdateData.value;
                          let msg_IsHiddenServerListEmpty: IMessage = {
                          Message: msgmsg_IsHiddenServerListEmpty,
                          Timestamp: now_IsHiddenServerListEmpty.toLocaleString(),
                          Server: "",
                          Level: "info",
                          Id: 0,
                }
              logmsg.value.push(msg_IsHiddenServerListEmpty);
              break;
            case "LastError":
              console.log("Last Error", dataObject.UpdateData.value);
              let now_lastError= new Date();
              let msgmsg_lastError = "";
              if(dataObject.UpdateData.value == ""){msgmsg_lastError = ""}
              else {msgmsg_lastError ="UDP listener error: socket already in use."};
                          lastError.value = dataObject.UpdateData.value;
                          let msg_lastError: IMessage = {
                          Message: msgmsg_lastError,
                          Timestamp: now_lastError.toLocaleString(),
                          Server: "",
                          Level: "Error",
                          Id: 0,
                }
              logmsg.value.push(msg_lastError);
              break;
          }
          break;
        case UpdateType.NewMessage:
          messages.value.push(dataObject.UpdateData.message as IMessage);
          break;
        case UpdateType.MessageListReduced:
          messages.value.splice(
            0,
            messages.value.length - dataObject.UpdateData.newLength
          );
          break;
      }
    });

    //send a request to the BO to get an updated list of servers
    let command = {
      Cmd: CommandType.ForceServerListChangedUdpate,
      Arg: null,
    } as ICommand;
    ipcRenderer.send(IpcChannel.UiCommand, command);
    //send a request to the BO to get an updated list of the monitor properties
    command = {
      Cmd: CommandType.ForceMonitorChangedUpdate,
      Arg: null,
    } as ICommand;
    ipcRenderer.send(IpcChannel.UiCommand, command);

    return {
      servers,
      messages,
      logmsg,
      isReceiverRunning,
      isExpertModeActive,
      isHiddenServerListEmpty,
      stopReceiver,
      startReceiver,
      triggerAlert,
      alertTitel,
      alertMessage,
      triggerExpertDialog,
    };
  },
  methods:{
    ShowServers(){
      for (let index = 0; index < this.servers.length; index++) {
        this.servers[index].Show = true;
        
      }},
    Expertmode_Log(){
              let nowExpert= new Date();
              let msg: IMessage = {
                          Message: "Application now runs under Expert mode",
                          Timestamp: nowExpert.toLocaleString(),
                          Server: "",
                          Level: "info",
                          Id: 1,
                }
                this.logmsg.push(msg);
    }
    
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.btn-light {
  margin-right: 5px;
  margin-left: 5px;
}
</style>