<template>
  <div>
    <Breadcrumb name1="数据统计" name2="数据报表" />
    <el-card>
      <div id="main" style="width: 650px;height:300px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: 'Report',
  components: {
    Breadcrumb
  },
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'));
    // myChart.setOption(this.Option)
    const {data:res}=await this.$http.get('reports/type/1')
    console.log(res);
    // 基于准备好的dom，初始化echarts实例
    let axc =_.merge(res.data,this.options)
    myChart.setOption(axc);
  }
}
</script>

<style>
</style>