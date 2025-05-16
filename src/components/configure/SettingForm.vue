<template>
  <div class="base">
    <div class="setting-title">基础配置</div>
    <el-form
      ref="ruleForm"
      :model="setting"
      label-width="100px"
      class="form-content"
      :rules="rules"
    >
      <el-form-item label="超级用户ID" prop="superusers">
        <InteractiveInput
          v-model="setting.superusers"
          placeholder="请输入超级用户ID, 多个请使用逗号隔开"
        ></InteractiveInput>
      </el-form-item>
      <el-form-item label="数据库地址" prop="db_url">
        <InteractiveInput
          v-model="setting.db_url"
          placeholder="数据库地址"
          :suffixIcon="suffixIcon"
          :key="db_key"
        ></InteractiveInput>
      </el-form-item>
      <el-form-item label="登录用户名" prop="username">
        <InteractiveInput
          v-model="setting.username"
          placeholder="前端登录用户名"
        ></InteractiveInput>
      </el-form-item>
      <el-form-item label="用户名密码" prop="password">
        <InteractiveInput
          v-model="setting.password"
          placeholder="前端登录密码"
        ></InteractiveInput>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运行地址" prop="host">
            <InteractiveInput
              v-model="setting.host"
              placeholder="运行地址"
            ></InteractiveInput>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运行端口" prop="port">
            <InteractiveInput
              v-model="setting.port"
              placeholder="运行端口"
            ></InteractiveInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          class="submit-btn"
          style="margin-left: 20px"
          >提交</el-button
        >
        <el-button type="primary" class="submit-btn" @click="changeApi"
          >地址设置
        </el-button>
      </el-form-item>
    </el-form>
    <CuteConfirm
      :visible.sync="isCompleteWindows"
      title="温馨提示"
      :message="completeTextWindows"
      :onConfirm="handleConfirm"
      :onCancel="handleCancel"
      class="dialog"
    />
    <CuteConfirm
      :visible.sync="isCompleteLinux"
      title="温馨提示"
      :message="completeTextLinux"
      :onConfirm="handleCancel"
      :onCancel="handleCancel"
      class="dialog"
    />
  </div>
</template>

<script>
import CuteConfirm from '../ui/CuteConfirm.vue'
import InteractiveInput from '../ui/NeonInput.vue'
export default {
  name: 'SettingForm',
  components: { InteractiveInput, CuteConfirm },
  data() {
    var checkHost = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('运行地址不能为空'))
      }
      const ipv4Pattern =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      if (!ipv4Pattern.test(value)) {
        callback(new Error('ip地址不合法'))
      } else {
        callback()
      }
    }
    var checkPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('运行端口不能为空'))
      }
      const num = Number(value)
      if (
        !Number.isNaN(num) &&
        Number.isInteger(num) &&
        num >= 0 &&
        num <= 65535
      ) {
        callback()
      } else {
        callback(new Error('端口不合法'))
      }
    }
    var checkDb = (rule, value, callback) => {
      if (!value) {
        this.suffixIcon = ''
        return callback(new Error('数据库地址不能为空'))
      }
      if (value.startsWith('sqlite:')) {
        callback()
      } else {
        this.getRequest(`${this.$root.prefix}/configure/test_db`, {
          db_url: value,
        }).then((resp) => {
          if (resp.suc) {
            callback()
            this.suffixIcon = 'yes-green'
            this.db_key++
            this.isComplete = true
          } else {
            this.suffixIcon = 'no-red'
            callback(new Error(resp.info))
            this.db_key++
          }
        })
      }
    }
    return {
      completeTextWindows:
        '恭喜配置完成！\n如果希望立即重启，请选择确定。\n如果希望手动重启，请选择取消。',
      completeTextLinux: '恭喜配置完成！\n请手动重启程序。',
      setting: {
        superusers: '',
        db_url: 'sqlite:data/db/zhenxun.db',
        username: 'admin',
        password: '',
        host: '127.0.0.1',
        port: 8080,
      },
      isCompleteWindows: false,
      isCompleteLinux: false,
      suffixIcon: 'yes-green',
      db_key: 0,
      windowHeight: window.innerHeight,
      rules: {
        superusers: [
          { required: true, message: '请输入超级用户ID', trigger: 'blur' },
        ],
        db_url: [{ required: true, validator: checkDb, trigger: 'blur' }],
        username: [
          { required: true, message: '请输入前端登录用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入前端登录密码', trigger: 'blur' },
        ],
        host: [{ required: true, validator: checkHost, trigger: 'change' }],
        port: [{ required: true, validator: checkPort, trigger: 'change' }],
      },
    }
  },
  methods: {
    handleCancel() {
      this.$router.replace({
        name: 'Login', // 路由名称
        params: {
          firstSetting: true, // 传递的参数
        },
      })
    },
    handleConfirm() {
      var loading = this.getLoading('.dialog')
      this.postRequest(`${this.$root.prefix}/configure/restart`).then(
        (resp) => {
          if (resp.suc) {
            if (resp.warning) {
              this.$message.warning(resp.warning)
            } else {
              this.$message.success(resp.info)
              this.$router.replace({
                name: 'Login', // 路由名称
                params: {
                  firstSetting: true, // 传递的参数
                },
              })
            }
          } else {
            this.$message.error(resp.info)
          }
          loading.close()
        }
      )
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var loading = this.getLoading('.base')
          const superusers = this.setting.superusers
            .replace('，', ',')
            .split(',')
          this.postRequest(`${this.$root.prefix}/configure/set_configure`, {
            ...this.setting,
            superusers,
          }).then((resp) => {
            if (resp.suc) {
              if (resp.warning) {
                this.$message.warning(resp.warning)
              } else {
                this.$message.success(resp.info)
                if (resp.data) {
                  this.isCompleteWindows = true
                } else {
                  this.isCompleteLinux = true
                }
              }
            } else {
              this.$message.error(resp.info)
            }
            loading.close()
          })
        } else {
          return false
        }
      })
    },
    changeApi() {
      this.$router.push('/myapi')
    },
  },
}
</script>

<style lang="scss" scoped>
.base {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fbe4e4;

  .setting-title {
    font-family: 'fzrzFont';
    font-size: 50px;
    margin-bottom: 40px;
    color: #ffadd2;
    margin-left: 50px;
  }

  .form-content {
    min-width: 500px;
  }

  /deep/ .el-form-item__label {
    font-weight: bolder;
  }

  .submit-btn {
    width: 150px;
    background-color: #f589b9;
    border: #f589b9 1px solid;
    float: right;
    color: #fff;
  }

  .submit-btn:hover {
    background-color: #eb83b1;
  }
}
</style>
