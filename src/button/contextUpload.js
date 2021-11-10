const {
    SpinalContextApp
  } = require("spinal-env-viewer-context-menu-service");
  const {
    spinalPanelManagerService
  } = require("spinal-env-viewer-panel-manager-service");
const { SpinalBmsDevice } = require("spinal-model-bmsnetwork");
  
class ContextUpload extends SpinalContextApp {
    constructor() {
      super("Create upload context",
        "This button create a context to upload", {
          icon: "navigation",
          icon_type: "in",
          backgroundColor: "#FF0000",
          fontColor: "#FFFFFF"
        });
    }
  
    isShown(option) {
        /* const selectedNodeType = option.selectedNode.type.get();
        if(selectedNodeType === SpinalBmsDevice.nodeTypeName) return Promise.resolve(true);
        return Promise.resolve(-1);  */
        return Promise.resolve(true);
    }
  
    action(option) {
      
          spinalPanelManagerService.openPanel('ContextUploadDialog', option);
      
    }
}
  
  module.exports = ContextUpload;