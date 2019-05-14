<template>
  <div>
    <van-nav-bar
      title="科室名称"
      right-text="确定"
      class="header"
      fixed
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />

    <div class="layout_content">
      <form action="/">
        <van-search
          placeholder="请输入科室名称"
          shape="round"
          action="false"
          v-model="departmentName"
          @clear="clear"
          @search="search"
        ></van-search>
      </form>
      <van-cell title="全部" clickable>
        <van-checkbox v-model="checkedd" ref="checkbo" @change="fggg()" @click="togglee()">
          <img
            slot="icon"
            slot-scope="props"
            :src="props.checked ? iconimg.active : iconimg.normal"
            class="dadioimg"
          >
        </van-checkbox>
      </van-cell>

      <van-checkbox-group v-model="activityType.result" class="apply">
        <van-cell-group>
          <div v-for="(item,index) in searchDepartments">
            <van-cell :title="item.name" clickable @click="toggle(index,item)">
              <van-checkbox :name="item" ref="checkboxes" :label-disabled="false">
                <img
                  slot="icon"
                  slot-scope="props"
                  :src="props.checked ? iconimg.active : iconimg.normal"
                  class="dadioimg"
                >
              </van-checkbox>
            </van-cell>
          </div>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepartmentName",
  components: {},
  data() {
    return {
      checked: [],
      checkedd: false,
      searchDepartments: [],
      departmentName: "",
      activityType: {
        result: []
      },
      iconimg: {
        normal: require("../../assets/images/home/pic_cks-01.svg"),
        active: require("../../assets/images/home/pic_cks-02.svg")
      }
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
      this.$store.state.departmentt = "";
      this.$store.state.DepartmentEcho = "Echo";
    },
    methode() {
      // reet
    },
    onClickRight() {
      this.utils.goBack(this);
      this.$store.state.DepartmentEcho = "Echo";
      this.$store.state.departmentt = "";
      this.$store.state.departmentt = (() => {
        let nameList = "";
        this.activityType.result.forEach((item, index) => {
          if (this.activityType.result.length - 1 !== index) {
            nameList += item.name + ",";
          } else {
            nameList += item.name;
          }
        });
        return nameList;
      })();
      // this.$emit("changeShowStatus");
      this.$store.state.departmenty = (() => {
        let idLinst = "";
        this.activityType.result.forEach((item, index) => {
          if (this.activityType.result.length - 1 !== index) {
            idLinst += item.caId + ",";
          } else {
            idLinst += item.caId;
          }
        });
        return idLinst;
      })();
      console.log( this.$store.state.departmenty,'oud');
      
     
    },
    search() {
      let departmentName = this.utils.trim(this.departmentName);
      if (departmentName) {
        this.searchDepartments = this.searchDepartments.filter(item => {
          return item.caId != 0 && item.name.indexOf(departmentName) > -1;
        });
      } else {
        this.tabclass();
      }
    },
    clear() {
      this.searchDepartments;
    },
    toggle(index, item) {
      this.$refs.checkboxes[index].toggle();
    },
    togglee() {
      this.$refs.checkbo.toggle();
    },
    tabclass() {
      // if(this.$store.state.departmentList) {
      //     // this.searchDepartments = data;
      //     this.searchDepartments.map(i => {
      //       const item = i;
      //       item.checked = true;

      //       return item;
      //     });
      // }else{
      this.utils.ajax({
        url: this.api.queryDepartments,
        method: "POST",
        success: data => {
          // this.departmentName = data
          if (data !== "") {
            this.searchDepartments = data;
            this.searchDepartments.map(i => {
              const item = i;
              item.checked = true;
              return item;
            });
          }else{
            this.$store.state.Nodepartment = 'No';
          }
        }
      });
      // }
    },
    fggg() {
      if (this.checkedd) {
        this.activityType.result = this.searchDepartments;
      } else {
        this.activityType.result = [];
      }
    }
  },
  created() {
    this.tabclass();
  }
};
</script>
<style scoped>
.dadioimg {
  width: 1.125rem;
  height: 1.125rem;
}
</style>
