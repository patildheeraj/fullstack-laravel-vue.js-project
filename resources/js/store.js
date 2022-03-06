import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        counter: 1000,
        deleteModelObj: {
            showDeleteModel: false,
            deleteUrl: "",
            data: null,
            deletingIndex: -1,
            isDeleted: false,
        },
    },
    getters: {
        getDeleteModelObj(state) {
            return state.deleteModelObj;
        },
    },
    mutations: {
        setDeleteModel(state, data) {
            const deleteModelObj = {
                showDeleteModel: false,
                deleteUrl: "",
                data: null,
                deletingIndex: -1,
                isDeleted: data,
            };
            state.deleteModelObj = deleteModelObj;
        },
        setDeletingModelObj(state, data) {
            state.deleteModelObj = data;
        },
    },
});
