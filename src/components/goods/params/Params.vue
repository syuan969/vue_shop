<template>
  <div class="params">
    <!-- 面包屑导航 -->
    <Breadcrumb name1="商品管理" name2="参数列表" />
    <!-- 卡片区 -->
    <el-card>
      <!-- 头部警告条 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
      </el-alert>
      <el-row class="cat_top">
        <span>选择商品分类：</span>
        <el-cascader v-model="selectdCateKeys" :options="cataList" :props="{expandTrigger:'hover',...cateProps}" @change="handleChange"></el-cascader>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数---------------------------- -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand" v-slot="scope">
              <template>
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClosed(index,scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性------------------------------- -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand" v-slot="scope">
              <template>
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" @click="removeParams(scope.row.attr_id)" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @closed="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @closed="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { paramsFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'content/breadcrumb/Breadcrumb'
export default {
  name: 'Params',
  mixins: [paramsFormRulesMixin],
  components: {
    Breadcrumb
  },
  data() {
    return {
      cataList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectdCateKeys: [],
      // 页签区
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {},
      editForm: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$http.get('categories').then(res => {
        // console.log(res);
        this.cataList = res.data.data;
        // console.log(this.cataList);
      })
    },
    // 选择器变化
    handleChange() {
      // console.log(this.selectdCateKeys);
      console.log('cateId:' + this.cateId);
      this.getParamsData()
    },
    // 页签点击
    handleClick() {
      console.log(this.activeName);
      this.getParamsData()
    },
    // 获取参数列表的数据
    // async getParamsData() {
    //   if (this.selectdCateKeys.length !== 3) {
    //     this.selectdCateKeys = []
    //     this.manyTableData = []
    //     this.onlyTableData = []
    //     return
    //   }
    //   const { data: wes } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
    //   wes.data.forEach(item => {
    //     item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
    //     // this.$set(item,'inputVisible','false')
    //     // this.$set(item,'inputValue','')
    //     // 控制文本框的显示和隐藏
    //     item.inputVisible = false
    //     item.inputValue = ''
    //   })
    //   this.manyTableData = wes.data
    //   console.log(this.manyTableData);
    //   const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
    //   res.data.forEach(item => {
    //     item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
    //     this.$set(item, 'inputVisible', 'false')
    //     this.$set(item, 'inputValue', '')
    //     // 控制文本框的显示和隐藏
    //     // item.inputVisible = false
    //     // item.inputValue = ''
    //   })
    //   this.onlyTableData = res.data
    //   console.log(this.onlyTableData);
    // },
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 证明选中的是三级分类
      // console.log(this.selectdCateKeys)
      // 根据所选的分类的ID,和当前所处的面板,获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      // 获取Tag的数据分割为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示和隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      console.log(res.data)
    },
    // 添加分类、属性
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败');
        }
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 修改信息
    editParams() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        }).then(res => {
          console.log(res);
          this.$message.success('修改成功')
          this.getParamsData()
          this.editDialogVisible = false
        }).catch(wes => {
          this.$message.error('修改参数失败!')
        })
      })
    },
    // 点击按钮展示修改的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: { attr_sel: this.activeName }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败!')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // showEditDialog(val,id) {
    //   console.log(val);
    //   console.log(id);
    // 固定死了，input无法修改
    //   this.editForm.attr_name=val
    //   this.editForm.attr_id=id
    //   this.editDialogVisible = true
    // },

    // 删除分类
    removeParams(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.$http.delete(`categories/${this.cateId}/attributes/${id}`).then(() => {
          this.$message.success('删除成功')
          this.getParamsData()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      }).catch(() => {
        this.$message.info('已取消操作')
      })

    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 失去焦点
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      // 如果没有return证明内容合法做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 点击
    showInput(row) {
      console.log(row);
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除标签
    handleClosed(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 编辑提交参数
    saveAttrVals(row) {
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_sel: this.activeName,
        attr_name: row.attr_name,
        attr_vals: row.attr_vals.join(' ')
      }).then(() => {
        this.$message.success('修改参数项成功')
      }).catch(err => {
        this.$message.error('修改参数项失败')
      })
    },
    zxc() {
      console.log('hhhhh');
    }
    // async saveAttrVals(row) {
    //   const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
    //     attr_sel: this.activeName,
    //     attr_name: row.attr_name,
    //     attr_vals: row.attr_vals.join(' ')
    //   })
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('修改参数项失败!')
    //   }
    //   this.$message.success('修改参数项成功!')
    // }

  },
  computed: {
    // 按钮禁用
    isBtnDisabled() {
      if (this.selectdCateKeys.length != 3) {
        return true
      } else {
        return false
      }
    },
    // 保存id
    cateId() {
      if (this.selectdCateKeys.length === 3) {
        return this.selectdCateKeys[2]
      } else {
        return null
      }
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_top {
  margin-top: 15px;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 90px;
  margin: 5px 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin: 5px 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>