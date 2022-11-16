<template>
  <el-container class="home">
    <el-header height="60px">
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer height="40px">
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "Home",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="less">
.home {
  height: 100%;
  .el-header {
    display: flex;
    align-items: center;
    background-color: rgb(251, 254, 238);
    border-bottom: 1px rgb(200, 200, 200) solid;
  }
  .el-footer {
    display: flex;
    align-items: center;
    border-top: 1px rgb(200, 200, 200) solid;
  }
  .el-main {
    background-color: #fff;
  }
}
</style>
