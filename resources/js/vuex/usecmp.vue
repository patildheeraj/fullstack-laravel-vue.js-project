<template>
    <div class="content">
        <div class="container-fluid">
            <h1>All vuex cmp</h1>
            <h2>current state counter: {{ $store.state.counter }}</h2>

            ----------------------------------------------------------------------------
            <cmp-a />
            <cmp-b />
            <cmp-c />

            <Button type="primary" @click="changeState"
                >Change the State</Button
            >
        </div>
    </div>
</template>

<script>
import cmpA from "./comA.vue";
import cmpB from "./comB.vue";
import cmpC from "./comC.vue";
export default {
    components: {
        cmpA,
        cmpB,
        cmpC,
    },
    methods: {
        changeState() {
            this.$store.commit("change", 1);
        },
    },
};
</script>
