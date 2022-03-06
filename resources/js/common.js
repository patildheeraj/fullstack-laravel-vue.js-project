export default {
    data() {
        return {};
    },
    methods: {
        async callApi(method, url, dataObj) {
            try {
                // Send a POST request
                return await axios({
                    method: method,
                    url: url,
                    data: dataObj,
                });
            } catch (error) {
                return error.response;
            }
        },

        i(desc, title = "Hey!") {
            this.$Notice.info({
                title: title,
                desc: desc,
            });
        },
        s(desc, title = "Great!") {
            this.$Notice.success({
                title: title,
                desc: desc,
            });
        },
        w(desc, title = "Oops!") {
            this.$Notice.warning({
                title: title,
                desc: desc,
            });
        },
        e(desc, title = "Oops!") {
            this.$Notice.error({
                title: title,
                desc: desc,
            });
        },
        swr(desc = "Something went wrong! please try again", title = "Hey!") {
            this.$Notice.error({
                title: title,
                desc: desc,
            });
        },
    },
};
