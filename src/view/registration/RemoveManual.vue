<template>
  <div>
    <van-nav-bar title="登记列表" right-text="删除" class="header" fixed left-arrow @click-left="onClickLeft"
                 @click-right="onClickRight"/>
    <div class="layout_content">
      <div v-if="isErrMsg" class="tip-empty"><span class="icon-emptyface"></span><span class="text-empty">没有相关信息</span></div>
      <div v-else v-for="item in objData">
        <van-cell :title="item.yearMonth" title-class="titleDate" is-link @click="monthIsShow(item)"
                  :arrow-direction="item.show?'down':''"/>
        <div class="bgWhite" v-show="item.show">
          <div v-for="medical in item.list" :class="['bt','manualTitle',{select: medical.show}]" @click="selectedItem(medical)">
            <div class="left"></div>
            <p class="list">
              <span>病人姓名：</span>
              <span>{{medical.patientName}}</span>
            </p>
            <p class="list">
              <span>就诊编号：</span>
              <span>{{medical.visitNumber}}</span>
            </p>
            <p class="list">
              <span>主要诊断：</span>
              <span class="van-ellipsis">{{medical.mainDiagnosis}}</span>
            </p>
            <p class="list">
              <span>审核状态：</span>
              <span>{{medical.auditFlag?"已审核":"未审核"}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  // 删除登记手册列表
  export default {
    name: "RemoveManual",
    data() {
      return {
        list: [],
        objData: {},
        isErrMsg: false,
        selectedList: []
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      onClickRight() {
        if(!this.selectedList.length){
          this.Toast('请选择需要删除的数据！');
          return
        }
        this.utils.ajax({
          method: 'POST',
          data: {ids: this.selectedList},
          url: this.api.removeEnrollments,
          success: () => {
            this.Toast('删除成功！');
            this.onClickLeft();
          }
        })
      },
      getData() {
        this.list = this.$route.params;
        if(this.list.length) {
          this.objData = {};
          this.list.forEach(item => {
            let yearMonth = this.utils.formatDate(item.createDate, "yyyy-MM");
            if (!this.objData.hasOwnProperty(yearMonth)) {
              this.objData[yearMonth] = {
                list: [],
                show: true,
                yearMonth: yearMonth,
                sortTime: yearMonth + '-01 00:00:00'
              };
            }
            item.show = false;
            this.objData[yearMonth]["list"].push(item);
          });

          let arr = [];
          for (var key in this.objData) {
            arr.push(this.objData[key]);
          }

          this.objData = this.utils.fastSort(arr, (a, b) => {
            return this.utils.getTime(a.sortTime) < this.utils.getTime(b.sortTime);
          });
        }else {
          this.isErrMsg = true;
        }

      },
      selectedItem(item) {
        item.show = !item.show;
        this.objData = Object.assign({},this.objData);
        if(item.show) {
          this.selectedList.push(item.id);
        }else{
          let idIndex = this.selectedList.indexOf(item.id);
          this.selectedList.splice(idIndex,1);
        }
      },
      monthIsShow(item) {
        item.show = !item.show;
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .van-cell {
    background: #f0f0f0;
    border-bottom: .07rem solid #ddd;
  }

  .titleDate {
    font-weight: 600;
    font-size: 1rem;
  }

  .manualTitle {
    padding: .9rem;
  }

  .list {
    margin: 0;
    padding: .2rem 0;
  }

  .select {
    background: #eef9ff;
    position: relative;
  }

  .select .left{
    position: absolute;
    top: -1rem;
    left: -.5rem;
    width: 0;
    height: 0;
    border-top: 1.5rem solid transparent;
    border-bottom: 1.5rem solid transparent;
    border-right: 1.5rem solid #62afff;
    transform:rotate(45deg);
    -ms-transform:rotate(45deg); 	/* IE 9 */
    -moz-transform:rotate(45deg); 	/* Firefox */
    -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
    -o-transform:rotate(45deg);
  }
</style>
