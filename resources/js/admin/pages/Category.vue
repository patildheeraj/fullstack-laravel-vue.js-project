<template>
    <div class="content">
        <div class="container-fluid">
            <!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
            <div
                class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20"
            >
                <p class="_title0">
                    Category
                    <Button @click="addModel = true" class="float-right"
                        ><Icon type="md-add" />Add Category</Button
                    >
                </p>

                <div class="_overflow _table_div mt-3">
                    <table class="_table">
                        <!-- TABLE TITLE -->
                        <tr>
                            <th>Id</th>
                            <th>Icon Image</th>
                            <th>Category Name</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                        <!-- TABLE TITLE -->

                        <!-- ITEMS -->
                        <tr v-for="(category, i) in categoryList" :key="i">
                            <td>{{ category.id }}</td>
                            <td class="table_image">
                                <img :src="`${category.iconImage}`" />
                            </td>
                            <td class="_table_name">
                                {{ category.categoryName }}
                            </td>
                            <td>{{ category.created_at }}</td>
                            <td>
                                <Button
                                    type="info"
                                    size="small"
                                    @click="showEditModel(category, i)"
                                    >Edit</Button
                                >
                                <Button
                                    type="error"
                                    size="small"
                                    @click="showDeletingModel(category, i)"
                                    :loading="category.isDeleting"
                                    >Delete</Button
                                >
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- category adding model -->
                <Modal
                    v-model="addModel"
                    title="Add Category"
                    :mask-closable="false"
                    :closable="false"
                >
                    <Input
                        v-model="data.categoryName"
                        placeholder="Add category Name"
                    />
                    <div class="mt-3"></div>
                    <Upload
                        ref="uploads"
                        type="drag"
                        :headers="{
                            'x-csrf-token': token,
                            'X-Requested-With': 'XMLHttpRequest',
                        }"
                        :format="['jpg', 'jpeg', 'png']"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="app/upload"
                    >
                        <div style="padding: 20px 0">
                            <Icon
                                type="ios-cloud-upload"
                                size="52"
                                style="color: #3399ff"
                            ></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
                    <div class="demo-upload-list" v-show="data.iconImage">
                        <img :src="`${data.iconImage}`" />
                        <div class="demo-upload-list-cover">
                            <Icon
                                type="ios-trash-outline"
                                @click="deleteImage"
                            ></Icon>
                        </div>
                    </div>
                    <div slot="footer">
                        <Button type="default" @click="addModel = false"
                            >Close</Button
                        >
                        <Button
                            type="primary"
                            @click="addCategory"
                            :disabled="isAdding"
                            :loading="isAdding"
                            >{{
                                isAdding ? "Adding..." : "Add category"
                            }}</Button
                        >
                    </div>
                </Modal>

                <!-- category edit model -->
                <Modal
                    v-model="editModel"
                    title="Edit Category"
                    :mask-closable="false"
                    :closable="false"
                >
                    <Input v-model="editData.categoryName" />

                    <div class="mt-3"></div>
                    <Upload
                        v-show="isIconImageNew"
                        ref="editDateUploads"
                        type="drag"
                        :headers="{
                            'x-csrf-token': token,
                            'X-Requested-With': 'XMLHttpRequest',
                        }"
                        :format="['jpg', 'jpeg', 'png']"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        action="app/upload"
                    >
                        <div style="padding: 20px 0">
                            <Icon
                                type="ios-cloud-upload"
                                size="52"
                                style="color: #3399ff"
                            ></Icon>
                            <p>Click or drag files here to upload</p>
                        </div>
                    </Upload>
                    <div class="demo-upload-list" v-show="editData.iconImage">
                        <img :src="`${editData.iconImage}`" />
                        <div class="demo-upload-list-cover">
                            <Icon
                                type="ios-trash-outline"
                                @click="deleteImage(false)"
                            ></Icon>
                        </div>
                    </div>

                    <div slot="footer">
                        <Button type="default" @click="closeEditModel"
                            >Close</Button
                        >
                        <Button
                            type="primary"
                            @click="editCategory"
                            :disabled="isAdding"
                            :loading="isAdding"
                            >{{
                                isAdding ? "Updating..." : "Update Category"
                            }}</Button
                        >
                    </div>
                </Modal>

                <!-- delete model -->
                <delete-model></delete-model>
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
            data: { categoryName: "", iconImage: "" },
            addModel: false,
            editModel: false,
            isAdding: false,
            categoryList: [],
            editData: {
                categoryName: "",
                iconImage: "",
            },
            index: -1,
            showDeleteModel: false,
            isDeleting: false,
            deleteItem: {},
            token: null,
            isIconImageNew: false,
            isEditingItem: false,
        };
    },
    methods: {
        async addCategory() {
            if (this.data.categoryName.trim() == "")
                return this.i("Category name is required!");
            if (this.data.iconImage.trim() == "")
                return this.i("Category Image is required!");
            // this.data.iconImage = `${this.data.iconImage}`;
            const res = await this.callApi(
                "post",
                "app/create_category",
                this.data
            );
            if (res.status === 201) {
                this.categoryList.unshift(res.data);
                this.s("Category has been added successfully!");
                this.addModel = false;
                this.data.categoryName = "";
                this.data.iconImage = "";
            } else {
                if (res.status === 422) {
                    if (res.data.errors) {
                        this.i(res.data.errors);
                    }
                    console.log(res.data.errors);
                } else {
                    this.swr();
                }
            }
        },
        showEditModel(category, index) {
            let obj = {
                id: category.id,
                categoryName: category.categoryName,
                iconImage: category.iconImage,
            };
            this.editData = obj;
            this.editModel = true;
            this.isEditingItem = true;
            this.index = index;
        },
        async editCategory() {
            if (this.editData.categoryName.trim() == "")
                return this.i("Category name is required!");
            if (this.editData.iconImage.trim() == "")
                return this.i("Category image is required!");
            const res = await this.callApi(
                "post",
                "app/edit_category",
                this.editData
            );
            if (res.status === 200) {
                this.categoryList[this.index].categoryName =
                    this.editData.categoryName;
                this.categoryList[this.index].iconImage =
                    this.editData.iconImage;
                this.s("Category has been update successfully!");
                this.editModel = false;
                this.editData.categoryName = "";
                this.editData.iconImage = "";
            } else {
                if (res.status === 422) {
                    if (res.data.errors) {
                        this.i(res.data.errors);
                    }
                    console.log(res.data.errors);
                } else {
                    this.swr();
                }
            }
        },

        showDeletingModel(category, i) {
            let deleteModelObj = {
                showDeleteModel: true,
                deleteUrl: "app/delete_category",
                data: category,
                deletingIndex: i,
                isDeleted: false,
            };
            this.$store.commit("setDeletingModelObj", deleteModelObj);

            // this.showDeleteModel = true;
            // this.deleteItem = tag;
            // this.index = i;
        },

        handleSuccess(res, file) {
            res = `/uploads/${res}`;
            if (this.isEditingItem) {
                return (this.editData.iconImage = res);
            }
            this.data.iconImage = res;
        },
        handleError(file) {
            this.$Notice.warning({
                title: "The file format is incorrect",
                desc:
                    "File format of " +
                    file.name +
                    " is incorrect, please select jpg or png.",
            });
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: "The file format is incorrect",
                desc:
                    "File format of " +
                    file.name +
                    " is incorrect, please select jpg or png.",
            });
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: "Exceeding file size limit",
                desc: "File  " + file.name + " is too large, no more than 2M.",
            });
        },
        async deleteImage(isAdd = true) {
            let image;
            if (!isAdd) {
                //for edit category image delete
                this.isIconImageNew = true;
                image = this.editData.iconImage;
                this.editData.iconImage = "";
                this.$refs.editDateUploads.clearFiles();
            } else {
                //for delete category image from add section
                image = this.data.iconImage;
                this.data.iconImage = "";
                this.$refs.uploads.clearFiles();
            }
            const res = await this.callApi("post", "app/delete_image", {
                imageName: image,
            });
            if (res.status != 200) {
                this.data.iconImage = image;
                this.swr();
            } else {
                this.s("Image removed!");
            }
        },
        closeEditModel() {
            this.editModel = false;
            this.isEditingItem = false;
        },
    },
    async created() {
        this.token = window.Laravel.csrfToken;
        const res = await this.callApi("get", "app/get_category");
        if (res.status === 200) {
            this.categoryList = res.data;
            console.log(this.categoryList);
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
                this.categoryList.splice(obj.deletingIndex, 1);
            }
        },
    },
};
</script>

<style>
.demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
</style>
