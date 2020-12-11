<template>
  <div>
    <van-nav-bar :title="title" class="headerTop" fixed left-arrow @click-left="onClickLeft">
      <van-icon name="search" slot="right" size="1.3rem" @click="search()"/>
    </van-nav-bar>
    <!-- 学员信息列表 -->
    <div class="layout_content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div
            class="particulars-top"
            v-for="(v,index) in this.listData"
            :key="index"
            @click="studentDetails(v)"
          >
            <van-row>
              <van-col span="20" class="leftList">
                <div class="inblock">
                  <div v-for="(value,index) in listObj.list" :key="index">
                    <span>{{value.field}}</span>
                  </div>
                </div>
                <div class="inblock">
                  <div>
                    <span>{{v.name?v.name:"空"}}</span>
                  </div>
                  <div>
                    <span>{{v.major?v.major:"空"}}</span>
                  </div>
                  <div>
                    <span>{{v.years?v.years+"年":"空"}}</span>
                  </div>
                  <div>
                    <span>{{v.ageLimit?v.ageLimit+"年":"空"}}</span>
                  </div>
                </div>
              </van-col>
              <van-col span="4" class="LearnReview">
                <div v-if="v.status === 2" class="img"></div>
                <div v-if="v.status === 3" class="img3"></div>
                <div v-if="v.status === 4" class="img1"></div>
              </van-col>
            </van-row>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 学员信息列表 end-->
    <!-- 学员详情 -->
      <van-nav-bar v-if="show" title="学员详情" class="header" fixed left-arrow @click-left="closePopup"/>
    <van-popup v-model="show" class="searchPopup" position="right" :overlay="false">
      <div class="particulars">
        <!-- 头部信息 -->
        <div class="particulars-top">
          <div class="inblock">
            <div v-for="(value,index) in this.listObj.list" :key="index">
              <span>{{value.field}}</span>
            </div>
          </div>
          <div class="inblock">
            <div v-for="(v,index) in this.stuData.infor" :key="index">
              <span>{{v?v:"空"}}</span>
            </div>
          </div>
        </div>
        <!-- 头部信息end -->
        <!-- 简历 -->
        <div class="content">
          <div v-for="(v,index) in this.stuData.resume" :key="index">{{v?v:"空"}}</div>
        </div>
        <!-- 联系方式 -->
        <div class="content">
          <div>联系方式</div>
          <div class="inblock">
            <div v-for="(v,index) in this.contactWay.list" :key="index">
              <span>{{v.field}}</span>
            </div>
          </div>
          <div class="inblock">
            <div v-for="(v,index) in this.stuData.contactWay" :key="index">
              <span>{{v?v:"空"}}</span>
            </div>
          </div>
        </div>
        <!-- 联系方式end -->
        <!-- 学历信息 -->
        <div class="content">
          <div>学历信息</div>
          <div class="inblock">
            <div v-for="(v,index) in this.EducationInfor.list" :key="index">
              <span>{{v.field}}</span>
            </div>
          </div>
          <div class="inblock">
            <div v-for="(v,index) in this.stuData.EducationInfor" :key="index">
              <span>{{v?v:"空"}}</span>
            </div>
          </div>
        </div>
        <!-- 学历信息end -->
        <!-- 工作信息 -->
        <div class="content">
          <div>工作信息</div>
          <div class="inblock">
            <div v-for="(v,index) in this.jobInfor.list" :key="index">
              <span>{{v.field}}</span>
            </div>
          </div>
          <div class="inblock">
            <div v-for="(v,index) in this.stuData.jobInfor" :key="index">
              <span>{{v?v:"空"}}</span>
            </div>
          </div>
        </div>
        <!-- 工作信息end -->
      </div>
      <div class="but" v-if="butShow">
        <p class="fl" @click="refuse()">拒绝</p>
        <p class="fr" @click="consent()">同意</p>
      </div>
    </van-popup>
    <!-- 学员详情end -->
    <!-- 搜索学员 -->
    <van-popup v-model="searchStu" position="right" :overlay="false">
      <div class="navBar">
        <van-row>
          <van-col span="3">
            <van-icon
              name="arrow-left"
              size="1rem"
              class="backIcon"
              color="white"
              @click="closeSearch()"
            />
          </van-col>
          <van-col span="17">
            <input type="text" v-model="searchStutend" placeholder="输入学员名字">
          </van-col>
          <van-col span="4">
            <span class="searchBut" @click="affirmSearch()">搜索</span>
          </van-col>
        </van-row>
      </div>
      <div
        class="particulars-top"
        v-for="(v,index) in this.searchStutendList"
        :key="index"
        @click="studentDetails(v)"
      >
        <van-row>
          <van-col span="20" class="leftList">
            <div class="inblock">
              <div v-for="(value,index) in listObj.list" :key="index">
                <span>{{value.field}}</span>
              </div>
            </div>
            <div class="inblock">
              <div>
                <span>{{v.name?v.name:"空"}}</span>
              </div>
              <div>
                <span>{{v.major?v.major:"空"}}</span>
              </div>
              <div>
                <span>{{v.years?v.years:"空"}}</span>
              </div>
              <div>
                <span>{{v.ageLimit?v.ageLimit:"空"}}</span>
              </div>
            </div>
          </van-col>
          <van-col span="4" class="LearnReview">
            <div v-if="v.status === 2" class="img"></div>
            <div v-if="v.status === 3" class="img3"></div>
            <div v-if="v.status === 4" class="img1"></div>
          </van-col>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ViewList from "@/components/ViewList";
export default {
  name: "StudentInformation",
  components: {
    ViewList: ViewList
  },
  data() {
    return {
      butShow: false,
      finished: false,
      loading: true,
      searchStutend: "",
      searchStu: false,
      stuData: {},
      title: "学员信息",
      show: false,
      isLoading: false,
      listData: [],
      searchStutendList: [],
      listObj: {
        list: [
          { field: "学员姓名：", name: "name", leftClass: "gray" },
          { field: "培训专业：", name: "major", leftClass: "gray" },
          { field: "参培年份：", name: "years", leftClass: "gray" },
          { field: "培训年限：", name: "ageLimit", leftClass: "gray" }
        ]
      },
      contactWay: {
        list: [
          { field: "手机号码：", name: "name", leftClass: "gray" },
          { field: "电子邮箱：", name: "major", leftClass: "gray" }
        ]
      },
      EducationInfor: {
        list: [
          { field: "毕业年份：", name: "name", leftClass: "gray" },
          { field: "毕业院校：", name: "major", leftClass: "gray" },
          { field: "毕业专业：", name: "major", leftClass: "gray" },
          { field: "最高学历：", name: "major", leftClass: "gray" },
          { field: "最终学位：", name: "major", leftClass: "gray" },
          { field: "学位类型：", name: "major", leftClass: "gray" }
        ]
      },
      jobInfor: {
        list: [
          { field: "工作单位：", name: "name", leftClass: "gray" },
          { field: "执医考试：", name: "major", leftClass: "gray" },
          { field: "执医证书：", name: "major", leftClass: "gray" }
        ]
      }
    };
  },
  methods: {
    studentDetails(v) {
      if(v.status == 3) {
        this.butShow = false;
      }else {
        this.butShow = true;
      }
      this.show = !this.show;
      this.stuData = {
        name: v.name,
        major: v.major,
        years: v.years,
        ageLimit: v.ageLimit
      };
      // getStudentMentorMatch
      // console.log(v);
      let ID = { studentId: v.studentId };
      this.utils.ajax({
        url: this.api.getStudentMentorMatch,
        data: ID,
        method: "POST",
        success: data => {
          // console.log(data);
          this.stuData = {
            id: data.id,
            studentId: data.studentId,
            infor: {
              name: data.studentName,
              major: this.utils.getValueByKey(
                this.$store.state.majors,
                data.traineeMajorCode
              ),
              years: data.traineeYear + "年",
              ageLimit: data.traineeLimit
            },
            resume: {
              title: "个人简历",
              content: data.jobDescription
            },
            // 联系方式
            contactWay: {
              phoneNum: data.cellPhone,
              email: data.email
            },
            //     // 学历信息
            EducationInfor: {
              graduateTime: "",
              school: "",
              graduateMajor: "",
              maxEducation: "",
              endEducation: "",
              DegreeTypeL: ""
            },
            // 工作信息
            jobInfor: {
              jobUnit: "",
              doctorExam: "",
              doctorCertificate: ""
            }
          };
        }
      });
    },
    // 同意按钮
    consent() {
      let stuInfor = [
        {
          id: this.stuData.id,
          status: 3,
          studentId: this.stuData.studentId
        }
      ];
      this.utils.ajax({
        url: this.api.getStudentMentorMatchAudit,
        data: stuInfor,
        method: "POST",
        success: data => {
          this.show = false;
          this.getListData(false,true);
        }
      });
    },
    // 拒绝按钮
    refuse() {
      let stuInfor = [
        {
          id: this.stuData.id,
          status: 4,
          studentId: this.stuData.studentId
        }
      ];
      this.utils.ajax({
        url: this.api.getStudentMentorMatchAudit,
        data: stuInfor,
        method: "POST",
        success: data => {
          this.show = false;
           this.getListData(false,true);
        }
      });
    },
    onLoad() {
      this.getListData(false, false);
      
    },
    affirmSearch() {
      this.getListData(true);
    },
    closeSearch() {
      this.searchStutend = "";
      this.searchStu = false;
      this.searchStutendList = [];
      // this.getListData(false);
    },
    search() {
      this.searchStu = true;
      // console.log(this.searchStutendList);
    },
    onClickLeft() {
      this.utils.goBack(this);
    },
    getListData(flag, Page,ok) {
      let params = {};
      if (flag) {
        params = {
          currentPage: 1,
          pageSize: 10,
          statusList: [2, 3, 4],
          studentName: this.searchStutend
        };
      } else {
        let page;
        if (Page) {
          page = 1;
        } else {
          page =
            Math.ceil(this.listData.length / this.$store.state.pageSize) + 1;
        }
        params = {
          currentPage: page,
          pageSize: 10,
          statusList: [2, 3, 4],
        };
      }
      this.utils.ajax({
        url: this.api.getStudentInforlist,
        data: params,
        method: "POST",
        success: data => {
          // console.log(data);
          if (data.content) {
            if (params.currentPage >= data.totalPages) {
              this.finished = true;
            }else {
              this.finished = false;
            }
            const num = data.content.map(item => {
              return {
                name: item.studentName,
                major: this.utils.getValueByKey(
                  this.$store.state.majors,
                  item.traineeMajorCode
                ),
                years: item.traineeYear,
                ageLimit: item.traineeLimit,
                studentId: item.studentId,
                status: item.status
              };
            });
            if (flag) {
              this.searchStutendList = num;
              this.isLoading = false;
            } else {
              if (Page) {
                this.listData = num;
                this.isLoading = false;
              } else {
                this.listData = [...this.listData, ...num];
                this.isLoading = false;
              }
            }
            this.loading = false;
          }
        }
      });
    },
    closePopup() {
      this.show = false;
      this.stuData = {};
      this.getListData(false,true);
    },
    onRefresh() {
      // this.finished = false;
    }
  },
  created() {
    this.getListData(false,false);
  }
};
</script>

<style scoped>
.searchPopup {
  transition: none;
}
.van-nav-bar__title {
color: #fff!important;
font-size: 1.1rem;
}
.headerTop {
   height: 2.5rem;
  line-height: 2.5rem;
  background-color: #1a7fe9;
  
}
.header {
  position: fixed;
  top: 0;
  z-index: 2500!important;
}
.LearnReview {
  margin-top: 1rem;
}
.van-col {
  text-align: center;
}
.leftList {
  text-align: left !important;
}
.van-col input {
  border: 0 none;
}
.searchBut {
  color: #fff;
}
.backIcon {
  top: 0.22rem;
  margin: 0 0.6rem;
}
.navBar {
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: #1a7fe9;
  z-index: 10000;
}
.navBar input {
  height: 1rem;
  width: 100%;
}
.van-popup {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.particulars {
  margin-top: 2.5rem;
}
.inblock {
  display: inline-block;
}
.inblock div {
  padding: 0.2rem;
}
.particulars-top {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  border-bottom: 1px solid #bbb;
  background: white;
}
.van-cell {
  font-weight: 700;
}
.content {
  padding: 0.5rem 1rem 1rem ;
  font-size: 0.8rem;
  border-top: 1px solid #ccc;
}
.content > div:nth-child(1) {
  margin-bottom: 0.5rem;
  font-weight: 700;
}
.fl {
  margin: 0;
  width: 50%;
  text-align: center;
  float: left;
  padding: 0.5rem 0;
  background: #cd3333;
}
.fr {
  margin: 0;
  width: 50%;
  text-align: center;
  float: right;
  padding: 0.5rem 0;
  background: #007acc;
}
.van-pull-refresh {
  height: 100%;
  overflow: scroll;
}
.but {
  /* position: fixed;
  bottom: 0px; */
  width: 100%;
  color: #fff;
}
.img {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_03.svg") no-repeat;
  padding: 0.2rem;
}
.img1 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_02.svg") no-repeat;
  padding: 0.2rem;
}
.img3 {
  width: 4rem;
  height: 4rem;
  background: url("../../assets/images/home/pic10_01.svg") no-repeat;
  padding: 0.2rem;
}
.headerTop .van-nav-bar__title {
  color: #fff !important;
}

.headerTop .van-nav-bar__text {
  color: #fff;
  font-size: 1rem;
}

.headerTop .van-nav-bar__right .van-nav-bar__text {
  font-size: 0.875rem;
}

.headerTop .van-nav-bar__text:active {
  background: #1a7fe9;
}
</style>
