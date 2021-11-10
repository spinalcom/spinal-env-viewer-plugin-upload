<!--
Copyright 2021 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <div>
    <md-dialog
      class="dialogApp"
      :md-active.sync="showDialog"
      @md-closed="closeDialog(false)"
    >
      <md-dialog-title>Link an endpoint to a profil</md-dialog-title>
      <md-dialog-content class="content">
        <div class="section">
          <link-template
            :title="'Context'"
            :data="context"
            :itemSelected="contextSelected"
            @select="selectContext"
            :disableBtn="true"
          ></link-template>
        </div>

        <div class="section">
          <link-template
            :title="'Profil'"
            :data="profils"
            :itemSelected="profilSelected"
            @select="selectProfil"
            :disableBtn="true"
          ></link-template>
        </div>
        <div class="section">
          <link-template
            :title="'Device'"
            :data="devices"
            :itemSelected="deviceSelected"
            @select="selectDevice"
            :disableBtn="true"
          ></link-template>
        </div>
        <div class="section">
          <link-template
            :title="'Endpoint'"
            :data="endpoints"
            :itemSelected="endpointSelected"
            @select="selectEndpoint"
            :disableBtn="true"
          ></link-template>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog(false)"
          >Close</md-button
        >
        <md-button
          class="md-primary"
          @click="closeDialog(true)"
          :disabled="!endpointSelected"
          >Save</md-button
        >
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import {
  SpinalGraphService,
  SPINAL_RELATION_PTR_LST_TYPE
} from "spinal-env-viewer-graph-service";
var {
  SpinalExcelManager
} = require("spinal-env-viewer-plugin-excel-manager-service");
import linkTemplate from "./linkTogroupTemplate.vue";

export default {
  name: "createContext",
  props: ["onFinised"],
  components: { "link-template": linkTemplate },
  data() {
    this.selectedNode;
    return {
      showDialog: true,
      contextName: "",
      profilSelected: "",
      contextSelected: "",
      deviceSelected: "",
      endpointSelected: "",
      context: [],
      profils: [],
      devices: [],
      endpoints: []
    };
  },
  methods: {
    async opened(option) {
      console.log("voici l'option", option);
      //this.endpointSelected = option.selectedNode.id.get()
      console.log("this is selctedNode: ", option.selectedNode);
      console.log(
        "this is the context name: ",
        SpinalGraphService.getContextWithType("BIMObjectGroupContext")
      );
      /* const currentNode = option.selectedNode;
      const currentNodeChildren = await SpinalGraphService.getChildren(currentNode.id.get(), "groupHasBIMObject");
      for(let child of currentNodeChildren){
          console.log(child.name.get());
        } */
      this.selectedNode = option.selectedNode;
      /*    const currentNodeChildren = await SpinalGraphService.getChildren(currentNode.id.get(), "groupHasBIMObject");
            for(let child of currentNodeChildren){
                console.log("this is child",child);
                console.log("this thisEndpointSelected", this.endpointSelected);
                //const node = SpinalGraphService.getRealNode(child.id.get());
                /* if(node.hasRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE))
                await node.removeRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE) 
                //SpinalGraphService.addChild(child.id.get(), this.endpointSelected, "hasEndPoint", SPINAL_RELATION_PTR_LST_TYPE)

            } */
      this.context = await this.getData();
    },
    async removed(option) {
      if (option.closeResult) {
        const currentNode = this.selectedNode;
        const currentNodeChildren = await SpinalGraphService.getChildren(
          currentNode.id.get(),
          ["groupHasBIMObject", "groupHasgeographicRoom"]
        );
        for (let child of currentNodeChildren) {
          console.log("this is child", child);
          console.log("this thisEndpointSelected", this.endpointSelected);
          //const node = SpinalGraphService.getRealNode(child.id.get());
          /* if(node.hasRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE))
                await node.removeRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE) */

          SpinalGraphService.addChild(
            child.id.get(),
            this.endpointSelected,
            "hasEndPoint",
            SPINAL_RELATION_PTR_LST_TYPE
          );
        }
        /* if(option.closeResult){
            const node = SpinalGraphService.getRealNode(this.endpointSelected);
            if(node.hasRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE))
            await node.removeRelation("endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE)
            SpinalGraphService.addChild(this.endpointSelected, this.profilSelected, "endpointHasProfil", SPINAL_RELATION_PTR_LST_TYPE)
        } */
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({ closeResult, inputValue: this.inputValue });
      }
    },

    selectContext(element) {
      this.profilSelected = undefined;
      this.endpointSelected = undefined;
      this.deviceSelected = undefined;
      this.endpoints = [];
      this.profils = [];
      this.devices = [];
      this.contextSelected = element;
      let found = this.context.find(el => el.id == element);
      if (found) {
        this.profils = found.profils;
      }
    },
    async selectProfil(element) {
      this.profilSelected = element;
      let context = this.context.find(el => el.id == this.contextSelected);
      if (context) {
        console.log(this.profilSelected, context);
        let deviceFound = await SpinalGraphService.getChildrenInContext(
          this.profilSelected,
          context.id
        );
        this.devices = deviceFound.map(element => element.get());
      }
    },
    async selectDevice(element) {
      this.deviceSelected = element;
      let context = this.context.find(el => el.id == this.contextSelected);
      if (context) {
        console.log(this.deviceSelected, context);
        let endpointFound = await SpinalGraphService.getChildrenInContext(
          this.deviceSelected,
          context.id
        );
        this.endpoints = endpointFound.map(element => element.get());
      }
    },
    selectEndpoint(element) {
      console.log(element);
      this.endpointSelected = element;
    },
    getData() {
      const contextNode = SpinalGraphService.getContextWithType("Network");
      const context = contextNode.map(element => element.info.get());
      const promise = context.map(async el => {
        let contextChildren = await SpinalGraphService.getChildrenInContext(
          el.id,
          el.id
        );
        el.profils = contextChildren.map(element => element.get());
        return el;
      });
      return Promise.all(promise);
    }
  }
};
</script>

<style scoped>
.dialogApp {
  width: 50%;
  height: 100%;
}
.dialogApp .content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.dialogApp .content .section {
  width: 50%;
  border: 1px solid grey;
  border-radius: 4% 4% 0 0;
  padding: 15px;
}
</style>