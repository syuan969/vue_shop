<template>
  <div class="add">
    <Breadcrumb name1="商品管理" name2="添加商品" />
    <!-- 卡片 -->
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" center type="info" show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps align-center :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- table >>>>>tab栏-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover', ...cateProps }" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="item" v-for="(item,index) in item.attr_vals" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
            class="upload-demo"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj"
            :on-success="handleSuccess"
            >
            <el-button size="small" type="primary">点击上传</el-button></el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
             <el-button type="primary" class="AddBtn" @click="addShop">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import { goodsAddFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: "Add",
  mixins: [goodsAddFormRulesMixin],
  components: {
    Breadcrumb
  },
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://82.157.53.213:8886/api/private/v1/upload',
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图片的路径
      previewPath: '',
      // 图片预览的对话框
      previewDialogVisible:false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories').then(res => {
        this.cateList = res.data.data
        // console.log(this.cateList);
      })
    }
    ,
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开标签页的名字: ', oldActiveName)
      // console.log('即将进入标签页的名字: ', activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    async tabClicked() {
      console.log(this.activeIndex);
      console.log(this.cateList);
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态列表失败!')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }else if (this.activeIndex === '2') {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态列表失败!')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    handlePreview(file){
      // 替换接口地址
      this.previewPath=file.response.data.url.replace('http://127.0.0.1:8888', 'http://82.157.53.213:8886')
      this.previewDialogVisible=true
    },
    // 移除图片的操作
    handleRemove(file){
      // 1. 获取将要删除的图片的临时路径
      const filePath =file.response.data.tmp_path
      const index=this.addForm.pics.findIndex(x => x.pic === filePath)
      // console.log(index);
      this.addForm.pics.splice(index,1)
    },
    handleSuccess(response){
      // console.log(response);
      const picInfo={pic:response.data.tmp_path}
      // console.log(picInfo);
      this.addForm.pics.push(picInfo)
      console.log(this.addForm);
    },
    addShop() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        const copy=this.addForm.goods_cat
        this.addForm.goods_cat=copy.join(',')
        // console.log(this.addForm.goods_cat);
        // console.log(this.addForm);
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        const {data:res} =await this.$http.post('goods',this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败!')
        }
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewImg{
  width: 100%;
}
</style>