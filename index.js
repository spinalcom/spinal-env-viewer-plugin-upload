import "./registerDialog";
import {spinalContextMenuService} from "spinal-env-viewer-context-menu-service";
import UploadExcelFile from "./src/button/uploadExcel"
import ContextUpload from "./src/button/contextUpload"
import LinkEndpointToProfil from "./src/button/linkEndpointToProfil";
// import LinkGroupToEndpoint from "./src/button/linkGroupToEndpoint";

const sidebarName = "GraphManagerSideBar";
const topbarName = "GraphManagerTopBar"


spinalContextMenuService.registerApp(sidebarName, new UploadExcelFile(), [3]);
spinalContextMenuService.registerApp(topbarName, new ContextUpload(), [3]);
spinalContextMenuService.registerApp(sidebarName, new LinkEndpointToProfil(), [3]);
// spinalContextMenuService.registerApp(sidebarName, new LinkGroupToEndpoint(), [3]);


