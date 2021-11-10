import vue from "vue";
import UploadVue from "./src/vue/uploadFile.vue";
import CreateContext from "./src/vue/createContext.vue";
import LinkProfil from "./src/vue/linkProfil.vue";
import LinkGroup from "./src/vue/linkGroup.vue";
import SelectControlEndpoint from "./src/vue/selectControlEndpoint.vue";

const {
  SpinalMountExtention,
} = require("spinal-env-viewer-panel-manager-service");

const dialogs = [
  {
    name: "UploadExcelDialog",
    vueMountComponent: vue.extend(UploadVue),
    parentContainer: document.body,
  },
  {
    name: "ContextUploadDialog",
    vueMountComponent: vue.extend(CreateContext),
    parentContainer: document.body,
  },
  {
    name: "LinkProfilDialog",
    vueMountComponent: vue.extend(LinkProfil),
    parentContainer: document.body,
  },
  {
    name: "LinkGroupDialog",
    vueMountComponent: vue.extend(LinkGroup),
    parentContainer: document.body,
  },
  {
    name: "selectControlEndpoint",
    vueMountComponent: vue.extend(SelectControlEndpoint),
    parentContainer: document.body,
  },
];

for (let index = 0; index < dialogs.length; index++) {
  SpinalMountExtention.mount(dialogs[index]);
}
