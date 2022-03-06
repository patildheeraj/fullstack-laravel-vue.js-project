<template>
    <div class="content">
        <div class="container-fluid">
            <!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
            <div
                class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20"
            >
                <p class="_title0">
                    Tags
                    <Button @click="addModel = true" class="float-right"
                        ><Icon type="md-add" />Add Tag</Button
                    >
                </p>

                <div class="_overflow _table_div mt-3">
                    <table class="_table">
                        <!-- TABLE TITLE -->
                        <tr>
                            <th>Id</th>
                            <th>Tag Name</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                        <!-- TABLE TITLE -->

                        <!-- ITEMS -->
                        <tr v-for="(tag, i) in tags" :key="i">
                            <td>{{ tag.id }}</td>
                            <td class="_table_name">
                                {{ tag.tagName }}
                            </td>
                            <td>{{ tag.created_at }}</td>
                            <td>
                                <Button
                                    type="info"
                                    size="small"
                                    @click="showEditModel(tag, i)"
                                    >Edit</Button
                                >
                                <Button
                                    type="error"
                                    size="small"
                                    @click="showDeletingModel(tag, i)"
                                    :loading="tag.isDeleting"
                                    >Delete</Button
                                >
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Tag adding model -->
                <Modal
                    v-model="addModel"
                    title="Add Tag"
                    :mask-closable="false"
                    :closable="false"
                >
                    <Input v-model="data.tagName" placeholder="Add tag Name" />
                    <div slot="footer">
                        <Button type="default" @click="addModel = false"
                            >Close</Button
                        >
                        <Button
                            type="primary"
                            @click="addTag"
                            :disabled="isAdding"
                            :loading="isAdding"
                            >{{ isAdding ? "Adding..." : "Add Tag" }}</Button
                        >
                    </div>
                </Modal>

                <!-- Tag edit model -->
                <Modal
                    v-model="editModel"
                    title="Edit Tag"
                    :mask-closable="false"
                    :closable="false"
                >
                    <Input v-model="editData.tagName" />
                    <div slot="footer">
                        <Button type="default" @click="editModel = false"
                            >Close</Button
                        >
                        <Button
                            type="primary"
                            @click="editTag"
                            :disabled="isAdding"
                            :loading="isAdding"
                            >{{
                                isAdding ? "Updating..." : "Update Tag"
                            }}</Button
                        >
                    </div>
                </Modal>

                <!-- Delete Confirmation model -->
                <!-- <Modal v-model="showDeleteModel" width="360">
                    <p slot="header" style="color: #f60; text-align: center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>Delete confirmation</span>
                    </p>
                    <div style="text-align: center">
                        <p>Are you sure, You want to delete this tag?</p>
                    </div>
                    <div slot="footer">
                        <Button
                            type="error"
                            size="large"
                            long
                            :loading="isDeleting"
                            :disabled="isDeleting"
                            @click="deleteTag"
                            >Delete</Button
                        >
                    </div>
                </Modal> -->
                <DeleteModel></DeleteModel>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteModel from "../../admin/components/DeleteModel.vue";

export default {
    components: {
        DeleteModel,
    },
    data() {
        return {
            data: { tagName: "" },
            addModel: false,
            editModel: false,
            isAdding: false,
            tags: [],
            editData: {
                tagName: "",
            },
            index: -1,
            showDeleteModel: false,
            isDeleting: false,
            deleteItem: {},
        };
    },
    methods: {
        async addTag() {
            if (this.data.tagName.trim() == "")
                return this.i("Tag name is required!");
            const res = await this.callApi("post", "app/create_tag", this.data);
            if (res.status === 201) {
                this.tags.unshift(res.data);
                this.s("Tag has been added successfully!");
                this.addModel = false;
                this.data.tagName = "";
            } else {
                if (res.status === 422) {
                    if (res.data.errors.tagName) {
                        this.i(res.data.errors.tagName);
                    }
                    console.log(res.data.errors.tagName);
                } else {
                    this.swr();
                }
            }
        },
        showEditModel(tag, index) {
            let obj = {
                id: tag.id,
                tagName: tag.tagName,
            };
            this.editData = obj;
            this.editModel = true;
            this.index = index;
        },
        async editTag() {
            if (this.editData.tagName.trim() == "")
                return this.i("Tag name is required!");
            const res = await this.callApi(
                "post",
                "app/edit_tag",
                this.editData
            );
            if (res.status === 200) {
                this.tags[this.index].tagName = this.editData.tagName;
                this.s("Tag has been update successfully!");
                this.editModel = false;
                this.editData.tagName = "";
            } else {
                if (res.status === 422) {
                    if (res.data.errors.tagName) {
                        this.i(res.data.errors.tagName);
                    }
                    console.log(res.data.errors.tagName);
                } else {
                    this.swr();
                }
            }
        },

        showDeletingModel(tag, i) {
            let deleteModelObj = {
                showDeleteModel: true,
                deleteUrl: "app/delete_tag",
                data: tag,
                deletingIndex: i,
                isDeleted: false,
            };
            this.$store.commit("setDeletingModelObj", deleteModelObj);
            // this.showDeleteModel = true;
            // this.deleteItem = tag;
            // this.index = i;
        },
    },
    async created() {
        const res = await this.callApi("get", "app/get_tags");
        if (res.status === 200) {
            this.tags = res.data;
            // console.log(this.tags);
        } else {
            this.swr();
        }
    },
    computed: {
        ...mapGetters(["getDeleteModelObj"]),
    },
    watch: {
        getDeleteModelObj(obj) {
            console.log(obj);
            if (obj.isDeleted) {
                this.tags.splice(obj.deletingIndex, 1);
            }
        },
    },
};
</script>
