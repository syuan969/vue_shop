<template>
  <div>
    <Breadcrumb name1="订单管理" name2="订单列表" />
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="ordersList.goods" border width="100%">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number" width='400px'></el-table-column>
          <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
          <el-table-column label="是否付款" width="100px">
            <template v-slot="scope">
              <el-tag type="warning" v-if="scope.row.pay_status =='0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" width="100px"> </el-table-column>
          <el-table-column label="下单时间">
            <template v-slot="scope">
              {{scope.row.update_time | dataFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template>
              <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="物流状态" placement="top">
                <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 30, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressDialogVisible" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{ expandTrigger: 'hover'}">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流提示框 -->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: "Order",
  components: {
    Breadcrumb
  },
  data() {
    return {
      ordersList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 修改地址对话框
      addressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData,
      // 物流对话框
      progressDialogVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      // console.log(res);
      this.ordersList = res.data
      this.total = res.data.total
      console.log(this.ordersList);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getOrdersList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val
      this.getOrdersList()
    },
    showBox() {
      this.addressDialogVisible = true
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo);
      this.progressDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>