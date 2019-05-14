<template>
  <div v-if="listData.length" :class="listData.length?'bgWhite':''">
    <div v-for="medical in listData" :class="['bt','manualTitle',{select: medical.selected}]"
         @click="listObj.click(medical,$event)">
      <div class="left"></div>
      <div class="list" style="display: flex;" v-for="lis in listObj.list">
        <div>
          <span class="titleStyle textR" :class="lis['leftClass']" v-html="lis['field']"></span>
        </div>
        <div class="van-ellipsis maxW">
            <span v-if="lis.render" v-html="lis.render(medical,lis['name'])"
                  @click="selectRight($event,lis,lis['name'],medical)"></span>
          <span v-else v-html="medical[lis['name']]" @click="selectRight($event,lis,lis['name'],medical)"></span>
        </div>
      </div>
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
      selectRight(event, lis, name, medical) {
        if (typeof lis.click === "function") {
          event.preventDefault();
          event.stopPropagation();
          lis.click(medical, name);
        }
      }
    },
    created() {
      if (!this.listObj.click) {
        this.listObj.click = (data) => {
          if (this.listObj.audit) {
            data.selected = !data.selected;
          }
        };
      }
    },
    props: ["listObj", "listData"]
  };
</script>

<style scoped>
  .maxW{
    width: 20rem;
  }

  .manualTitle {
    padding: .5rem 1rem;
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
</style>
