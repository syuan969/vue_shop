<template>
  <div class="login">
    <div class="bgc"></div>
    <div class="login-box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="~assets/logo1.jpg" alt="">
      </div>
      <!-- 表单提交 -->
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" @keyup.enter.native="login" placeholder="请输入用户号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password @keyup.enter.native="login" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="center">
          <el-button @click="login" type="primary" round :loading="isLoad">登录</el-button>
          <el-button @click="resetLoginForm" type="info" round>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      isLoad: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login() {
      this.isLoad = true
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return this.isLoad=false;
        const { data: res } = await this.$http.post('login', this.loginForm);
        // console.log(res);
        if (res.meta.status != 200) {
          this.isLoad=false
          this.$message.error('登录失败');
          return
        }
        this.$message.success('登录成功')
        // 保存登录成功后的token
        window.sessionStorage.setItem("token", res.data.token)
        this.$router.push('/home')
      })
    },
    // 重置表单功能
    resetLoginForm() {
      // console.log('1');
      this.$refs.loginFormRef.resetFields()
    }
  }
};
</script>

<style lang="less" scoped>
.bgc {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(~@/assets/bgc1.jpg) no-repeat;
  background-size: 100%;
  filter: blur(10px);
}
.bgc:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  background-color:rgba(255, 255, 255, 0.3);
  
}
.login {
  height: 100%;
  background: url(~@/assets/bgc1.jpg) no-repeat;
  background-size: cover;
  // filter: blur(10px);
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 5px 10px 20px rgba(0, 0, 0, 0.3);
    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeeeee;
      }
    }
    .login-form {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      padding: 0 20px;
      bottom: 0;
      .center{
        text-align: center;
      }
      .el-button{
        margin-right: 20px;
      }
    }
  }
}
</style>