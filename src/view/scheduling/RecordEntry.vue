<template>
  <div>
    <van-nav-bar title="出科记录" class="header" fixed left-arrow @click-left="onClickLeft"/>

    <div class="layout_content">
      <div :class="recordList.length?'recordList': ''">
        <ViewList :listObj="listObj" :listData="recordList"></ViewList>
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
          ]
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
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .recordList {
    background: #fff;
  }
</style>
