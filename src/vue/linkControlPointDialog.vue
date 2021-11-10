<!--
Copyright 2020 SpinalCom - www.spinalcom.com

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
	<md-dialog
		class="mdDialogContainer"
		:md-active.sync="showDialog"
		@md-closed="closeDialog(false)"
	>
		<md-dialog-title class="dialogTitle">
			Select Controlpoint
		</md-dialog-title>
		<md-dialog-content>
			<div class="content" v-if="state === STATES.normal">
				<div class="section">
					<link-template
						:title="'Contexts'"
						:data="data"
						:itemSelected="contextSelected"
						@create="createContext"
						@select="selectContext"
						:disableBtn="false"
					></link-template>
				</div>

				<div class="section">
					<link-template
						:title="'Categories'"
						:data="categories"
						:itemSelected="categorySelected"
						@create="createCategory"
						@select="selectCategory"
						:disableBtn="!contextSelected"
					></link-template>
				</div>

				<div class="section">
					<link-template
						:title="'Groups'"
						:data="groups"
						:itemSelected="groupSelected"
						@create="createGroup"
						@select="selectGroup"
						:disableBtn="!categorySelected"
					></link-template>
				</div>

				<div class="section">
					<link-template
						:title="'Control Points'"
						:data="controlPoints"
						:itemSelected="controlPointSelected"
						@create="createGroup"
						@select="selectControlPoint"
						:disableBtn="!categorySelected"
					></link-template>
				</div>
			</div>

			<div class="states" v-else>
				<md-progress-spinner
					md-mode="indeterminate"
					v-if="state === STATES.loading"
				></md-progress-spinner>

				<md-icon class="md-size-5x" v-else-if="state === STATES.error"
					>close</md-icon
				>
				<md-icon class="md-size-5x" v-else-if="state === STATES.success"
					>check</md-icon
				>
			</div>
		</md-dialog-content>
		<md-dialog-actions>
			<md-button class="md-primary" @click="closeDialog(false)"
				>Close</md-button
			>
			<md-button class="md-primary" :disabled="disabled" @click="link"
				>Save</md-button
			>
		</md-dialog-actions>
	</md-dialog>
</template>

<script>
	import attributeService from "spinal-env-viewer-plugin-attribute-manager/src/services/index";

	import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";
	import { SpinalGraphService } from "spinal-env-viewer-graph-service";

	//import LinkToGroupTemplate from "../components/linkTogroupTemplate.vue";
	import { spinalControlPointService } from "spinal-env-viewer-plugin-control-endpoint-service";

	import EventBus from "spinal-env-viewer-room-manager/js/event";

	export default {
		name: "dialogComponent",
		components: {
			"link-template": LinkToGroupTemplate,
		},
		props: ["onFinised"],
		data() {
			this.contextId;
			this.nodeId;
			this.STATES = {
				normal: "normal",
				loading: "loading",
				success: "success",
				error: "error",
			};
			return {
				showDialog: true,
				data: [],
				groups: [],
				categories: [],
				controlPoints: [],
				contextSelected: undefined,
				categorySelected: undefined,
				groupSelected: undefined,
				controlPointSelected: undefined,
				items: [],
				type: undefined,
				callback: undefined,
				state: this.STATES.normal,
			};
		},

		mounted() {
			EventBus.$on("itemCreated", (id) => {
				this.getAllData();
			});
		},

		methods: {
			async opened({ contextId, nodeId, type, callback }) {
				// this.items = option.itemSelected;
				this.contextId = contextId;
				this.nodeId = nodeId;

				this.type = type;
				this.callback = callback;
				this.state = this.STATES.loading;

				try {
					await this.getAllData();
					this.state = this.STATES.normal;
				} catch (error) {
					this.state = this.STATES.error;
				}

				// console.log(this.data);
			},

			async link() {
				this.state = this.STATES.loading;
				try {
					await spinalControlPointService.linkControlPointToGroup(
						this.nodeId,
						this.contextSelected,
						this.controlPointSelected
					);

					if (typeof this.callback !== "undefined") {
						const context = this.data.find(
							(el) => el.id === this.contextSelected
						);
						const category = this.categories.find(
							(el) => el.id === this.categorySelected
						);
						const group = this.groups.find(
							(el) => el.id === this.groupSelected
						);

						this.callback(context, category, group);
					}
					this.state = this.STATES.success;
				} catch (error) {
					this.state = this.STATES.error;
				}
			},

			async removed(option) {
				// if (option) {
				// 	// this.items.forEach((el) => {
				// 	//   attributeService.linkItem(
				// 	//     this.contextSelected,
				// 	//     this.groupSelected,
				// 	//     el.id
				// 	//   );
				// 	// });
				// }
				this.showDialog = false;
			},

			closeDialog(closeResult) {
				if (typeof this.onFinised === "function") {
					this.onFinised(closeResult);
				}
			},

			getAllData() {
				return attributeService
					.getAllGroupContext(spinalControlPointService.CONTROL_POINT_TYPE)
					.then((res) => {
						this.data = res;
						this.updateCategory();
						this.updateGroups();
						this.updateControlPoints();
					});
			},

			// getCategories() {
			//   this.categorySelected = undefined;

			//   if (this.contextSelected) {
			//     let val = this.data.find(el => el.id === this.contextSelected);
			//     if (val) return val.category;
			//   }
			//   return [];
			// },
			getGroups() {
				this.groupSelected = undefined;

				if (this.contextSelected && this.categorySelected) {
					let context = this.data.find(
						(el) => el.id === this.contextSelected
					);
					if (context) {
						let category = context.category.find(
							(el) => el.id == this.categorySelected
						);

						if (category) return category.groups;
					}
				}
				return [];
			},

			// disabled() {
			// 	return !(
			// 		this.contextSelected &&
			// 		this.categorySelected &&
			// 		this.groupSelected &&
			// 		this.controlPointSelected &&
			// 		this.state === this.STATES.normal
			// 	);
			// },

			createContext() {
				spinalPanelManagerService.openPanel("createGroupContextDialog", {
					title: "Create a Grouping Context",
					typePreselected: spinalControlPointService.CONTROL_POINT_TYPE,
					callback: (id) => (this.contextSelected = id),
				});
			},

			createCategory() {
				spinalPanelManagerService.openPanel("createCategoryDialog", {
					title: "add Category",
					contextId: this.contextSelected,
					selectedNode: SpinalGraphService.getInfo(this.contextSelected),
					callback: (id) => (this.categorySelected = id),
				});
			},

			createGroup() {
				spinalPanelManagerService.openPanel("createGroupDialog", {
					title: "add Group",
					contextId: this.contextSelected,
					selectedNode: SpinalGraphService.getInfo(this.categorySelected),
					callback: (id) => (this.groupSelected = id),
				});
			},

			//////////////////////////////////////////////////////////////////
			// Updates
			//////////////////////////////////////////////////////////////////

			updateCategory() {
				// this.categorySelected = undefined;
				this.categories = [];
				if (this.contextSelected) {
					let val = this.data.find((el) => el.id === this.contextSelected);
					if (val) this.categories = val.category;
				}
			},

			updateGroups() {
				// this.groupSelected = undefined;
				this.groups = [];
				if (this.contextSelected && this.categorySelected) {
					let context = this.data.find(
						(el) => el.id === this.contextSelected
					);
					if (context) {
						let category = context.category.find(
							(el) => el.id == this.categorySelected
						);

						if (category) this.groups = category.groups;
					}
				}
			},

			async updateControlPoints() {
				this.controlPoints = [];
				if (
					this.contextSelected &&
					this.categorySelected &&
					this.groupSelected
				) {
					const res = await spinalControlPointService.getControlPoint(
						this.groupSelected
					);
					this.controlPoints = res.map((el) => el.get());
				}
			},

			//////////////////////////////////////////////////////////////////
			// Select
			//////////////////////////////////////////////////////////////////

			selectContext(id) {
				if (this.contextSelected === id) {
					this.contextSelected = undefined;
					return;
				}
				this.contextSelected = id;
			},

			selectCategory(id) {
				if (this.categorySelected === id) {
					this.categorySelected = undefined;
					return;
				}
				this.categorySelected = id;
			},

			selectGroup(id) {
				if (this.groupSelected === id) {
					this.groupSelected = undefined;
					return;
				}
				this.groupSelected = id;
			},

			selectControlPoint(id) {
				if (this.controlPointSelected === id) {
					this.controlPointSelected = undefined;
					return;
				}
				this.controlPointSelected = id;
			},
		},
		computed: {
			disabled() {
				return !(
					this.contextSelected &&
					this.categorySelected &&
					this.groupSelected &&
					this.controlPointSelected &&
					this.state === this.STATES.normal
				);
			},

			success() {
				return this.state === this.STATES.success;
			},
			error() {
				return this.state === this.STATES.error;
			},
		},
		watch: {
			contextSelected() {
				this.categorySelected = undefined;
				this.groupSelected = undefined;

				this.updateCategory();
				this.updateGroups();
				this.updateControlPoints();
			},

			categorySelected() {
				this.groupSelected = undefined;

				this.updateGroups();
				this.updateControlPoints();
			},

			groupSelected() {
				this.controlPointSelected = undefined;
				this.updateControlPoints();
			},
		},
	};
</script>

<style scoped>
	.mdDialogContainer {
		width: 100%;
		height: 600px;
	}

	.mdDialogContainer .dialogTitle {
		text-align: center;
	}

	.mdDialogContainer .content {
		height: 100%;
		display: flex;
		justify-content: space-between;
		align-items: stretch;
	}

	.md-dialog-container .states {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.mdDialogContainer .content .section {
		width: 24%;
		border: 1px solid grey;
		border-radius: 4% 4% 0 0;
		padding: 15px;
	}

	/* .mdIcon {
  display: flex;
  align-items: center;
} */
</style>

<style>
	.mdDialogContainer .md-dialog-container {
		max-width: 100%;
		max-height: 100%;
	}
</style>