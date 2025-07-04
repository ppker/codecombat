const c = require('./../schemas')

const ClassroomSchema = c.object({
  title: 'Classroom',
  required: ['name'],
  default: {
    classroomItems: true,
    initializedOuterStats: true,
  }
})

c.extendNamedProperties(ClassroomSchema) // name first

_.extend(ClassroomSchema.properties, {
  name: { type: 'string', minLength: 1 },
  members: c.array({ title: 'Members' }, c.objectId()),
  deletedMembers: c.array({ title: 'Deleted Members' }, c.objectId()),
  ownerID: c.objectId(),
  description: { type: 'string' },
  code: c.shortString({ title: 'Unique code to redeem' }),
  codeCamel: c.shortString({ title: 'UpperCamelCase version of code for display purposes' }),
  aceConfig: c.object({}, {
    language: { type: 'string', enum: ['python', 'javascript', 'cpp', 'java'] },
    liveCompletion: { type: 'boolean', default: true },
    disablePaste: { type: 'boolean', default: false },
    codeFormats: c.array({ title: 'Code Formats', description: 'Enable these code formats for students', minitems: 1, uniqueItems: true }, {
      type: 'string',
      enum: ['text-code', 'blocks-and-code', 'blocks-text', 'blocks-icons'],
    }),
    codeFormatDefault: { type: 'string', enum: ['blocks-icons', 'blocks-text', 'blocks-and-code', 'text-code'], description: 'Default code format option for students. Default if unset: text-code.' },
    levelChat: { type: 'string', enum: ['fixed_prompt_only', 'none'] },
  }),
  hackstackConfig: c.object({}, {
    remixAllowed: { type: 'boolean', default: true },
    useNewUI: { type: 'boolean', default: false },
  }),
  averageStudentExp: { type: 'string' },
  ageRangeMin: { type: 'string' },
  ageRangeMax: { type: 'string' },
  classDateStart: c.stringDate(),
  classDateEnd: c.stringDate(),
  classesPerWeek: { type: 'string' },
  minutesPerClass: { type: 'string' },
  archived: {
    type: 'boolean',
    default: false,
    description: 'Visual only; determines if the classroom is in the "archived" list of the normal list.'
  },
  courses: c.array({ title: 'Courses' }, c.object({ title: 'Course' }, {
    _id: c.objectId(),
    updated: c.stringDate(),
    levels: c.array({ title: 'Levels' }, c.object({ title: 'Level' }, {
      assessment: { type: ['boolean', 'string'] },
      assessmentPlacement: { type: 'string' },
      practice: { type: 'boolean' },
      practiceThresholdMinutes: { type: 'number' },
      primerLanguage: { type: 'string', enum: ['javascript', 'python', 'cpp', 'java'] },
      shareable: { title: 'Shareable', type: ['string', 'boolean'], enum: [false, true, 'project'], description: 'Whether the level is not shareable, shareable, or a sharing-encouraged project level.' },
      type: c.shortString(),
      original: c.objectId(),
      name: { type: 'string' },
      displayName: c.shortString(),
      slug: { type: 'string' },
      position: c.point2d(),

      // properties relevant for ozaria campaigns
      nextLevels: {
        type: 'object',
        description: 'object containing next levels original id and their details',
        additionalProperties: { // key is the level original id
          type: 'object',
          properties: {
            type: c.shortString(),
            original: c.objectId(),
            name: { type: 'string' },
            slug: { type: 'string' },
            nextLevelStage: { type: 'number', title: 'Next Level Stage', description: 'Which capstone stage is unlocked' },
            conditions: c.object({}, {
              afterCapstoneStage: { type: 'number', title: 'After Capstone Stage', description: 'What capstone stage needs to be completed to unlock this next level' }
            })
          }
        }
      },
      first: { type: 'boolean', description: 'Is it the first level in the campaign' },
      campaignPage: { type: 'number', title: 'Campaign page number' },
      moduleNum: { type: 'number', title: 'Module number' },
      ozariaType: c.shortString(),
      introContent: c.array()
    }))
  })),
  initialFreeCourses: {
    description: 'Courses that are free and will be automatically assigned to any joining student',
    type: 'array',
    items: {
      type: ['string'],
      links: [{ rel: 'db', href: '/db/course/{($)}/version' }],
    }
  },
  googleClassroomId: { title: 'Google classroom id', type: 'string' },
  otherProductId: { title: 'Id in other product', type: 'string' },
  lmsClassroomId: { title: 'LMS classroom id', type: 'string' },
  lmsClassroom: {
    type: 'object',
    properties: {
      classId: { type: 'string' },
      name: { type: 'string' },
      provider: { type: 'string' },
    },
  },
  grades: c.array({ title: 'Class Grades' }, { type: 'string', enum: ['elementary', 'middle', 'high'] }),
  classroomItems: { title: 'Items & Gems', type: 'boolean', description: 'Whether students should earn gems and equip items during gameplay' },
  studentLockMap: c.object({
    title: 'Student Locking Info',
    description: 'The teacher controls this in order to control student progress through the chapters.',
    additionalProperties: c.object(
      { title: 'Student Lock Object', description: 'Key value of student id tied to the lock data.' }, {
        courseId: c.objectId(),
        levelOriginal: c.objectId({ description: 'Deprecated: use lockedLevels instead' }),
        lockedScenarioLevels: c.object({
          description: 'AI Scenario levels that can be locked or unlocked',
          additionalProperties: ['boolean', c.stringDate()]
        }),
        lockedLevels: c.object({
          additionalProperties: ['boolean', c.stringDate()]
        }),
        optionalLevels: c.object({
          additionalProperties: ['boolean', c.stringDate()]
        })
      })
  }, {}),
  stats: c.object({ additionalProperties: true }),
  initializedOuterStats: { type: 'boolean', default: true, description: 'whether the classroom.stats for the classroom is initialized' },
  type: { title: 'Class Type', type: 'string', enum: ['', 'in-school', 'after-school', 'online', 'camp', 'camp-esports', 'camp-junior', 'homeschool', 'other', 'club-ozaria', 'club-esports', 'club-roblox', 'club-hackstack', 'annual-plan-cn-coco'] },
})

c.extendBasicProperties(ClassroomSchema, 'Classroom')

c.extendPermissionsProperties(ClassroomSchema)

module.exports = ClassroomSchema
