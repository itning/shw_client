<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <md-empty-state v-if="show_empty"
                    md-icon="work_off"
                    md-label="没有作业"
                    md-description="该群组没有已经创建的作业，点击下方按钮来创建第一个作业">
      <md-button class="md-primary md-raised" @click="addBtn">创建作业</md-button>
    </md-empty-state>
    <md-table v-if="have_work" v-show="init_finish" v-model="searched" md-sort="gmtCreate" md-sort-order="asc" md-card
              md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">{{workName}}作业管理</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="键入作业名进行搜索..." v-model="search" @input="searchOnTable"/>
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="群组没有找到"
        :md-description="`没有找到名为 '${search}' 的作业. 尝试其他关键字进行搜索或者创建新作业`">
        <md-button class="md-primary md-raised" @click="addBtn">创建新作业</md-button>
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" @click.ctrl="routerToWorkDetails(item.id)"
                    @click="onItemClick(item.id)">
        <md-table-cell md-label="作业名" md-sort-by="workName">{{ item.workName }}</md-table-cell>
        <md-table-cell md-label="创建时间" md-sort-by="gmtCreate" md-numeric>{{ item.gmtCreate }}</md-table-cell>
        <md-table-cell md-label="状态" md-sort-by="enabled" md-numeric>{{ item.enabled?'开启':'关闭' }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
  export default {
    props: ['id'],
    name: "WorkDetails",
    data: () => ({
      init_finish: false,
      show_empty: false,
      have_work: true,
      searched: [],
      work_details: [],
      workName: ''
    }),
    methods: {}
  }
</script>

<style scoped>
  .center {
    width: 50px;
    margin: 0 auto;
  }
</style>
