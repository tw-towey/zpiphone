<template>
  <div>
    <van-nav-bar title="出科记录" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div :class="recordList.length?'recordList': ''">
        <!-- <ViewList :listObj="listObj" :listData="recordList"></ViewList> -->
        <div class="bord" v-for="(item,index) in recordList" :key="index">
           <ul class="bord_content">
              <li>
                 <p v-for="(i,ind) in listObj.list" :key="ind">{{i.field}}</p>
              </li>
              <li>
                <p>{{item.departmentName}}</p>
                <p >{{utils.formatDate(item.startDate, "yyyy-MM-dd") +'~'+ utils.formatDate(item.endDate, "yyyy-MM-dd")}}</p>
                <p class="clickP">
                  <span :class="item.auditFlag? (item.auditFlag===1?'green':'red'):''">{{item.auditFlag? (item.auditFlag===1?'审核通过':'审核不通过'):'未审核'}}</span>
                  <span class="blue" v-if="item.auditFlag ==0"  @click="withdraw(item)">撤回</span>
                </p>
              </li>
           </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 出科记录
  import ViewList from "@/components/ViewList";

  export default {
    name: "RecordEntry",
    components: {
      "ViewList": ViewList
    },
    data() {
      return {
        recordList: [],
        listObj: {
          list: [
            { field: "轮转科室：", name: "departmentName", leftClass: "gray" },
            {
              field: "轮转时间：", name: "number", leftClass: "gray", render: (data) => {
                return `<span>${this.utils.formatDate(data.startDate, "yyyy-MM-dd")} ~ ${this.utils.formatDate(data.endDate, "yyyy-MM-dd")}</span>`;
              }
            },
            {
              field: "审核状态：", name: "auditFlag", leftClass: "gray", render: (data, key) => {
                return data[key] ? (data[key] === 1 ? `<span class="green">审核通过</span>` : `<span class="red">审核不通过</span>`) : `<span>未审核</span>`;
              }
            }
          ],
        }
      };
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      getData() {
        this.utils.ajax({
          url: this.api.outApplyRecord,
          method: "POST",
          success: data => {
            this.recordList = data;
          }
        });
      },
      withdraw(data) {
       let params = {
         id: data.id
       }
       this.Dialog.confirm({
          title: "温馨提示",
          message: "您确定要撤回吗？",
          messageAlign:"left" 
        }).then(() => {
        this.utils.ajax({
          method: "post",
          data: params,
          url: this.api.recallDepartmentOutApply,
          success: res => {
              this.getData();
              this.Toast('撤回成功');
          }
        });
              
        });
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  p{
    margin: 0;
    padding: 0.3rem 0;
  }
  .recordList {
    background: #fff;
  }
  .bord{
    border-bottom:1px solid #cccc ;
  }
  .bord_content{
    width: 89%;
    margin: 0 auto;
    display: flex;
  }
  .bord_content li:nth-of-type(1) {
    width: 25%;
    padding: 0.3rem 0;
    color: #969799;
  }
  .bord_content li:nth-of-type(2) {
    padding: 0.3rem 0;
    width: 80%;
  }
  .clickP{
    display: flex;
    justify-content: space-between;
  }
  .blue{
    color: blue;
  }
</style>
