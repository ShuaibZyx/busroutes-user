<template>
  <div class="header">
    <div class="logo">
      <el-tooltip effect="light" content="不许点我!🥶" :enterable="false">
        <img
          src="../assets/icons/buswebicon.png"
          width="40px"
          @click="$router.push('/home')"
          style="cursor: pointer"
        />
      </el-tooltip>
      <span class="title">公交线路查询系统</span>
      <div class="operation">
        <el-button
          circle
          icon="el-icon-house"
          size="mini"
          @click="$router.push('/index')"
        />
        <el-button circle icon="el-icon-s-opportunity" size="mini" />
      </div>
    </div>
    <div></div>
    <div class="userbox">
      <span v-if="userInfo.cityCode !== ''"
        >当前所在城市: {{ userInfo.cityCode | cityFormat }}</span
      >
      <el-tooltip
        v-if="userInfo.cityCode === '' && $route.path !== '/profile'"
        effect="light"
        content="点击前往更新"
        placement="top"
      >
        <el-link type="primary" @click="$router.push('/profile')">
          请在个人信息页面更新您的位置信息
        </el-link>
      </el-tooltip>
      <div class="user">
        <span>{{ userInfo.nickname }}</span>
        <el-dropdown>
          <el-avatar size="medium" style="cursor: pointer">
            <el-image
              :src="
                userInfo.avatarFile
                  ? userInfo.avatarFile?.fileUrl
                  : require('../assets/icons/man.png')
              "
            />
          </el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!$route.path.includes('/profile')">
              <span @click="$router.push('/profile')">我的信息</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="$route.path !== '/index'">
              <span @click="$router.push('/index')">返回主页</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    //获取当前登录的用户信息
    async getUserInfoByToken() {
      const token = JSON.parse(window.sessionStorage.getItem("token"));
      const { data: userInfoRes } = await this.$axios.get(
        "user/info/token/" + token
      );
      this.userInfo = userInfoRes.data;
      this.$store.commit("setUserInfo", userInfoRes.data);
    },

    //退出登录
    logout() {
      window.sessionStorage.removeItem("token");
      this.$cookies.remove("token");
      this.$router.push("/login");
      this.$message({
        message: "已退出登录",
        type: "success",
        center: true,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getUserInfoByToken();
  },
};
</script>

<style lang="less">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    .title {
      margin-left: 10px;
      font-weight: bold;
    }
  }
  .userbox {
    width: 35%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user {
      width: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .operation {
    margin-left: 40px;
    .el-button {
      background-color: transparent;
    }
  }
}
</style>
