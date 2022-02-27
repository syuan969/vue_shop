<template>
  <div class="List">
    <Breadcrumb name1="商品管理" name2="商品列表" />
    <el-card>
      <!-- 搜索添加 -->
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear='getGoodsList' clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addList">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="价格(元)"></el-table-column>
          <el-table-column prop="goods_number" label="商品数量"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column label="创建时间">
            <template v-slot="scope">
              {{ scope.row.add_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEdit(scope.row)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeList(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 15, 30, 50,100,200]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editList" :rules="editListRules" ref="editListRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editList.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="editList.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="editList.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="editList.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPut">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GoodsListFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'content/breadcrumb/Breadcrumb'
export default {
  name: "List",
  mixins: [GoodsListFormRulesMixin],
  components: {
    Breadcrumb
  },
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      editDialogVisible: false,
      editList: {}

    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败!')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    showEdit(row) {
      console.log(row.goods_id);
      this.$http.get(`goods/${row.goods_id}`).then(res => {
        this.editList = res.data.data
        this.editDialogVisible = true
      })
    },
    editPut() {
      this.$refs.editListRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`goods/${this.editList.goods_id}`, this.editList)
        // console.log(res);
        if(res.meta.status !==200){
          return this.$message.error('修改失败!')
        }
        this.editDialogVisible = false
        this.getGoodsList()
      })
    },
    removeList(id) {
      console.log(id);
      this.$confirm('此操作将永久删除该商品, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${id}`).then(res => {
          this.$message.success('删除成功!')
          this.getGoodsList()
        })
      }).catch(err=>err)
    },
    addList() {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style>
</style>