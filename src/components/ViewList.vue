<template>
  <div v-if="listData.length" :class="listData.length?'bgWhite':''">
   
    <div v-for="(medical,index) in listData" :key="index" :class="['bt','manualTitle',{select: medical.selected}]"
         @click="listObj.click(medical,$event)">
         <p  class="tab_r" @click="Router(medical)" v-if="Audlist">查看</p>
      <div class="left"></div>
      <div class="list" style="display: flex;" v-for="(lis,inx) in listObj.list" :key="inx">
        <div>
          <span class="titleStyle textR" :class="lis['leftClass']" v-html="lis['field']"></span>
        </div>
        <div class="van-ellipsis maxW">
            <span v-if="lis.render" v-html="lis.render(medical,lis['name'])"
                  @click="selectRight($event,lis,lis['name'],medical)"></span>
          <span v-else v-html="returnHtml(medical[lis['name']])" @click="selectRight($event,lis,lis['name'],medical)"></span>
        </div>
      </div>
      <div class="rightBtn" v-if="medical.revokeEntry" @click="medical.revokeEntryClick(medical)">撤销</div>
    </div>
  </div>
  <div v-else class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">没有相关信息</span></div>
</template>

<script>
  // 普通数据列表（查看、批量设置）
  export default {
    name: "ViewList",
    data() {
      return {};
    },
    methods: {
      Router(item){
        let {humanCaId,normalDepartmentId}=item
        // console.log(item)
        // console.log(item.normalDepartmentId)
        this.$store.state.scheduling.id = item.id;
        this.$store.state.scheduling.normalDepartmentId=normalDepartmentId
        let obj={id:humanCaId,normaId:normalDepartmentId}

        this.$router.push({path:"/GraduateSummary",query:{id:humanCaId}})
      },
      selectRight(event, lis, name, medical) {
        if (typeof lis.click === "function") {
          event.preventDefault();
          event.stopPropagation();
          lis.click(medical, name);
        }
      },
      returnHtml(str) {
        return str || "----";
      }
    },
    created() {
      console.log(this.listData)
      if (!this.listObj.click) {
        this.listObj.click = (data) => {
          if (this.listObj.audit) {
            data.selected = !data.selected;
          }
        };
      }
    },
    props: ["listObj", "listData","Audlist"]
  };
</script>

<style scoped>
  .maxW{
    width: 20rem;
  }

  .manualTitle {
    padding: .5rem 1rem;
    position: relative;
  }

  .titleStyle {
    width: 4.7rem !important;
    display: inline-block !important;
  }

  .list {
    margin: 0;
    padding: .2rem 0;
  }

  .select {
    background: #eef9ff;
    position: relative;
  }
  .rightBtn{
     position: absolute;
     right: .8rem;
     top: 1rem;
     background: #62afff;
     padding: .2rem;
     border-radius: 10px;
     color: #ffffff;
  }
  .select .left {
    position: absolute;
    top: -1rem;
    left: -.5rem;
    width: 0;
    height: 0;
    border-top: 1.5rem solid transparent;
    border-bottom: 1.5rem solid transparent;
    border-right: 1.5rem solid #62afff;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); /* IE 9 */
    -moz-transform: rotate(45deg); /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
  }
.bt{
  position: relative;
}  
.tab_r {
  width:2rem;
  height:1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .1rem .15rem;
  background: blue;
  color: #ffffff;
  font-size: .9rem;
  border-radius:15%;
  position: absolute;
  right: 1rem;
  top: 20%;
}
</style>
