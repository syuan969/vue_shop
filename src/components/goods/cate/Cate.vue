<template>
  <div class="cate">
    <!-- 面包屑 -->
    <Breadcrumb name1="商品管理" name2="商品分类" />
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
      <el-row>
        <!-- 表格 -->
        <tree-table :data='cateList' :columns="columns" show-index :expand-type="false" :selection-type="false" stripe border :show-row-hover="false" class="treetable">
          <!-- 是否有效 -->
          <template v-slot:isok="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
            <i class="el-icon-error" style="color: red" v-else></i>
          </template>
          <!-- 排序 -->
          <template v-slot:order="scope">
            <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag size="mini" type="warning" v-else>三级</el-tag>
          </template>
          <!-- 两个操作按钮 -->
          <template v-slot:opt="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @closed='addCateDialogClosed'>
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader expand-trigger="hover" v-model="selectdKeys" :options="parentCateList" :props="{...cascaderProps,checkStrictly:'true'}" @change="parentCateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改信息" :visible.sync="editCateDialogVisible" width="50%">
      <el-form :model="editCate" :rules="editCateRules" ref="editCateRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: "Cate",
  components: { Breadcrumb },
  data() {
    return {
      // 商品分类的数据列表,默认为空
      cateList: [],
      // 请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示,将当前列定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加分类的名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类层级,默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类列表数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectdKeys: [],
      // 编辑信息框
      editCateDialogVisible: false,
      editCate: {},
      editCateRules: {
        cat_name: [{ required: true, message: '请输入要修改的信息', trigger: 'blur' }]
      },
      editCateId: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      // 把数据列表赋值给cateList
      this.cateList = res.data.result
      // 获取商品的总数量
      this.total = res.data.total
    },
    // 监听pagesize改变(每页多少条)
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 监听当前页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 添加分类按钮
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 选中父级分类变化
    parentCateChanged() {
      console.log(this.selectdKeys);
      if (this.selectdKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
        this.addCateForm.cat_level = this.selectdKeys.length
        console.log(this.addCateForm);
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败!')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList);
      console.log(this.cascaderProps);
      // console.log(...this.cascaderProps);
    },
    // 点击按钮添加新的分类
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        // this.$http.post('categories',this.addCateForm).then(()=>{
        //   this.$message.success('添加分类成功!')
        //   this.getCateList()
        //   this.addCateDialogVisible=false
        // })
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 关闭对话框事件,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectdKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 编辑按钮
    async showEditCateDialog(id) {
      console.log(id);
      this.editCateId = id;
      const { data: res } = await this.$http.get('categories/' + id)
      console.log(res);
      this.editCate = res.data;
      console.log(this.editCate);
      this.editCateDialogVisible = true
    },
    // 提交更改
    editCateInfo() {
      this.$refs.editCateRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editCateId, this.editCate.cat_name)
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类数据失败!')
        }
        this.$message.success('更新分类数据成功!')
        this.getCateList();
        this.editCateDialogVisible = false
      })
    },
    // 删除
    async removeCate(id) {
      // console.log(id);
      // this.$confirm('此操作将永久删除该分类, 是否继续?','删除分类',{
      //   confirmButtonText:'确定',
      //   cancelButtonText:'取消',
      //   type: 'warning'
      // }).then(res=>{
      //   console.log(res);
      //   this.$http.delete('categories/'+id)
      //   this.$message.success('删除成功！')
      //   this.getCateList()这种刷新不成功不知道为什么
      // }).catch(err=>err)
      const confirRustle = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirRustle !== 'confirm') {
        return this.$message.info('已取消删除操作!')
      }

      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('分类删除失败!')
      }
      this.$message.success('该分类已经成功删除!')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treetable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>