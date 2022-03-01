<template>
  <div class="welcome">
    <h2>欢迎登录到电商后台管理系统！</h2>
    <div class="info">
      <h1>练习项目</h1>
      <ul>
        <li><a href="https://symall.vercel.app/home" target="_blank">
            Codywhy蘑菇商城</a>
            <span> 《《----点击可跳转，现在后台Api接口已失效 --》》</span>
            <a
              href="https://www.bilibili.com/video/BV17j411f74d?t=12"
              target="_blank">源网站</a
            ></li>
        <li><a href="https://mi-static-page.vercel.app/" target="_blank">小米商城</a>
        <span> 《《----点击可跳转，练习临摹小米商城，静态页面 -- 》》</span>
        <a href="https://www.mi.com/" target="_blank">源网站</a></li>
        <li>
          <a href="https://pink-shop.vercel.app/" target="_blank">pink商城</a>
          <span> 《《----点击可跳转，早期学习，静态页面 -- 》》</span>
          <a
              href="https://www.bilibili.com/video/BV14J4114768?from=search&seid=6544069264377211049"
              target="_blank" >源网站</a
            >
        </li>
        <li><hr ></li>
        <li>
          <h1>项目源码存放</h1>
        </li>
        <li><a href="https://github.com/syuan969" target="_blank">Github</a>
         <span> 《《----点击可跳转,国外----》》</span></li>
        <li><a href="https://gitee.com/sanyuan969" target="_blank">Gitee</a>
        <span> 《《----点击可跳转,国内----》》</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome"
}
</script>

<style lang="less" scoped>
.welcome {
  font-size: 25px;
  background-color: #fff;
  color: skyblue;
  padding: 20px 50px;
  h2 {
    text-align: center;
  }
  ul {
    padding: 0;
    li {
      list-style: none;
      line-height: 40px;
      a {
        color: rgb(84, 199, 245);
        text-decoration: none;
        &:hover {
          color: rgb(35, 163, 214);
        }
      }
      span {
        font-size: 20px;
        margin: 0 20px;
        color: rgb(162, 204, 221);
      }
    }
  }
}
</style>