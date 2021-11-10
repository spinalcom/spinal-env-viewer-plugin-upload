const {
    SpinalContextApp
  } = require("spinal-env-viewer-context-menu-service");
  const {
    spinalPanelManagerService
  } = require("spinal-env-viewer-panel-manager-service");
const { SpinalBmsDevice, SpinalBmsEndpoint } = require("spinal-model-bmsnetwork");
  
  class LinkGroupToEndpoint extends SpinalContextApp {
    constructor() {
      super("Link a group to an endpoint",
        "This button link a contextGroup to an endpoint", {
          icon: "add_link",
          icon_type: "in",
          backgroundColor: "#FF0000",
          fontColor: "#FFFFFF"
        });
    }
  
    isShown(option) {
        const selectedNodeType = option.selectedNode.type.get();
        if(selectedNodeType === "BIMObjectGroup" || selectedNodeType === "geographicRoomGroup") return Promise.resolve(true);
        return Promise.resolve(-1); 
        //return Promise.resolve(true);
    }
  
    action(option) {
      
          spinalPanelManagerService.openPanel('LinkGroupDialog', option);
      
    }
  }
  
  module.exports = LinkGroupToEndpoint;