const {
    SpinalContextApp
  } = require("spinal-env-viewer-context-menu-service");
  const {
    spinalPanelManagerService
  } = require("spinal-env-viewer-panel-manager-service");
const { SpinalBmsDevice } = require("spinal-model-bmsnetwork");
  
  class UploadExcelFile extends SpinalContextApp {
    constructor() {
      super("Upload Excel file",
        "This button upload an excel file", {
          icon: "file_upload",
          icon_type: "in",
          backgroundColor: "#FF0000",
          fontColor: "#FFFFFF"
        });
    }
  
    isShown(option) {
        const selectedNodeType = option.selectedNode.type.get();
        if(selectedNodeType === "uploadFileContext") return Promise.resolve(true);
        return Promise.resolve(-1);
    }
  
    action(option) {
      
          spinalPanelManagerService.openPanel('UploadExcelDialog', option);
      
    }
  }
  
  module.exports = UploadExcelFile;