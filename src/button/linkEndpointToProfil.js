const { SpinalContextApp } = require("spinal-env-viewer-context-menu-service");

const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import { groupManagerService } from "spinal-env-viewer-plugin-group-manager-service";
import { GEOGRAPHIC_TYPES_ORDER } from "spinal-env-viewer-context-geographic-service/build/constants";

class LinkEndpointToProfil extends SpinalContextApp {
  constructor() {
    super(
      "Link an endpoint to a profil",
      "This button link an endpoint to a profil",
      {
        icon: "share",
        icon_type: "in",
        backgroundColor: "#FF0000",
        fontColor: "#FFFFFF",
      }
    );
  }

  isShown(option) {
    const contextType = option.context.type.get();

    const isGroupContext = groupManagerService.isContext(contextType);

    if (!isGroupContext) return Promise.resolve(-1);

    const type = option.selectedNode.type.get();

    return Promise.resolve(GEOGRAPHIC_TYPES_ORDER.indexOf(type));
    // if(GEOGRAPHIC_TYPES_ORDER.indexOf(type) !== -1) {
    //   const isCategory = groupManagerService.isCategory(type);
    // const isGroup = groupManagerService.isGroup(type);
    // const isContext = type === contextType;

    // }

    // if (isCategory || isGroup || isContext) {
    //   const type = getGroupType(contextType);
    //   return Promise.resolve(GEOGRAPHIC_TYPES_ORDER.indexOf(type));
    // }

    // return Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("selectControlEndpoint", option);
    // spinalPanelManagerService.openPanel("LinkProfilDialog", option);
  }
}

module.exports = LinkEndpointToProfil;
