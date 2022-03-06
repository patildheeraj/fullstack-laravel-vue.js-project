<template>
    <div>
        <!-- Delete Confirmation model -->
        <Modal
            :value="getDeleteModelObj.showDeleteModel"
            :mask-closable="false"
            :closable="false"
            width="360"
        >
            <p slot="header" style="color: #f60; text-align: center">
                <Icon type="ios-information-circle"></Icon>
                <span>Delete confirmation</span>
            </p>
            <div style="text-align: center">
                <p>Are you sure, You want to delete this?</p>
            </div>
            <div slot="footer">
                <Button type="default" @click="closeModel">Close</Button>
                <Button
                    type="error"
                    :loading="isDeleting"
                    :disabled="isDeleting"
                    @click="deleteTag"
                    >Delete</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            isDeleting: false,
        };
    },
    computed: {
        ...mapGetters(["getDeleteModelObj"]),
    },
    methods: {
        async deleteTag() {
            this.isDeleting = true;
            const res = await this.callApi(
                "post",
                this.getDeleteModelObj.deleteUrl,
                this.getDeleteModelObj.data
            );
            if (res.status === 200) {
                this.s("Deleted successfully!");
                this.$store.commit("setDeleteModel", true);
            } else {
                this.swr();
                this.$store.commit("setDeleteModel", false);
            }
            this.isDeleting = false;
        },
        closeModel() {
            this.$store.commit("setDeleteModel", false);
        },
    },
};
</script>
