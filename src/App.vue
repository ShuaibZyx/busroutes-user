<template>
  <div id="app">
    <router-view />
    <el-card class="customer" v-if="$route.path !== '/issue'">
      <div style="width: 45px" @click="$router.push('/issue')">
        <el-image :src="require('./assets/icons/customer.png')" />
      </div>
    </el-card>
    <el-backtop />
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    window.addEventListener("unload", () => {
      window.sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    });
    window.addEventListener("load", () => {
      window.sessionStorage.removeItem("state");
    });
  },
  beforeDestroy() {
    window.removeEventListener("unload");
    window.removeEventListener("load");
  },
};
</script>

<style lang="less">
.customer {
  position: absolute;
  right: 2.5em;
  bottom: 100px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  .el-card__body {
    padding: 5px;
  }
}
</style>
