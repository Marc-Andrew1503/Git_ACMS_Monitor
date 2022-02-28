<template> {{Error_Handling}}
  <div v-if="IDcheck" style="color: red">unknown state Id<br/></div>
  <div v-if="running_OK" style="color: red">
    acms service is running properly<br/>
  </div>
  <div v-if="calmdown">Calmdown<br/></div>
  <!--check output name-->
  <div v-if="forced_variables" style="color: yellow">forced VARIAVLES<br/></div>
  <div v-if="demo">DEMO<br/></div>
  <div v-if="errorOBJ">error object<br/></div>
  <!--check output name-->
  <div v-if="error_driver">driver ERROR<br/></div>
  <div v-if="bad_cycletime">forced SERVER<br/></div>
  <div v-if="worse_cycletime">worse cycletime<br/></div>
  <!--check output name-->
  <div v-if="lost_myself">lost myself<br/></div>
  <!--check output name-->
  <div v-if="lost_all_others" style="color: red">REDUNDANCY FAILED<br/></div>
</template>

<script>
export default {
  props: ["ID"],
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
        if (props.ID == null) {
          this.IDcheck = true;
        } else if (props.ID == 1) {
          this.running_OK = true;
        } else if (props.ID == 2) {
          this.calmdown = true;
        } else if (props.ID == 4) {
          this.forced_variables = true;
        } else if (props.ID == 8) {
          this.demo = true;
        } else if (props.ID == 16) {
          this.errorOBJ = true;
        } else if (props.ID == 256) {
          this.error_driver = true;
        } else if (props.ID == 512) {
          this.forced_server = true;
        } else if (props.ID == 65536) {
          this.bad_cycletime = true;
        } else if (props.ID == 131072) {
          this.worse_cycletime = true;
        } else if (props.ID == 262144) {
          this.worst_cycletime = true;
        } else if (props.ID == 524288) {
          this.lost_myself = true;
        } else if (props.ID == 1048576) {
          this.lost_all_others = true;
        }
      }},

};
</script>

<style></style>
