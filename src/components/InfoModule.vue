<template>
    <div class="InfoModule" v-if="show">
      <div>
          <div v-if="cgroles.length > 1 ">
              <div class="role_title">机构</div>
              <div class="RoleList">
                <span v-for="(rows, index) in cgroles"
                    :class="index == index_cg ? 'btnactive':''"
                    @click="changeMesm(index,0)" :key="index">{{rows.name}}
                </span>
          </div>
          </div>
          <div>
              <div class="role_title">角色</div>
              <div class="RoleList">
                  <span v-for="(rows, index) in cgroles[index_cg].roles"
                      :class="index==index_rg?'btnactive':''"
                      @click="changeMesm(index,1)" :key="index">{{rows.text}}
                  </span>
              </div>
          </div>
      </div>
      <div class="selectrolebtn">
        <van-button type="default" size="small" @click="cencelRoleSel()">取消</van-button>
        <van-button type="primary" size="small" @click="saveRoleSel()">确认</van-button>
      </div>
    </div>
</template>

<script>
  /*首页信息组件*/
  export default {
    name: "InfoModule",
    props: ["cgroles","show","cgrolesstatus"],//cgrolesstatus  选择状态存储;
    data() {
      return {
        index_cg:0,//机构索引
        index_rg:0,//角色索引
      };
    },
    methods: {
      cencelRoleSel(){
        this.$emit('showChangeList');
      },
      saveRoleSel(){
        let institutionId = this.cgroles[this.index_cg].caId; //切换机构id
        let roleid = this.cgroles[this.index_cg].roles[this.index_rg].key;  //切换角色id
        this.$store.state.institutionId = institutionId;
        this.$store.state.institutionstatus = {
            institutions:this.index_cg,
            roules:this.index_rg
        }
        this.$emit('changeRole',roleid);
      },
      changeMesm(index,flag){
          if(flag){   //选择角色改变状态
              this.index_rg = index;
              return;
          }
          this.index_cg = index;  //切换机构
          this.index_rg = 0;
      },
      init(){
        if(this.$store.state.institutionstatus.institutions!=null && this.$store.state.institutionstatus.roules!=null){
           this.index_cg = this.$store.state.institutionstatus.institutions;
           this.index_rg = this.$store.state.institutionstatus.roules;
        }else{
           this.index_cg = 0;
           this.index_rg = this.cgrolesstatus.rgindex;
        }
      }
    },
    mounted(){
    },
    created() {
    },
  };
</script>

<style scoped>
.btnactive{
    color: #07c160;
}
.InfoModule{
  margin-bottom: .2rem;
  background: #fff;
  width: 100%;
  padding: 1rem;
  float: left;
  background: #f3f1f1;
}
.role_title {
  font-size: 1rem;
  text-align: left;
  height: 1.5rem;
  line-height: 1.5rem;
  border-bottom: .07rem solid #ddd;
}
/*
  .role_rowWarp {
    padding: .4rem 0;
    overflow-x: auto;
    min-height: 4.6rem;
    position: relative;
    -webkit-overflow-scrolling: touch;
  } */

  .RoleList {
    display: flex;
    flex-wrap:wrap;
    min-height: 2rem;
  }
  .RoleList span {
    display: inline-block;
    margin-right: .5rem;
    line-height: 2rem;
  }
  .selectrolebtn{
     text-align: center;
     padding:1rem;
  }
</style>
