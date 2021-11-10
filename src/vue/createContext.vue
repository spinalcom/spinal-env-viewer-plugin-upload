<template>
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="closeDialog(false)">
      <md-dialog-title>Add a simulation context</md-dialog-title>
      <md-dialog-content>
      <md-field>
        <label>Context name</label>
        <md-input v-model="contextName"></md-input>
      </md-field>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="closeDialog(false)">Close</md-button>
        <md-button class="md-primary"
                   @click="closeDialog(true)">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import { SpinalGraphService } from "spinal-env-viewer-graph-service";
var {SpinalExcelManager} = require('spinal-env-viewer-plugin-excel-manager-service');


export default {
  name: "createContext",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true, 
      contextName: ""
    };
  },
  methods: {
    opened(option) {
      console.log("voici l'option",option)
    },
    async removed(option) {
      if(option.closeResult){
        SpinalGraphService.addContext(this.contextName, "uploadFileContext")
      }
      this.showDialog = false 
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({ closeResult, inputValue: this.inputValue });
      }
    },

  getDataFromExcel(excelLink){
    return SpinalExcelManager.convertExcelToJson(excelLink);
  },

  changeFile(files){
    this.file = files[0];
  }
  }
};
</script>