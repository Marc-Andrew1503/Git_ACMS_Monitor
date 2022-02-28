<template> {{Error_Handling}}
  <div v-if="IDcheck" style="color: red">unknown state Id</div>
  <div v-if="running_OK">
    acms service is running properly
  </div>
  <div v-if="calmdown">calm down</div>
  <div v-if="forced_variables" style="color: #FCC429">forced VARIABLES</div>
  <div v-if="forced_server" style="color: red">forced SERVER</div>
  <div v-if="demo">DEMO</div>
  <div v-if="errorOBJ">internal ERROR</div>
  <div v-if="error_driver">DRIVER ERROR</div>
  <div v-if="bad_cycletime">CYCLETIME slow</div>
  <div v-if="worst_cycletime">CYCLETIME failed</div>
  <div v-if="lost_myself">NETWORK slow</div>
  <div v-if="lost_all_others" style="color: red">REDUNDANCY FAILED</div>
</template>

<script>
export default {
  props: ["IDS"],
  data() {
    return {
      IDcheck: false,
      running_OK: false,
      calmdown: false,
      demo: false,
      errorOBJ: false,
      error_driver: false,
      forced_server: false,
      forced_variables: false,
      bad_cycletime: false,
      worse_cycletime: false,
      worst_cycletime: false,
      lost_myself: false,
      lost_all_others: false,
    };
  },

  computed: {
    Error_Handling(props) {
        for (let index = 0; index < props.IDS.length; index++) {
        const ID = props.IDS[[index]];
        if (ID == null) {
          this.IDcheck = true;
        } else if (ID == 1) {
          this.running_OK = true;
        } else if (ID == 2) {
          this.calmdown = true;
        } else if (ID == 4) {
          this.forced_variables = true;
        } else if (ID == 8) {
          this.demo = true;
        } else if (ID == 16) {
          this.errorOBJ = true;
        } else if (ID == 256) {
          this.error_driver = true;
        } else if (ID == 512) {
          this.forced_server = true;
        } else if (ID == 65536) {
          this.bad_cycletime = true;
        } else if (ID == 131072) {
          this.worse_cycletime = true;
        } else if (ID == 262144) {
          this.worst_cycletime = true;
        } else if (ID == 524288) {
          this.lost_myself = true;
        } else if (ID == 1048576) {
          this.lost_all_others = true;
        }
      }}},

};
</script>

<style>
</style>
