<template>
  <div>
    <breadcrumb name1="权限管理" name2="角色列表" />
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <!-- 添加角色 -->
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
        <!-- 角色列表 -->
        <el-col>
          <el-table :data="rolesList">
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template v-slot='scope'>
                <el-row v-for="(item1, i1 ) in scope.row.children" :key="item1.id" :class="['bdtop', i1 === 0 ? 'bdbottom' : '','vcenter']">
                  <!-- 渲染一级菜单 -->
                  <el-col :span="5">
                    <el-tag closable effect="plain" @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right" style="color:#ccc"></i>
                  </el-col>
                  <!-- 渲染二级菜单和三级菜单,需要嵌套才能for渲染 -->
                  <el-col :span="19">
                    <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                      <el-col :span="6">
                        <el-tag closable effect="plain" type="success" @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right" style="color:#ccc"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" closable effect="plain" type="warning" @close='removeRightById(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
            <el-table-column label="操作">
              <template v-slot='scope'>
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialog(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="rolesDelete(scope.row.id)">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-search" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDislogClosed">
      <el-form :model="addRolesForm" :rules="addFormRules" ref="addRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editRolesForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" @closed='RightDialogClosed'>
      <el-tree :data="rightsList" :props="treeProps" node-key="id" show-checkbox :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer">
        <el-button @click="SetRightDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb.vue'
import { rolesFormRulesMixin } from '@/common/mixin.js'
export default {
  name: "Roles",
  mixins: [rolesFormRulesMixin],
  data() {
    return {
      rolesList: [],
      // 树形数据
      rightsList: [],
      // 添加角色对话框显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      SetRightDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 树形绑定对象展示数据
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      editRolesForm: {},
      rolesId: ''
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
      //  console.log(this.rolesList.id, 'getRoles')
      console.log(this.rolesList);
    },
    // 清空添加角色对话框
    addDislogClosed() {
      this.$refs.addRolesRef.resetFields();
    },
    // 添加角色
    addRolesUser() {
      this.$refs.addRolesRef.validate(async valid => {
        console.log(valid);
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 删除用户权限
    async removeRightById(roles, id) {
      // 弹出提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消操作')
      }
      // 进行删除的请求
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败!')
      }
      roles.children = res.data
    },
    // 打开编辑对话框，先获取要修改的信息
    async editDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      this.editRolesForm = res.data
      this.editDialogVisible = true
      // console.log(res);
    },
    // 编辑提交
    editFormInfo() {
      // this.$refs.editFormRef.validate(async valid =>{
      //   if(!valid) return
      //   const {data:res} = await this.$http.put('roles/'+this.editRolesForm.roleId,this.editRolesForm
      //   )
      //   // console.log(res);
      //   if (res.meta.status !== 200) {
      //     return this.$message.error('编辑角色失败!')
      //   }
      //   this.getRolesList()
      //   this.editDialogVisible = false       
      // })
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return
        this.$http.put("roles/" + this.editRolesForm.roleId, this.editRolesForm).then(res => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('编辑角色失败!')
          }
          this.$message.success('修改角色成功!')
          this.getRolesList()
          this.editDialogVisible = false
        })
      })
    },
    // 删除角色
    async rolesDelete(id) {
      const confirmResult = await this.$confirm("此操作将永久删除该角色，是否继续？", "删除角色", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消操作')
      }
      this.$http.delete("roles/" + id).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户删除成功')
        this.getRolesList();
      })

    },
    showSetRightDialog(roles) {
      this.rolesId = roles.id
      console.log(roles);
      // 获取所有权限列表
      this.$http.get("rights/tree").then(res => {
        // console.log(res);
        this.rightsList = res.data.data
        // console.log(this.rightsList);
      })
      // console.log(res);
      this.getLeafKeys(roles, this.defKeys)
      this.SetRightDialogVisible = true
    },
    // 递归，获取角色下所有的三级权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node没有children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭分配权限框清空数组
    RightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 获取选中和半选中的id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys);
      const idStr = keys.join(',');
      console.log(idStr);
      const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.SetRightDialogVisible = false
    }
  }

}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>