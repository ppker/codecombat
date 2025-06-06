<script>
import IconHelp from '../../common/icons/IconHelp'
import IconBeta from 'app/core/components/IconBeta'
import { isOzaria } from 'core/utils'

import ButtonAddCourseToClassroom from './ButtonAddCourseToClassroom'
import ButtonPlayChapter from './ButtonPlayChapter'
import ButtonSolutionGuide from './ButtonSolutionGuide'
import ButtonCurriculum from './ButtonCurriculum'
import { getOzariaAssetUrl } from 'ozaria/site/common/ozariaUtils'

import { mapGetters } from 'vuex'
import utils from 'app/core/utils'

const Campaigns = require('collections/Campaigns')
const _ = require('lodash')

export default {
  components: {
    IconHelp,
    IconBeta,
    ButtonAddCourseToClassroom,
    ButtonPlayChapter,
    ButtonSolutionGuide,
    ButtonCurriculum,
  },

  data () {
    return {
      levelsNameMap: {},
      courseLinks: {
        junior: 'https://drive.google.com/drive/folders/1R2iON3JW2kWZpy8HUACl7Dw7BdVROwaq?usp=drive_link',
        'introduction-to-computer-science': 'https://drive.google.com/drive/folders/1-ww3rLkxj1cZwSvBm6_ThXqsEjwnu6Wn?usp=sharing',
        'game-development-1': 'https://drive.google.com/drive/folders/1YSJ9wcfHRJ2854F-vUdSWqoLBuSJye7V?usp=sharing',
        'computer-science-2': 'https://drive.google.com/drive/folders/1J3ywGVgDKtRBDaK_cK106Jn-l9GaKd3n?usp=sharing',
        'game-development-2': 'https://drive.google.com/drive/folders/1Mks2MA-WGMrwNpZj6VtKkL3loPnHp_bs?usp=sharing',
        'computer-science-3': 'https://drive.google.com/drive/folders/1x9EgA6TO1N4ePnzgnFK2kNn8ujIEKe3B?usp=sharing',
        'game-development-3': 'https://drive.google.com/drive/folders/1FUFGxI3-GzYx38wNanof2K7BVI_ffp1d?usp=sharing',
        'computer-science-4': 'https://drive.google.com/drive/folders/1WUEL82hSDJ1mzqkfouZVkbOmrJvfMqkG?usp=sharing',
        'chapter-1-sky-mountain': 'https://drive.google.com/drive/folders/1MFbuhuJ5HELMC_eRXkWipqDek1x3XaAB?usp=sharing',
        'chapter-2-the-moon-dancers': 'https://drive.google.com/drive/folders/1u78qNwBmGXkKxw3qzqSimoUbMCNv_IMn?usp=sharing',
        'chapter-3-the-phoenix-lands': 'https://drive.google.com/drive/folders/1D_SNer9frRiFlH3gt1T20FHLdMbbllkP?usp=sharing',
        'chapter-4-the-final-code': 'https://drive.google.com/drive/folders/1hSAum1Rcu0-uyTxvBch1_c5QPB1hQ2ly?usp=sharing',
        'ai-hackstack': 'https://drive.google.com/drive/folders/1rey1-V9m0x2h4ntxouPV80rUIpmn4dhc?usp=drive_link',
      },
    }
  },

  computed: {
    ...mapGetters({
      getCurrentCourse: 'baseCurriculumGuide/getCurrentCourse',
      getCapstoneInfo: 'baseCurriculumGuide/getCapstoneInfo',
      getCourseUnitMapUrl: 'baseCurriculumGuide/getCourseUnitMapUrl',
      getSelectedLanguage: 'baseCurriculumGuide/getSelectedLanguage',
      isOnLockedCampaign: 'baseCurriculumGuide/isOnLockedCampaign',
      getTrackCategory: 'teacherDashboard/getTrackCategory',
      getCurrentClassroom: 'teacherDashboard/getCurrentClassroom',
    }),

    isOzaria () {
      return isOzaria
    },

    videoLevels () {
      return utils.videoLevels
    },

    courseId () {
      return utils.i18n(this.getCurrentCourse, '_id') || ''
    },

    courseIDs () {
      return utils.courseIDs
    },

    courseName () {
      return utils.i18n(this.getCurrentCourse, 'name') || ''
    },

    courseShortName () {
      return utils.i18n(this.getCurrentCourse, 'shortName') || this.courseName
    },

    courseDescription () {
      return utils.i18n(this.getCurrentCourse, 'description') || ''
    },

    capstoneName () {
      return utils.i18n(this.getCapstoneInfo, 'displayName') || utils.i18n(this.getCapstoneInfo, 'name')
    },

    totalCourseDuration () {
      return this.getCurrentCourse?.duration?.total || 0
    },

    getCourseThumbnail () {
      if (this.getCurrentCourse?.screenshot) {
        return getOzariaAssetUrl(this.getCurrentCourse.screenshot)
      }
      return null
    },

    getRandomCourseImage () {
      if (this.getCourseThumbnail) {
        return null
      }
      const images = [
        '/images/pages/courses/banners/arena-ace-of-coders.png',
        '/images/pages/courses/banners/arena-cavern-survival.png',
        '/images/pages/courses/banners/arena-dueling-grounds.png',
        '/images/pages/courses/banners/arena-gold-rush.png',
        '/images/pages/courses/banners/arena-greed.png',
        '/images/pages/courses/banners/arena-harrowlands.png',
        '/images/pages/courses/banners/arena-sky-span.png',
        '/images/pages/courses/banners/arena-summation-summit.png',
        '/images/pages/courses/banners/arena-treasure-grove.png',
        '/images/pages/courses/banners/arena-wakka-maul-dynamic.png',
        '/images/pages/courses/banners/arena-wakka-maul.png',
        '/images/pages/courses/banners/battle-anya.png',
        '/images/pages/courses/banners/battle-tharin-ogre.png',
        '/images/pages/courses/banners/battle-tharin.png',
        '/images/pages/courses/banners/desert-omarn.png',
        '/images/pages/courses/banners/dungeon-heroes.png',
        '/images/pages/courses/banners/forest-alejandro.png',
        '/images/pages/courses/banners/forest-anya.png',
        '/images/pages/courses/banners/forest-heroes.png',
        '/images/pages/courses/banners/forest-hunting.png',
        '/images/pages/courses/banners/forest-pets.png',
        '/images/pages/courses/banners/game-dev.png',
        '/images/pages/courses/banners/heroes-vs-ogres.png',
        '/images/pages/courses/banners/mountain-heroes.png',
        '/images/pages/courses/banners/wizard-heroes.png'
      ]
      const randomImage = images[Math.floor(Math.random() * images.length)]
      return randomImage
    },

    courseIsNotInCurrentClassroom () {
      if (!this.getCurrentClassroom._id) {
        return false
      }
      return !_.find(this.getCurrentClassroom.courses || [], { _id: this.getCurrentCourse._id })
    },

    solutionGuideUrl () {
      if (!this.getCurrentCourse || this.isOnLockedCampaign) {
        return ''
      }
      if (this.getCurrentCourse.slug === 'ai-hackstack') {
        return ''
      }

      return `/teachers/course-solution/${this.getCurrentCourse._id}/${this.getSelectedLanguage}?from-new-dashboard=true`
    },

    curriculumUrl () {
      if (!this.getCurrentCourse) {
        return this.courseLinks['introduction-to-computer-science']
      }

      const slugName = this.getCurrentCourse.slug
      if (Object.hasOwn(this.courseLinks, slugName)) {
        return this.courseLinks[slugName]
      }

      return ''
    },

    playChapterUrl () {
      if (this.isOnLockedCampaign) {
        return ''
      }
      return this.getCourseUnitMapUrl || ''
    },

    clickedLink () {
      return !this.isOnLockedCampaign
    }
  },

  created () {
    const campaigns = new Campaigns([], { forceCourseNumbering: true })
    campaigns.fetchByType('course', { data: { project: 'levels,levelsUpdated' } })
    campaigns.on('sync', () => {
      const currentCourse = this.getCurrentCourse
      if (!currentCourse) {
        console.log('no current course')
        return
      }
      const campaign = campaigns.get(currentCourse.campaignID)
      if (campaign) {
        this.levelsNameMap = campaign.getLevelNameMap()
      } else {
        // Campaign is not loaded yet, do we need to do anything here?
      }
    })
  },

  methods: {

    getLevelNameMap () {
      const campaign = this.getCurrentCourse
      const levelNameMap = campaign.getLevelNameMap()
      return levelNameMap
    },

    tooltipTimeContent () {
      const time = []

      if (this.getCurrentCourse?.duration?.totalTimeRange) {
        time.push(`<p><b>${Vue.t('teacher_dashboard.class_time_range')}</b> ${utils.i18n(this.getCurrentCourse?.duration, 'totalTimeRange')}</p>`)
      }

      if (this.getCurrentCourse?.duration?.inGame) {
        time.push(`<p><b>${Vue.t('teacher_dashboard.in_game_play_time')}</b> ${utils.i18n(this.getCurrentCourse?.duration, 'inGame')}</p>`)
      }

      return time.join('')
    },

    trackEvent (eventName) {
      if (eventName) {
        window.tracker?.trackEvent(eventName, { category: this.getTrackCategory, label: this.courseName })
      }
    },

    onClickVideoThumbnail (e) {
      let videoUrl
      $('#video-modal').modal('show')
      const imageSrc = e.target.src.slice(e.target.src.search('/images'))
      const video = (Object.values(this.videoLevels || {}).find(l => l.thumbnail_unlocked === imageSrc) || {})
      if (me.showChinaVideo()) {
        videoUrl = video.cn_url
      } else {
        videoUrl = video.url
        const preferred = me.get('preferredLanguage') || 'en'
        const videoLanguageCode = (video.captions_available || [])
          .find(languageCode => (languageCode === preferred) || (languageCode === preferred.split('-')[0]))
        videoUrl = videoUrl.replace(/defaultTextTrack=[\w\d-]+/, 'defaultTextTrack=' + (videoLanguageCode || 'en'))
      }
      $('.video-player')[0].src = videoUrl

      return $('#video-modal').on(('hide.bs.modal'), e => {
        return $('.video-player').attr('src', '')
      })
    },

    showBetaIcon () {
      return [
        utils.courseIDs.WEB_DEVELOPMENT_1,
        utils.courseIDs.WEB_DEVELOPMENT_2,
      ].includes(this.getCurrentCourse?._id)
    },
  },
}
</script>
<template>
  <div>
    <div
      id="chapter-info"
      :style="{ '--randomCourseImage': `url(${getRandomCourseImage})` }"
    >
      <div
        class="img-container"
        :style="{ '--chapterImage': `url(${getCourseThumbnail})` }"
      />
      <div class="info-container">
        <div class="title-container">
          <h3>{{ courseShortName }}</h3>
          <IconBeta
            v-if="showBetaIcon()"
            class="beta-icon"
          />
        </div>
        <p class="chapter-summary">
          {{ courseDescription }}
        </p>
        <div class="stats-and-btns">
          <div>
            <p v-if="isOzaria">
              <b>{{ $t('play_level.level_type_capstone_project') }}</b>: {{ capstoneName }}
            </p>
            <div
              v-if="totalCourseDuration"
              class="time-row"
            >
              <p>
                <b>{{ $t('teacher_dashboard.class_time') }}</b>: {{ totalCourseDuration }}
              </p>
              <icon-help
                v-if="tooltipTimeContent()"
                v-tooltip.top="{
                  content: tooltipTimeContent,
                  classes: 'teacher-dashboard-tooltip'
                }"
              />
            </div>
          </div>
          <div
            v-if="!isOnLockedCampaign"
            class="btns"
          >
            <button-add-course-to-classroom
              v-if="courseIsNotInCurrentClassroom"
              v-tooltip.top="{
                content: $t('teacher_dashboard.add_course_to_classroom_tooltip'),
                classes: 'teacher-dashboard-tooltip lighter-p'
              }"
              :course="getCurrentCourse"
              :classroom="getCurrentClassroom"
              @click.native="trackEvent('Curriculum Guide: Add Course to Classroom Clicked')"
            />
            <button-curriculum
              v-if="!curriculumUrl"
              v-tooltip.top="{
                content: $t('teacher_dashboard.coming_soon'),
                classes: 'teacher-dashboard-tooltip lighter-p'
              }"
              :curriculum-url="curriculumUrl"
              @click.native="trackEvent('Curriculum Guide: Curriculum Clicked')"
            />
            <button-curriculum
              v-else
              :curriculum-url="curriculumUrl"
              @click.native="trackEvent('Curriculum Guide: Curriculum Clicked')"
            />
            <a
              :href="playChapterUrl"
              target="_blank"
              rel="noreferrer"
            >
              <button-play-chapter
                v-if="isOzaria"
                v-tooltip.top="{
                  content: $t(isOzaria ? 'teacher_dashboard.want_to_save_tooltip': 'teacher_dashboard.want_to_save_tooltip_coco'),
                  classes: 'teacher-dashboard-tooltip lighter-p'
                }"
                @click.native="trackEvent('Curriculum Guide: Play Chapter Clicked')"
              />
            </a>
            <a
              v-if="solutionGuideUrl"
              :href="solutionGuideUrl"
              target="_blank"
              rel="noreferrer"
            > <button-solution-guide
              @click.native="trackEvent('Curriculum Guide: Solution Guide Clicked')"
            /> </a>
          </div>
          <div
            v-else
            class="btns"
          >
            <span
              v-tooltip.top="{
                content: $t('teacher_dashboard.need_licenses_tooltip'),
                classes: 'teacher-dashboard-tooltip',
                autoHide: false
              }"
            >
              <button-play-chapter :locked="isOnLockedCampaign" />
            </span>
            <span
              v-tooltip.top="{
                content: $t('teacher_dashboard.need_licenses_tooltip'),
                classes: 'teacher-dashboard-tooltip',
                autoHide: false
              }"
            >
              <button-solution-guide :locked="isOnLockedCampaign" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="courseId === courseIDs.INTRODUCTION_TO_COMPUTER_SCIENCE && Object.keys(videoLevels || {}).length > 0"
      class="video-container"
    >
      <div
        v-for="(videoLevel, originalId) in videoLevels"
        :key="originalId"
        class="video-item"
        @click="onClickVideoThumbnail"
      >
        <div class="">
          <span class="video-title semibold small">{{ videoLevel.i18name }}</span>
          <img
            class="video-thumbnail"
            :src="videoLevel.thumbnail_unlocked"
          >
          <p
            v-if="levelsNameMap[originalId]"
            class="video-text small"
          >
            <span>(</span>
            <span>{{ levelsNameMap[originalId] }}</span>
            <span>)</span>
          </p>
        </div>
      </div>
    </div>
    <div
      id="video-modal"
      class="modal"
      :data-show="false"
    >
      <div class="modal-dialog">
        <div class="modal-content video-wrapper">
          <iframe
            class="video-player"
            frameborder="0"
            webkitallowfullscreen
            mozallowfullscreen
            allowfullscreen
          />
          <button
            class="video-close-btn btn well well-sm well-parchment"
            data-dismiss="modal"
          >
            <span class="glyphicon glyphicon-remove" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "app/styles/bootstrap/variables";
@import "ozaria/site/styles/common/variables.scss";
@import "app/styles/ozaria/_ozaria-style-params.scss";

#chapter-info {
  display: flex;
  flex-direction: row;

  background-color: #f2f2f2;
  background-image: var(--randomCourseImage, none);
  background-size: contain;

  .img-container {
    max-width: 256px;
    width: 100%;

    margin-right: 30px;

    display: flex;
    align-items: center;

    background-image: var(--chapterImage, none);

    background-position: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
  }

  .time-row {
    display: flex;
    flex-direction: row;

    &>img {
      margin-left: 9px;
    }
  }

  h3 {
    @include font-h-4-nav-uppercase-black;
    color: $pitch;
    text-align: left;

    margin: 18px 0 5px;
  }

  p {
    @include font-p-4-paragraph-smallest-gray;
    color: $pitch;
    font-size: 16px;
    line-height: 20px;
    font-style: normal;
    font-weight: normal;
  }

  .chapter-summary {
    margin-right: 60px;
  }
}

.info-container {
  display: flex;
  flex-direction: column;
  background: rgba(242, 242, 242, 0.75);
  padding: 0 15px
}

.stats-and-btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 18px;
  margin-right: 60px;

  &>div {
    /* Ensure containers are evenly distributed */
    flex: 1 1 auto;
  }

  .btns {
    display: flex;
    justify-content: space-around;

    &.locked a {
      cursor: default;
    }

    a {
      text-decoration: none;
    }
  }

  p {
    margin-bottom: 5px;
  }
}

.video-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin: 30px 30px 30px;
  gap: 30px;

  .video-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    .video-title {
      @include font-h-4-nav-uppercase-black;
      color: $pitch;
      text-align: center;

      margin: 18px 0 5px;
    }

    .video-thumbnail {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-text {
      @include font-p-4-paragraph-smallest-gray;
      color: $pitch;
      font-size: 16px;
      line-height: 20px;
      font-style: normal;
      font-weight: normal;
    }
  }
}

#video-modal {
  .modal-dialog {
    width: 90vw;
    margin: auto 5vw;
    padding: 0;
  }

  .video-wrapper {
    position: relative;
    margin-top: 10%;
    width: 100%;
    height: 100%;

    .video-player {
      position: absolute;
      width: 100%;
      height: 580px;
      background-color: #000000;
    }

    .video-close-btn {
      position: absolute;
      right: -5px;
      color: white;
      top: -5px;
      background: #ba1d00;
      padding: 6px 6px 3px;
      border: 2px solid #14110e;
      border-radius: 0px;
    }
  }
}

.title-container {
  display: flex;
  position: relative;
}
</style>
