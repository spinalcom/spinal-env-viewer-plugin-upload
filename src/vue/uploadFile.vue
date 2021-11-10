<template>
  <div>
    <md-dialog :md-active.sync="showDialog"
               @md-closed="closeDialog(false)">
      <md-dialog-title>Add a simulation file</md-dialog-title>
      <md-dialog-content>
<md-field>
        <label>Profil name</label>
        <md-input v-model="profilName"></md-input>
      </md-field>

      <md-field>
        <label>Upload</label>
        <md-file v-model="f" @md-change="changeFile"/>
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
import { SpinalGraphService, SPINAL_RELATION_LST_PTR_TYPE } from 'spinal-env-viewer-graph-service';
import {ProfilModel} from "../model/profilModel"
var {SpinalExcelManager} = require('spinal-env-viewer-plugin-excel-manager-service');

export default {
  name: "uploadComponent",
  props: ["onFinised"],
  data() {
    this.contextId;
    return {
      showDialog: true, 
      f: undefined, 
      file: undefined,
      profilName: ""
    };
  },
  methods: {
    opened(option) {
      console.log("voici l'option",option); 
      this.contextId = option.context.id.get()
    },
    async removed(option) {
      if(option.closeResult){

        const valueExcel = await this.getDataFromExcel(this.file);
        console.log("conversion du fichier excel",valueExcel);
        const sheetNames = Object.keys(valueExcel);
        const sheetValues = sheetNames.map(el => {
          return valueExcel[el].map(element => {
            const valueKey = Object.keys(element)[1];

            return {
              date : new Date(element["DATE / HEURE"]).getTime(),
              value : element[valueKey]
            }
            
          })
        })
        const values = sheetValues.flat().filter(el => {
          return (!isNaN(el.date) && typeof el.date == "number") && (!isNaN(el.value) && typeof el.value == "number") 
        })

        const profilModel = new ProfilModel(this.profilName, values);
        const nodeId = SpinalGraphService.createNode({name: this.profilName, type: "uploadProfil"}, profilModel);
        SpinalGraphService.addChildInContext(this.contextId, nodeId, this.contextId, "hasUploadProfil", SPINAL_RELATION_LST_PTR_TYPE)
        
       
       
       
       // const values = sheetValues.


        // const valueKey = Object.keys(valueExcel)[1];
        // const date = new Date(element["DATE / HEURE"]).getTime();
        // const value = element[valueKey];

        // const value = Object.keys(valueExcel).map()

        
        // console.log("value",value,this.profilName);
        // sauvegarder le fichier excel et le convertir en object
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