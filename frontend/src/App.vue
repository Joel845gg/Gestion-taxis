<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<script>
export default {
    data() {
        return {
            user: null
        }
    },
    created() {
        this.checkUser();
    },
    methods: {
        checkUser() {
            const u = localStorage.getItem('user');
            if (u) {
                this.user = JSON.parse(u);
            }
        },
        logout() {
            localStorage.clear();
            this.user = null;
            this.$router.push('/');
        }
    },
    watch: {
        $route() {
            this.checkUser();
        }
    }
}
</script>
