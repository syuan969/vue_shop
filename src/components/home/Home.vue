<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header class="header">
      <div>
        <img src="~assets/logo1.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="isCollapse ? '61px' : '200px'" class="aside">
        <div class="togglebutton" @click="toggleCollpase">{{qie}}</div>
        <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :unique-opened='true' :collapse-transition='false' :router="true">
          <!-- 一级菜单 -->
          <el-submenu :index="index+''" v-for="(item,index) in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 标题 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveActivePath(subItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      qie: '|||',
      menuList: [],
      iconsObj: {
        // 一级菜单的icon图标
        147: "el-icon-magic-stick",
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false, // 是否折叠属性
      activePath: '',
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath")
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // this.$message.success(res.meta.msg);
      this.menuList = res.data;
      // console.log(res);
    },
    toggleCollpase() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) return this.qie = '|||'
      this.qie = '三'
    },
    saveActivePath(activePath) {
      // console.log('111');
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.header {
  background-color: rgb(62, 63, 65);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 24px;
  > div {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      height: 80%;
      border-radius: 50%;
      border: 2px solid #fff;
    }
    span {
      margin-left: 15px;
    }
  }
}
.aside {
  background-color: #545c64;
  .togglebutton {
    background-color: #4a5064;
    text-align: center;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border-right: 0;
  }
}
.main {
  background-color: rgb(240, 240, 240);
}
.iconfont {
  margin-right: 10px;
}
</style>