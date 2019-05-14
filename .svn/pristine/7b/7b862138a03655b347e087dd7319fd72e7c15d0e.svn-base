<template>
  <div>
    <van-nav-bar :title="title" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content">
      <ul>
        <li v-for="obj in list" is-link @click="addModule(obj)">
          <van-cell :title="obj.name" is-link />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  /*出科鉴定*/
  export default {
    name: "AddRegister",
    data() {
      return {
        mode: '',
        title: '',
        list: []
      }
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      addModule(obj) {
        console.log(obj);
        this.$store.state.EditRegisterNum = obj.key;
        this.$router.push({ name: "EditRegister" });
      },
      dataLoad() {
        this.mode = this.$store.state.regsterMode
        switch(this.mode) {
          case 'disease' :
            this.title = '病种';
            this.list = [
              {name: '大病历', key: '1'},
              {name: '病种', key: '2'},
              {name: '门诊诊治', key: '3'},
              {name: '急诊诊治', key: '4'},
              {name: '门诊病案', key: '22'},
              {name: '住院志', key: '23'}
            ];
            break;
          case 'skill' :
            this.title = '技能';
            this.list = [
              {name: '操作记录', key: '5'},
              {name: '手术记录', key: '6'},
              {name: '门诊操作', key: '7'},
              {name: '门诊手术', key: '8'},
              {name: '医技报告', key: '9'},
              {name: '抢救记录', key: '10'}
            ];
            break;
          case 'other' :
            this.title = '其他';
            break;
        }
      },
    },
    created() {
      this.dataLoad()
    }
  };
</script>

<style scoped>
  .layout_content {
    background: #fff;
  }
  li {
    border-bottom: 1px solid #ebebeb;
  }
  .van-cell {
    padding: 0.3rem 1rem;
  }
</style>
