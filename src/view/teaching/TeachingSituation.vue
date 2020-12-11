<template>
  <div class="teachingSituation">
    <van-nav-bar title="带教情况" class="header" fixed left-arrow @click-left="onClickLeft"/>
    <div class="layout_content teachingInfo">
      <div>
        <p class="timeAxis">
          <van-icon name="arrow-left" size="20px" @click="getYearAxis(yearAxis[0].year - 5, yearAxis[0].year - 1)"/>
          <span v-for="(item,index) in yearAxis" :class="{'active': item.active}"
                @click="selectedYear(item)" :key="index">{{item.year}}</span>
          <van-icon name="arrow" size="20px" @click="getYearAxis(yearAxis[4].year + 1, yearAxis[4].year + 5)"/>
        </p>

        <div class="timeMonth">
          <van-row>
            <div v-for="(item,inx) in months" @click="teachingDetail(item.month)" :key="inx">
              <van-col span="8">
                <div class="month">{{item.month}} 月</div>
                <div class="people">{{item.num}} 人</div>
              </van-col>
            </div>
          </van-row>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "TeachingSituation",
    data() {
      return {
        currentYear: new Date().getFullYear(),
        yearAxis: [],
        months: []
      }
    },
    methods: {
      onClickLeft() {
        this.utils.goBack(this);
      },
      selectedYear(param) {
        if (this.currentYear != param.year) {//不是同一个年份进行查询
          this.currentYear = param.year;
          this.yearAxis.forEach(item => {
            item.active = item.year === param.year ? true : false;
          });
          this.queryData();
        }
      },
      getYearAxis(startYear = this.currentYear - 2, endYear = this.currentYear + 2) {//startYear 默认当前年份减2、endYear 默认当前年份加2
        this.yearAxis = [];
        for (let year = startYear; year <= endYear; year++) {
          const active = year == this.currentYear ? true : false;
          this.yearAxis.push({active: active, year: year})
        }
      },
      queryData(){//查询带教每个月情况
        this.utils.ajax({
          method: "post",
          data: {year: this.currentYear},
          url: this.api.teachingSituationNum,
          success: (data) => {
            const months = data[0];
            this.months = [];//清空

            for (let month = 1; month <= 12; month++) {
              this.months.push({
                num: months['m' + month],
                month: month
              });
            }
          }
        });
      },
      teachingDetail(month) {//详情
        let obj = {
          name: "TeachingDetail",
          params: {
            year: this.currentYear,//当前年
            month: month//当前月
          }
        };

        this.$router.push(obj);
      }
    },
    created() {
      this.getYearAxis();
      this.queryData();
    }
  }
</script>
<style scoped>
  .teachingInfo {
    background: #fff;
  }

  .timeAxis {
    width: 340px;
    margin: 0 auto;
    text-align: center;
  }

  .timeAxis .van-icon {
    top: 5px;
  }

  .timeAxis img, .timeAxis span, .timeAxis a {
    margin: 0 5px;
    text-decoration: none;
    color: #000;
  }

  .active {
    text-decoration: underline !important;
    color: #0f98fc !important;
  }

  .year {
    display: flex;
  }

  .timeMonth {
    margin-top: 20px;
    padding: 15px;
  }

  .timeMonth .month {
    margin-left: 8px;
    margin-top: 5px;
  }

  .timeMonth {
    color: #0f98fc;
  }

  .timeMonth .van-col {
    height: 100px;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
    position: relative;
  }

  .timeMonth .van-row {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .timeMonth .people {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 100%;
    height: 20px;
    line-height: 20px;
  }
</style>



