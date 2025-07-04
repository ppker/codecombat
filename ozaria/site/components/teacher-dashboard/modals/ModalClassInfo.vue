<script>
import { mapActions } from 'vuex'
import PrimaryButton from '../common/buttons/PrimaryButton'
import SecondaryButton from '../common/buttons/SecondaryButton'
import { tryCopy } from 'ozaria/site/common/ozariaUtils'

import ButtonGoogleClassroom from './common/ButtonGoogleClassroom'
import ModalDivider from '../../common/ModalDivider'
import ModalCreateStudents from './ModalCreateStudents'

export default Vue.extend({
  components: {
    PrimaryButton,
    SecondaryButton,
    ButtonGoogleClassroom,
    ModalDivider,
    ModalCreateStudents
  },
  props: {
    classroomCode: {
      type: String,
      default: '',
      required: true
    },
    googleSyncInProgress: {
      type: Boolean,
      default: false
    },
    classroom: {
      type: Object,
      required: true
    },
    showGoogleClassroom: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: null
    },
    createStudents: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    regenerationInProgress: false
  }),
  computed: {
    classroomUrl () {
      return `${document.location.origin}/students?_cc=${this.classroomCode}`
    },
    classCodeDescription () {
      return `${i18n.t('teachers.class_code_desc')} ${document.location.hostname}`
    }
  },
  methods: {
    ...mapActions({
      updateClassroom: 'classrooms/updateClassroom'
    }),
    copyCode () {
      this.$refs.classCode.select()
      tryCopy()
      window.tracker?.trackEvent('Add Students: Copy Class Code Clicked', { category: 'Teachers', label: this.from })
    },
    copyUrl () {
      this.$refs.classUrl.select()
      tryCopy()
      window.tracker?.trackEvent('Add Students: Copy Class URL Clicked', { category: 'Teachers', label: this.from })
    },
    clickInviteButton () {
      window.tracker?.trackEvent('Add Students: Invite By Email Clicked', { category: 'Teachers', label: this.from })
      this.$emit('inviteStudents')
    },
    async regenerateClassCode () {
      this.regenerationInProgress = true
      window.tracker?.trackEvent('Add Students: Request New Class Code Clicked', { category: 'Teachers', label: this.from })
      try {
        await this.updateClassroom({ classroom: this.classroom, updates: { codeCamel: '', code: '' } })
      } catch (err) {
        noty({
          text: $.i18n.t('teacher_dashboard.error_occurred', { err }),
          type: 'error',
          timeout: 5000,
        })
      }
      this.regenerationInProgress = false
    }
  }
})
</script>

<template>
  <div class="style-ozaria teacher-form">
    <div
      v-if="showGoogleClassroom"
      class="google-classroom-div"
    >
      <button-google-classroom
        text="Sync Google Classroom"
        :in-progress="googleSyncInProgress"
        @click="$emit('syncGoogleClassroom')"
      />
      <modal-divider />
    </div>
    <div class="form-container">
      <span class="sub-title"> {{ $t("teachers.class_info_modal_sub_title") }} </span>
      <div class="class-code">
        <span class="form-label"> {{ $t("teachers.class_code") }} </span>
        <div class="form-input">
          <input
            ref="classCode"
            type="text"
            class="form-control"
            :value="classroomCode"
            readonly
          >
          <img
            class="copy-icon"
            src="/images/ozaria/teachers/dashboard/svg_icons/IconCopy.svg"
            @click="copyCode"
          >
        </div>
      </div>
      <span class="sub-text"> {{ classCodeDescription }} </span>
      <primary-button
        :inactive="regenerationInProgress"
        class="regenerate-code-button"
        @click="regenerateClassCode"
      >
        {{ $t("teachers.regenerate_class_code") }}
      </primary-button>
      <div class="class-url">
        <span class="form-label"> {{ $t("teachers.class_url") }} </span>
        <div class="form-input">
          <input
            ref="classUrl"
            type="text"
            class="form-control"
            :value="classroomUrl"
            readonly
          >
          <img
            class="copy-icon"
            src="/images/ozaria/teachers/dashboard/svg_icons/IconCopy.svg"
            @click="copyUrl"
          >
        </div>
      </div>
      <span class="sub-text"> {{ $t("teachers.class_url_desc") }} </span>
      <primary-button
        class="invite-button"
        @click="clickInviteButton"
      >
        {{ $t("teachers.invite_by_email") }}
      </primary-button>
      <div
        v-if="createStudents"
        class="create-students"
      >
        <modal-create-students
          :classroom="classroom"
          from="ModalAddStudents"
          @done="$emit('close')"
        />
      </div>
    </div>
    <secondary-button
      class="done-button"
      @click="$emit('done')"
    >
      {{ $t("common.done") }}
    </secondary-button>
  </div>
</template>

<style lang="scss" scoped>
@import "app/styles/ozaria/_ozaria-style-params.scss";
.teacher-form {
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-container {
  margin-bottom: 50px;
}

.google-classroom-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sub-title {
  @include font-p-2-paragraph-medium-gray;
}

.class-code, .class-url {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
}

.form-label {
  @include font-h-4-nav-uppercase-black;
  width: 30%;
  text-align: left;
}
.form-input {
  margin-left: 20px;
  display: flex;
  width: 410px;
}
.copy-icon {
  height: 30px;
  cursor: pointer;
  margin: 0px 20px;
}
.sub-text {
  @include font-p-4-paragraph-smallest-gray;
}
.invite-button {
  display: block;
  width: 190px;
  height: 35px;
  margin-top: 20px;
}

.regenerate-code-button {
  @extend .invite-button;
}

.done-button {
  width: 150px;
  height: 35px;
  align-self: flex-end;
}
</style>
