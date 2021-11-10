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
  <md-dialog class="dialogApp"
             :md-active.sync="showDialog"
             @md-closed="closeDialog(false)">
    <md-dialog-title>Link an endpoint to a profil</md-dialog-title>

    <md-dialog-content class="content">
      <md-field>
        <label for="movie">Select ControlPoints</label>
        <md-select v-model="controlPointSelected"
                   name="controlPoints"
                   id="controlPoints">
          <md-option v-for="controlPoint in controlPoints"
                     :key="controlPoint.id"
                     :value="controlPoint.id">{{controlPoint.name}}</md-option>
        </md-select>
      </md-field>
    </md-dialog-content>

    <md-dialog-actions>
      <md-button class="md-primary"
                 @click="closeDialog(false)">Close</md-button>
      <md-button class="md-primary"
                 @click="closeDialog(true)"
                 :disabled="!controlPointSelected">Save</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";
const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

export default {
  name: "selectControlPoint",
  props: ["onFinised"],
  data() {
    return {
      showDialog: true,
      controlPoints: [],
      controlPointSelected: undefined,
    };
  },
  methods: {
    async opened({ selectedNode, context, graph }) {
      this.controlPoints = await this.getControlEndpoints(
        selectedNode.id.get()
      );
    },

    async getControlEndpoints(nodeId) {
      const controlPoints =
        await spinalControlPointService.getControlEndpointLinkedToGroupItem(
          nodeId
        );

      return this.formatControlEndpoints(controlPoints);
    },

    formatControlEndpoints(controlPoints) {
      const format = controlPoints.map((profil) => {
        return profil.endpoints.map((endpoint) => {
          endpoint.name = `${profil.name}/${endpoint.name}`;
          return endpoint;
        });
      });

      return format.flat();
    },

    async removed(option) {
      if (option.closeResult) {
        spinalPanelManagerService.openPanel("LinkProfilDialog", {
          nodeId: this.controlPointSelected,
        });
      }
      this.showDialog = false;
    },

    closeDialog(closeResult) {
      if (typeof this.onFinised === "function") {
        this.onFinised({ closeResult, inputValue: this.inputValue });
      }
    },
  },
};
</script>