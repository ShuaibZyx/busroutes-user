<template>
  <el-card shadow="never">
    <div slot="header">
      <el-page-header @back="$router.back()" content="我的信息" />
    </div>
    <div class="profile">
      <el-form
        :model="userInfo"
        :rules="userRules"
        label-width="auto"
        class="user"
        ref="form"
      >
        <div class="avatar">
          <el-form-item>
            <div class="img-box">
              <div class="img">
                <el-image
                  :src="
                    userInfo.avatarFile?.fileUrl ||
                    require('../assets/icons/man.png')
                  "
                  :preview-src-list="userAvatar"
                >
                  <div slot="error">
                    <el-image :src="require('../assets/icons/man.png')" />
                  </div>
                </el-image>
              </div>
              <el-upload
                ref="uploadAvatar"
                :action="baseUrl + 'user/avatar'"
                name="file"
                :data="{
                  userId: userInfo.userId,
                  dir: 'images',
                }"
                :headers="{
                  token,
                }"
                :accept="uploadFileTypeLimits.image"
                :on-change="handleAvatarChange"
                :show-file-list="false"
                :on-success="uploadAvatarSuccess"
              >
                <el-button type="primary" plain round size="mini"
                  >更换头像</el-button
                >
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item prop="nickname" label="昵称">
            <el-input
              v-model="userInfo.nickname"
              size="small"
              minlength="1"
              maxlength="20"
              clearable
              placeholder="昵称"
            />
          </el-form-item>
        </div>
        <el-form-item label="编号">
          <el-input
            v-model="userInfo.userId"
            size="small"
            readonly
            placeholder="编号"
          />
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input
            v-model="userInfo.telephone"
            size="small"
            maxlength="11"
            clearable
            placeholder="电话"
          />
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <el-radio-group v-model="userInfo.gender">
            <el-radio :label="0"><i class="el-icon-male"> 男</i></el-radio>
            <el-radio :label="1"><i class="el-icon-female"> 女</i></el-radio>
            <el-radio :label="2"
              ><i class="el-icon-question"> 未知</i></el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地址:" prop="cityCode">
          <el-cascader
            style="width: 100%"
            v-model="userInfo.cityCode"
            :options="citys"
            size="small"
            filterable
            clearable
            :props="{ expandTrigger: 'hover' }"
          />
        </el-form-item>
        <el-form-item label="出生日期:">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="userInfo.birthday"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input
            v-model="userInfo.email"
            type="email"
            size="small"
            clearable
            placeholder="邮箱"
          />
        </el-form-item>
        <el-form-item class="operation">
          <el-button type="info" size="mini" @click="resetUserInfo"
            >重置</el-button
          >
          <el-button type="primary" size="mini" @click="editUser"
            >更新</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import citys from "../assets/js/citys";
export default {
  name: "Profile",
  data() {
    return {
      //用户对象
      userInfo: {
        userId: "",
        nickname: "",
        telephone: "",
        gender: "",
        age: "",
        birthday: "",
        cityCode: "",
        email: "",
        avatarFileId: "",
        avatarFile: {},
      },
      //更新信息时的校验规则
      userRules: {
        nickname: [
          { required: true, message: "请输入用户昵称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9-\u4e00-\u9fa5]{1,20}$/,
            message: "长度在 1 到 20 个数字,中文或者字母",
            trigger: ["blur", "change"],
          },
        ],
        telephone: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            required: true,
            pattern: /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/,
            message: "输入不符合电话号码格式",
            trigger: "blur",
          },
        ],
        gender: [
          { required: true, message: "请选择用户性别", trigger: "blur" },
        ],
        cityCode: [
          { required: true, message: "请选择用户地址", trigger: "blur" },
        ],
        email: [
          {
            required: false,
            type: "email",
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            message: "邮箱格式不符",
            trigger: "blur",
          },
        ],
      },
      //级联选择器可选城市
      citys,
      //用户头像预览数组
      userAvatar: [],
    };
  },
  computed: {
    userAge() {
      return this.$moment().diff(
        this.userInfo.birthday.substring(0, 4),
        "years"
      );
    },
    //token
    token() {
      return JSON.parse(window.sessionStorage.getItem("user_token"));
    },
    //默认后端访问地址
    baseUrl() {
      return this.$store.state.baseUrl;
    },
    //不同类型的可上传文件列表
    uploadFileTypeLimits() {
      return this.$store.state.uploadFileTypeLimits;
    },
  },
  methods: {
    //获取当前登录的用户信息
    async getUserInfoByToken() {
      this.userAvatar = [];
      const { data: userInfoRes } = await this.$axios.get(
        "user/info/token/" + this.token
      );
      userInfoRes.data.cityCode = userInfoRes.data.cityCode.split("-");
      this.userAvatar.push(userInfoRes.data.avatarFile?.fileUrl);
      this.userInfo = userInfoRes.data;
      this.$store.commit("setUserInfo", userInfoRes.data);
    },

    //重置用户原有信息
    resetUserInfo() {
      this.$refs.form.resetFields();
      this.getUserInfoByToken();
    },

    //更新用户信息
    editUser() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        this.userInfo.age = this.userAge;
        this.userInfo.cityCode = this.userInfo.cityCode?.join("-");
        const { data: editUserRes } = await this.$axios.post(
          "user/modify",
          this.userInfo
        );
        this.resetUserInfo();
        this.$message({
          message: editUserRes.msg,
          type: `${editUserRes.code !== 200 ? "error" : "success"}`,
          center: true,
        });
      });
    },

    //文件/文件列表状态发生改变时触发的方法(用户头像)
    handleAvatarChange(file) {
      //文件大小
      const size = file.size / 1024 / 1024 < 1;
      //文件类型
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      const typeList = this.uploadFileTypeLimits.image;
      if (!typeList.includes(fileType)) {
        this.$message({
          message: "只可选择图片类型文件",
          center: true,
          type: "warning",
          showClose: true,
        });
        this.$refs.uploadAvatar.uploadFiles.pop();
        return;
      }
      if (!size) {
        this.$message({
          message: `文件大小不得超过1M 不符合的文件已被忽略`,
          center: true,
          type: "warning",
          showClose: true,
        });
        this.$refs.uploadAvatar.uploadFiles.pop();
        return;
      }
    },

    //用户头像修改成功触发事件
    uploadAvatarSuccess(response) {
      this.$message({
        message: `${response.code !== 200 ? "头像更新失败" : "头像更新成功"}`,
        type: `${response.code !== 200 ? "error" : "success"}`,
        center: true,
        showClose: true,
      });
      this.getUserInfoByToken();
    },
  },
  mounted() {
    this.getUserInfoByToken();
  },
};
</script>

<style lang="less">
.profile {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .user {
    width: 50%;
    .avatar {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      .img-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .img {
          border-radius: 5px;
          overflow: hidden;
          height: 80px;
          width: 80px;
        }
      }
    }
    .operation {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
