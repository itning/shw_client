<template>
  <div>
    <md-content class="center" v-if="!init_finish">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </md-content>
    <div v-show="init_finish">
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_welcome_card_panel">
          <md-card-header>
            <div class="md-title">Hi! 欢迎来到群组管理</div>
          </md-card-header>
          <md-card-content>
            在这里你可以查看你创建的群组，甚至解散你已经创建的群组。<br>
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_welcome_card_panel=false,'show_welcome_card')">我知道了
            </md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_info_card_panel">
          <md-card-header>
            <div class="md-title">群组详情</div>
          </md-card-header>
          <md-card-content>
            单击群组条目进行群组详情查看，而且你还可以选择解散该群组！
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_info_card_panel=false,'show_info_card')">我知道了</md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <transition name="fade">
        <md-card class="md-card-info" v-if="show_add_info_card_panel">
          <md-card-header>
            <div class="md-title">想要创建群组？</div>
          </md-card-header>
          <md-card-content>
            看见右下角的红色按钮了吗？<br>单击它试试！
          </md-card-content>
          <md-card-actions>
            <md-button @click="setInfoCardDisable(show_add_info_card_panel=false,'show_add_info_card')">我知道了</md-button>
          </md-card-actions>
        </md-card>
      </transition>
      <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
        <md-table-toolbar>
          <div class="md-toolbar-section-start">
            <h1 class="md-title">群组管理</h1>
          </div>

          <md-field md-clearable class="md-toolbar-section-end">
            <md-input placeholder="键入组名进行搜索..." v-model="search" @input="searchOnTable"/>
          </md-field>
        </md-table-toolbar>

        <md-table-empty-state
          md-label="群组没有找到"
          :md-description="`没有找到名为 '${search}' 的组. 尝试其他关键字进行搜索或者加入新群组`">
          <md-button class="md-primary md-raised" @click="add_group_dialog_status=true">创建新群组</md-button>
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }" @click="onItemClick(item.id)">
          <md-table-cell md-label="组名" md-sort-by="name">{{ item.groupName }}</md-table-cell>
          <md-table-cell md-label="教师" md-sort-by="email">{{ item.teacherName }}</md-table-cell>
          <md-table-cell md-label="加入时间" md-sort-by="gender" md-numeric>{{ item.gmtCreate }}</md-table-cell>
        </md-table-row>
      </md-table>
      <md-button class="md-fab md-fixed md-fab-bottom-right" @click="add_group_dialog_status=true">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  const toLower = text => {
    return text.toString().toLowerCase()
  };

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.groupName).includes(toLower(term)))
    }
    return items
  };
  export default {
    name: "GroupPanel",
    data: () => ({
      init_finish: true,
      show_welcome_card_panel: true,
      show_info_card_panel: true,
      show_add_info_card_panel: true,
      alert_fullscreen: false,
      search: null,
      searched: [],
      selected: {},
    }),
    methods: {
      searchOnTable() {
        this.searched = searchByName(this.groups, this.search)
      },
      onItemClick(id) {
        this.selected = this.groups.find(item => item.id === id);
        this.showDialog = true;
      },
      setInfoCardDisable(item, localStorageKey) {
        window.localStorage.setItem(localStorageKey, 'false');
      },
    },
    beforeRouteEnter(to, from, next) {
      if (store.getters.user_type !== undefined) {

      } else {

      }
      next();
    }
  }
</script>

<style scoped>
  .md-card-info {
    max-width: 320px;
    margin-bottom: 4px;
    display: inline-block;
    vertical-align: top;
  }

  .center {
    width: 50px;
    margin: 0 auto;
  }
</style>
