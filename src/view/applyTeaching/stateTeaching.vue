<template>
  <div class>
    <van-nav-bar
      title="申请带教"
      class="header"
      fixed
      left-arrow
      right-text="申请记录"
      @click-right="onClickRight"
      @click-left="onClickLeft"
    />
    <div class="layout_content">
      <div v-if="dataList !==null">
        <div class="seach">
          <p class="seachp">{{dataList.name}}</p>
          <div class="seachInp">
            <van-icon name="search" size="20px" color="#ccc" @click="searchClick()" />
            <input type="text" v-model="search" placeholder="请输入老师姓名或手机号" @keypress="searchClick" />
            <van-icon name="clear" size="20px" color="#ccc" @click="closeClick(search)" />
          </div>
        </div>
        <div class="content">
          <div class="contentBox">
            <p class="contentP">注：您当前科室轮转时间过长，需要每月都申请带教老师</p>
          </div>
          <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            :finished-text="finishedText"
            immediate-check
            :offset="50"
            @load="onLoad()"
          >
            <div class="contentBox" v-for="(item,index) in dataObj" :key="index">
              <div class="content1" @click="clinical(item,index)">
                <div class="imgacl">
                  <img
                    v-if="item.headPortraitUrl"
                    class="content1img"
                    :src="item.headPortraitUrl"
                    alt
                  />
                  <img v-else class="content1img" src="../../assets/images/icons/txPic.svg" />
                  <p v-if="item.isGeneralQualification==1" class="general">全科</p>
                  <span></span>
                </div>
                <div style="width:75%;">
                  <div>
                    <span
                      v-if="item.specialityTitleCode"
                    >{{item.name}}{{ '（'+item.specialityTitleCode +')'}}</span>
                    <span v-else>{{item.name}}</span>
                    <span style="font-size:0.7rem;">从业{{item.workTime}}年 带教{{item.teachingYear}}年</span>
                  </div>
                  <div class="spandisplay">
                    <div class="li">
                      <p>当前带教</p>
                      <p>
                        <span class="spantit">{{item.currTeaching}}</span>人
                      </p>
                    </div>
                    <div class="li">
                      <p>历史带教学员</p>
                      <p>
                        <span class="spantit">{{item.historyTeaching}}</span>人
                      </p>
                    </div>
                    <div class="li">
                      <p>最大教学员数</p>
                      <p>
                        <span class="spantit">{{item.teachingCapacity}}</span>人
                      </p>
                    </div>
                  </div>
                  <div class="spandisplay1">
                    <div>
                      <p>当前申请人数</p>
                      <p>
                        <span class="spantit">{{item.applyNum}}</span>人
                      </p>
                    </div>
                    <div>
                      <p>所属科室</p>
                      <p class="spantit">{{item.departments}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
      <div v-else class="tip-empty">
          <span class="icon-emptyface"></span>
          <span class="text-empty">没有下一个轮转计划</span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "stateTeaching",
  components: {},
  data() {
    return {
      search: "",
      dataList: {},
      dataObj: [],
      loading: true,
      finished: false,
      error: false,
      finishedText: "没有更多了"
    };
  },
  methods: {
    onClickLeft() {
      this.utils.goBack(this);
    },
    onClickRight() {
      this.$router.push({ name: "application" });
    },
    closeClick(item) {
      this.search = "";
    },
    clinical(item, index) {
      item.departmentId = this.dataList.id;
      item.departmentName = this.dataList.name;
      item.startDate = this.dataList.startDate;
      item.endDate = this.dataList.endDate;
      item.schedulingId = this.dataList.schedulingId;
      this.$router.push({ name: "TeacherInfo", params: item });
    },
    onChange(event) {
      // event.detail 为当前输入的值
    },
    teaching() {
      this.utils.ajax({
        url: this.api.nextDepartment,
        method: "POST",
        success: data => {
          this.dataList = data;
        }
      });
    },
    searchClick() {
      (this.dataObj = []), (this.loading = true);
      this.finished = false;
      this.error = false;
      this.finishedText = "没有更多了...";
      if (event) {
        if (event.keyCode == 13) {
          event.preventDefault(); //禁止默认事件（默认是换行）
          this.findByManage(true);
        } else {
          this.findByManage(true);
        }
      }
    },
    findByManage(flage) {
      let params = {
        currentPage:
          Math.ceil(this.dataObj.length / this.$store.state.pageSize) + 1,
        pageSize: this.$store.state.pageSize,
        caId: this.dataList.id,
        human: this.search
      };
      this.utils.ajax({
        data: params,
        url: this.api.findByManageDepartment,
        method: "POST",
        success: data => {
          if (data.content.length) {
            const content = data.content;
            this.dataObj = [...this.dataObj, ...content];
          } else {
            this.finishedText = "暂无数据...";
          }
          this.loading = false; //结束当前加载
          if (params.currentPage >= data.totalPages) {
            //最后一页、加载完成
            this.finished = true;
          }
        }
      });
    },
    onLoad() {
      setTimeout(() => {
        this.findByManage(false);
      }, 100);
    }
  },
  created() {
    this.teaching();
    setTimeout(() => {
      this.findByManage(false);
    }, 100);
  }
};
</script>
<style>
p {
  margin: 0;
  padding: 0;
}
.seach {
  padding: 0.5rem 0;
  width: 92%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.seachInp {
  width: 65%;
  padding: 0.3rem 0.5rem;
  background: white;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #3333;
}
.seachp {
  width: 25%;
  margin-top: 0.3rem;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.seachIuo {
  width: 79%;
}
.seachInp input {
  border: none;
  width: 80%;
}
.content {
  background: white;
}
.contentP {
  color: red;
  font-size: 0.6rem;
  width: 92%;
  margin: 0 auto;
  padding: 0.5rem 0;
}
.contentBox {
  border-bottom: 0.5px solid #ccc;
}
.content1img {
  width: 5rem;
  height: 6rem;
}
.content1 {
  width: 92%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
}
.spandisplay {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.spandisplay1 {
  width: 100%;
  display: flex;
}
.spandisplay1 p {
  font-size: 0.8rem;
  color: #ccc;
  padding: 0.1rem 0;
}
.spandisplay p {
  font-size: 0.8rem;
  color: #ccc;
  padding: 0.1rem 0;
}
.li {
  width: 30%;
}
.imgacl {
  width: 26%;
}
.spantit {
  font-size: 0.9rem !important;
  color: black !important;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spandisplay1 div:nth-of-type(1) {
  width: 35%;
}
.spandisplay1 div:nth-of-type(2) {
  width: 65%;
}
.general {
  position: absolute;
  top: 4.5rem;
  left: 2.5rem;
  z-index: 22;
  background-color: rgb(25, 127, 232, 0.8);
  color: white;
  width: 2.5rem;
  text-align: center;
  height: 1.3rem;
  font-size: 0.8rem;
  line-height: 1.3rem;
  border-radius: 0.6rem 0 0 0;
}
.imgacl {
  position: relative;
}
</style>