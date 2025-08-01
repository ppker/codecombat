const c = require('./../schemas')
const ThangComponentSchema = require('./thang_component')

const SpecificArticleSchema = c.object()
c.extendNamedProperties(SpecificArticleSchema) // name first
SpecificArticleSchema.properties.body = { type: 'string', title: 'Content', description: 'The body content of the article, in Markdown.', format: 'markdown' }
SpecificArticleSchema.properties.i18n = { type: 'object', format: 'i18n', props: ['name', 'body'], description: 'Help translate this article' }
SpecificArticleSchema.displayProperty = 'name'
SpecificArticleSchema.properties.voiceOver = c.voiceOver

const side = { title: 'Side', description: 'A side.', type: 'string', enum: ['left', 'right', 'top', 'bottom'] }
const thang = { title: 'Thang', description: 'The name of a Thang.', type: 'string', maxLength: 60, format: 'thang' }

const eventPrereqValueTypes = ['boolean', 'integer', 'number', 'null', 'string'] // not 'object' or 'array'
const EventPrereqSchema = c.object({ title: 'Event Prerequisite', format: 'event-prereq', description: 'Script requires that the value of some property on the event triggering it to meet some prerequisite.', required: ['eventProps'] }, {
  eventProps: c.array({ default: ['thang'], format: 'event-value-chain', maxItems: 10, title: 'Event Property', description: 'A chain of keys in the event, like "thang.pos.x" to access event.thang.pos.x.' }, c.shortString({ title: 'Property', description: 'A key in the event property key chain.' })),
  equalTo: c.object({ type: eventPrereqValueTypes, title: '==', description: 'Script requires the event\'s property chain value to be equal to this value.' }),
  notEqualTo: c.object({ type: eventPrereqValueTypes, title: '!=', description: 'Script requires the event\'s property chain value to *not* be equal to this value.' }),
  greaterThan: { type: 'number', title: '>', description: 'Script requires the event\'s property chain value to be greater than this value.' },
  greaterThanOrEqualTo: { type: 'number', title: '>=', description: 'Script requires the event\'s property chain value to be greater or equal to this value.' },
  lessThan: { type: 'number', title: '<', description: 'Script requires the event\'s property chain value to be less than this value.' },
  lessThanOrEqualTo: { type: 'number', title: '<=', description: 'Script requires the event\'s property chain value to be less than or equal to this value.' },
  containingString: c.shortString({ title: 'Contains', description: 'Script requires the event\'s property chain value to be a string containing this string.' }),
  notContainingString: c.shortString({ title: 'Does not contain', description: 'Script requires the event\'s property chain value to *not* be a string containing this string.' }),
  containingRegexp: c.shortString({ title: 'Contains Regexp', description: 'Script requires the event\'s property chain value to be a string containing this regular expression.' }),
  notContainingRegexp: c.shortString({ title: 'Does not contain regexp', description: 'Script requires the event\'s property chain value to *not* be a string containing this regular expression.' })
}
)

const GoalSchema = c.object({ title: 'Goal', description: 'A goal that the player can accomplish.', required: ['name', 'id'] }, {
  name: c.shortString({ title: 'Name', description: 'Name of the goal that the player will see, like \"Defeat eighteen dragons\".' }), // eslint-disable-line no-useless-escape
  i18n: { type: 'object', format: 'i18n', props: ['name'], description: 'Help translate this goal' },
  id: c.shortString({ title: 'ID', description: 'Unique identifier for this goal, like \"defeat-dragons\".', pattern: '^[a-z0-9-]+$' }), // eslint-disable-line no-useless-escape
  worldEndsAfter: { title: 'World Ends After', description: 'When included, ends the world this many seconds after this goal succeeds or fails.', type: 'number', minimum: 0, exclusiveMinimum: true, maximum: 300, default: 3 },
  howMany: { title: 'How Many', description: 'When included, require only this many of the listed goal targets instead of all of them.', type: 'integer', minimum: 1 },
  hiddenGoal: { title: 'Hidden', description: 'Hidden goals don\'t show up in the goals area for the player until they\'re failed. (Usually they\'re obvious, like "don\'t die".)', type: 'boolean' },
  optional: { title: 'Optional', description: 'Optional goals do not need to be completed for overallStatus to be success.', type: 'boolean' },
  team: c.shortString({ title: 'Team', description: 'Name of the team this goal is for, if it is not for all of the playable teams.' }),
  killThangs: c.array({ title: 'Kill Thangs', description: 'A list of Thang IDs the player should kill, or team names.', uniqueItems: true, minItems: 1, default: ['ogres'] }, thang),
  saveThangs: c.array({ title: 'Save Thangs', description: 'A list of Thang IDs the player should save, or team names', uniqueItems: true, minItems: 1, default: ['Hero Placeholder'] }, thang),
  getToLocations: c.object({ title: 'Get To Locations', description: 'Will be set off when any of the \"who\" touch any of the \"targets\"', required: ['who', 'targets'] }, { // eslint-disable-line no-useless-escape
    who: c.array({ title: 'Who', description: 'The Thangs who must get to the target locations.', minItems: 1 }, thang),
    targets: c.array({ title: 'Targets', description: 'The target locations to which the Thangs must get.', minItems: 1 }, thang)
  }
  ),
  getAllToLocations: c.array({ title: 'Get all to locations', description: 'Similar to getToLocations but now a specific \"who\" can have a specific \"target\", also must be used with the HowMany property for desired effect', required: ['getToLocation'] }, // eslint-disable-line no-useless-escape
    c.object({ title: '', description: '' }, {
      getToLocation: c.object({ title: 'Get To Locations', description: 'TODO: explain', required: ['who', 'targets'] }, {
        who: c.array({ title: 'Who', description: 'The Thangs who must get to the target locations.', minItems: 1 }, thang),
        targets: c.array({ title: 'Targets', description: 'The target locations to which the Thangs must get.', minItems: 1 }, thang)
      }
      )
    }
    )
  ),
  keepFromLocations: c.object({ title: 'Keep From Locations', description: 'TODO: explain', required: ['who', 'targets'] }, {
    who: c.array({ title: 'Who', description: 'The Thangs who must not get to the target locations.', minItems: 1 }, thang),
    targets: c.array({ title: 'Targets', description: 'The target locations to which the Thangs must not get.', minItems: 1 }, thang)
  }
  ),
  keepAllFromLocations: c.array({ title: 'Keep ALL From Locations', description: 'Similar to keepFromLocations but now a specific \"who\" can have a specific \"target\", also must be used with the HowMany property for desired effect', required: ['keepFromLocation'] }, // eslint-disable-line no-useless-escape
    c.object({ title: '', description: '' }, {
      keepFromLocation: c.object({ title: 'Keep From Locations', description: 'TODO: explain', required: ['who', 'targets'] }, {
        who: c.array({ title: 'Who', description: 'The Thangs who must not get to the target locations.', minItems: 1 }, thang),
        targets: c.array({ title: 'Targets', description: 'The target locations to which the Thangs must not get.', minItems: 1 }, thang)
      }
      )
    }
    )
  ),
  leaveOffSides: c.object({ title: 'Leave Off Sides', description: 'Sides of the level to get some Thangs to leave across.', required: ['who', 'sides'] }, {
    who: c.array({ title: 'Who', description: 'The Thangs which must leave off the sides of the level.', minItems: 1 }, thang),
    sides: c.array({ title: 'Sides', description: 'The sides off which the Thangs must leave.', minItems: 1 }, side)
  }
  ),
  keepFromLeavingOffSides: c.object({ title: 'Keep From Leaving Off Sides', description: 'Sides of the level to keep some Thangs from leaving across.', required: ['who', 'sides'] }, {
    who: c.array({ title: 'Who', description: 'The Thangs which must not leave off the sides of the level.', minItems: 1 }, thang),
    sides: side
  }, { title: 'Sides', description: 'The sides off which the Thangs must not leave.', minItems: 1 }, side),
  collectThangs: c.object({ title: 'Collect', description: 'Thangs that other Thangs must collect.', required: ['who', 'targets'] }, {
    who: c.array({ title: 'Who', description: 'The Thangs which must collect the target items.', minItems: 1 }, thang),
    targets: c.array({ title: 'Targets', description: 'The target items which the Thangs must collect.', minItems: 1 }, thang)
  }
  ),
  keepFromCollectingThangs: c.object({ title: 'Keep From Collecting', description: 'Thangs that the player must prevent other Thangs from collecting.', required: ['who', 'targets'] }, {
    who: c.array({ title: 'Who', description: 'The Thangs which must not collect the target items.', minItems: 1 }, thang),
    targets: c.array({ title: 'Targets', description: 'The target items which the Thangs must not collect.', minItems: 1 }, thang)
  }
  ),
  codeProblems: c.array({ title: 'Code Problems', description: 'A list of Thang IDs that should not have any code problems, or team names.', uniqueItems: true, minItems: 1, default: ['humans'] }, thang),
  linesOfCode: { title: 'Lines of Code', description: 'A mapping of Thang IDs or teams to how many many lines of code should be allowed (well, statements).', type: 'object', default: { humans: 10 }, additionalProperties: { type: 'integer', description: 'How many lines to allow for this Thang.' } },
  html: c.object({ title: 'HTML', description: 'A jQuery selector and what its result should be' }, {
    selector: { type: 'string', description: 'jQuery selector to run on the user HTML, like "h1:first-child"' },
    valueChecks: c.array({ title: 'Value checks', description: 'Logical checks on the resulting value for this goal to pass.', format: 'event-prereqs' }, EventPrereqSchema)
  }
  ),
  concepts: c.array({ title: 'Target Concepts', description: 'Which programming concepts this goal demonstrates.', uniqueItems: true, format: 'concepts-list' }, c.concept)
}
)
const ResponseSchema = c.object({ title: 'Dialogue Button', description: 'A button to be shown to the user with the dialogue.', required: ['text'] }, {
  text: { title: 'Title', description: 'The text that will be on the button', default: 'Okay', type: 'string', maxLength: 30 },
  channel: c.shortString({ title: 'Channel', format: 'event-channel', description: 'Channel that this event will be broadcast over, like "level:set-playing".' }),
  event: { type: 'object', title: 'Event', description: 'Event that will be broadcast when this button is pressed, like {playing: true}.' },
  buttonClass: c.shortString({ title: 'Button Class', description: 'CSS class that will be added to the button, like "btn-primary".' }),
  i18n: { type: 'object', format: 'i18n', props: ['text'], description: 'Help translate this button' }
})

const PointSchema = c.object({ title: 'Point', description: 'An {x, y} coordinate point.', format: 'point2d', default: { x: 15, y: 20 } }, {
  x: { title: 'x', description: 'The x coordinate.', type: 'number' },
  y: { title: 'y', description: 'The y coordinate.', type: 'number' }
})

const SpriteCommandSchema = c.object({ title: 'Thang Command', description: 'Make a target Thang move or say something, or select/deselect it.', required: ['id'], default: { id: 'Hero Placeholder' } }, {
  id: thang,
  select: { title: 'Select', description: 'Select or deselect this Thang.', type: 'boolean' },
  say: c.object({ title: 'Say', description: 'Make this Thang say a message.', required: ['text'], default: { mood: 'explain' } }, {
    blurb: c.shortString({ title: 'Blurb', description: 'A very short message to display above this Thang\'s head. Plain text.', maxLength: 50 }),
    mood: c.shortString({ title: 'Mood', description: 'The mood with which the Thang speaks.', enum: ['explain', 'confused', 'curious', 'dance-happy', 'dance', 'idle', 'neutral', 'sad', 'debrief', 'congrats', 'attack', 'joke', 'tip', 'alarm'] }),
    text: { title: 'Text', description: 'A short message to display in the dialogue area. Markdown okay.', type: 'string', maxLength: 400 },
    sound: c.object({ title: 'Sound', description: 'A dialogue sound file to accompany the message.', required: ['mp3', 'ogg'] }, {
      mp3: c.shortString({ title: 'MP3', format: 'sound-file' }),
      ogg: c.shortString({ title: 'OGG', format: 'sound-file' }),
      preload: { title: 'Preload', description: 'Whether to load this sound file before the level can begin (typically for the first dialogue of a level).', type: 'boolean' }
    }),
    voiceOver: c.voiceOver,
    responses: c.array({ title: 'Buttons', description: 'An array of buttons to include with the dialogue, with which the user can respond.' }, ResponseSchema),
    character: c.shortString({
      title: 'Character',
      description: 'The character portrait to use for the say message. Currently doesn\'t do anything. Use "Character Portrait" in the settings.',
      enum: ['vega', 'blank', 'capella'],
      default: 'vega'
    }),
    i18n: { type: 'object', format: 'i18n', props: ['blurb', 'text', 'sound'], description: 'Help translate this message' }
  }),
  move: c.object({ title: 'Move', description: 'Tell the Thang to move.', required: ['target'], default: { target: {}, duration: 500 } }, {
    target: _.extend(_.cloneDeep(PointSchema), { title: 'Target', description: 'Target point to which the Thang will move.', default: { x: 20, y: 20 } }),
    duration: { title: 'Duration', description: 'Number of milliseconds over which to move, or 0 for an instant move.', type: 'integer', minimum: 0, format: 'milliseconds' }
  }),
  tutorial: c.object({ title: 'Tutorial', description: 'Move Vega around on the screen as a step by step tutorial to explain things.', default: { internalRelease: false } }, {
    internalRelease: { title: 'Internal Release', description: 'Only show this step to admins or accounts with @codecombat emails', type: 'boolean' },
    position: c.shortString({
      title: 'Dialog Position',
      description: 'What side (or no side with "stationary") of the target element to move the tutorial modal to',
      enum: [
        'smart',
        'center',
        'stationary',
        'left',
        'top',
        'right',
        'down'
      ],
      default: 'smart'
    }),
    targetElement: c.shortString({
      title: 'Target Element',
      description: 'What part of the screen to point at, like the editor, code bank or play button',
      enum: [
        'Run Button',
        'Next Button',
        'Play Button',
        'Update Button',
        'Goal List',
        'Code Bank Button',
        'Code Editor Window'
      ],
      default: 'Code Editor Window'
    }),
    animation: c.shortString({
      title: 'Element Animation',
      description: 'How to animate the target',
      enum: [
        'Outline',
        'Shake',
        'Zoom'
      ]
    }),
    targetLine: { title: 'Target Line', description: 'Highlight a specific line in the code editor', type: 'number', default: 1 },
    grayOverlay: {
      title: 'Gray Overlay',
      description: 'Fade out the rest of the website, except the message itself and the targetElement (if you set one).',
      type: 'boolean',
      default: true
    },
    advanceOnTarget: { title: 'Advance On Target', description: 'Go to next step when clicking the target element (requires Target Element to be set)', type: 'boolean' },
    targetThangs: c.array({ title: 'Target Thangs', description: 'Thang IDs of target Sprites to highlight.' }, thang)
  }
  )
}
)

const NoteGroupSchema = c.object({ title: 'Note Group', description: 'A group of notes that should be sent out as a result of this script triggering.', displayProperty: 'name' }, {
  name: { title: 'Name', description: 'Short name describing the script, like \"Anya greets the player\", for your convenience.', type: 'string' }, // eslint-disable-line no-useless-escape
  dom: c.object({ title: 'DOM', description: 'Manipulate things in the play area DOM, outside of the level area canvas.' }, {
    focus: c.shortString({ title: 'Focus', description: 'Set the window focus to this DOM selector string.' }),
    showVictory: {
      title: 'Show Victory',
      description: 'Show the done button and maybe also the victory modal.',
      enum: [true, 'Done Button', 'Done Button And Modal'] // deprecate true, same as 'done_button_and_modal'
    },
    highlight: c.object({ title: 'Highlight', description: 'Highlight the target DOM selector string with a big arrow.' }, {
      target: c.shortString({ title: 'Target', description: 'Target highlight element DOM selector string.' }),
      delay: { type: 'integer', minimum: 0, title: 'Delay', description: 'Show the highlight after this many milliseconds. Doesn\'t affect the dim shade cutout highlight method.' },
      offset: _.extend(_.cloneDeep(PointSchema), { title: 'Offset', description: 'Pointing arrow tip offset in pixels from the default target.', format: null }),
      rotation: { type: 'number', minimum: 0, title: 'Rotation', description: 'Rotation of the pointing arrow, in radians. PI / 2 points left, PI points up, etc.', format: 'radians' },
      sides: c.array({ title: 'Sides', description: 'Which sides of the target element to point at.' }, { type: 'string', enum: ['left', 'right', 'top', 'bottom'], title: 'Side', description: 'A side of the target element to point at.' })
    }),
    lock: { title: 'Lock', description: 'Whether the interface should be locked so that the player\'s focus is on the script, or specific areas to lock.', type: ['boolean', 'array'], items: { type: 'string', enum: ['surface', 'editor', 'palette', 'hud', 'playback', 'playback-hover', 'level'] } },
    letterbox: { type: 'boolean', title: 'Letterbox', description: 'Turn letterbox mode on or off. Disables surface and playback controls.' }
  }),

  playback: c.object({ title: 'Playback', description: 'Control the playback of the level.' }, {
    playing: { type: 'boolean', title: 'Set Playing', description: 'Set whether playback is playing or paused.' },
    scrub: c.object({ title: 'Scrub', description: 'Scrub the level playback time to a certain point.', default: { offset: 2, duration: 1000, toRatio: 0.5 } }, {
      offset: { type: 'integer', title: 'Offset', description: 'Number of frames by which to adjust the scrub target time.' },
      duration: { type: 'integer', title: 'Duration', description: 'Number of milliseconds over which to scrub time.', minimum: 0, format: 'milliseconds' },
      toRatio: { type: 'number', title: 'To Progress Ratio', description: 'Set playback time to a target playback progress ratio.', minimum: 0, maximum: 1 },
      toTime: { type: 'number', title: 'To Time', description: 'Set playback time to a target playback point, in seconds.', minimum: 0 },
      toGoal: c.shortString({ title: 'To Goal', description: 'Set playback time to when this goal was achieved. (TODO: not implemented.)' })
    }
    )
  }
  ),

  script: c.object({ title: 'Script', description: 'Extra configuration for this action group.' }, {
    duration: { type: 'integer', minimum: 0, title: 'Duration', description: 'How long this script should last in milliseconds. 0 for indefinite.', format: 'milliseconds' },
    skippable: { type: 'boolean', title: 'Skippable', description: 'Whether this script shouldn\'t bother firing when the player skips past all current scripts.' },
    beforeLoad: { type: 'boolean', title: 'Before Load', description: 'Whether this script should fire before the level is finished loading.' }
  }),

  sprites: c.array({ title: 'Sprites', description: 'Commands to issue to Sprites on the Surface.' }, SpriteCommandSchema),

  surface: c.object({ title: 'Surface', description: 'Commands to issue to the Surface itself.' }, {
    focus: c.object({ title: 'Camera', description: 'Focus the camera on a specific point on the Surface.', format: 'viewport' }, {
      target: { anyOf: [PointSchema, thang, { type: 'null' }], title: 'Target', description: 'Where to center the camera view.', default: { x: 0, y: 0 } },
      zoom: { type: 'number', minimum: 0, exclusiveMinimum: true, maximum: 64, title: 'Zoom', description: 'What zoom level to use.' },
      duration: { type: 'number', minimum: 0, title: 'Duration', description: 'in ms' },
      bounds: c.array({ title: 'Boundary', maxItems: 2, minItems: 2, default: [{ x: 0, y: 0 }, { x: 46, y: 39 }], format: 'bounds' }, PointSchema),
      isNewDefault: { type: 'boolean', format: 'hidden', title: 'New Default', description: 'Set this as new default zoom once scripts end.' }
    }), // deprecated
    highlight: c.object({ title: 'Highlight', description: 'Highlight specific Sprites on the Surface.' }, {
      targets: c.array({ title: 'Targets', description: 'Thang IDs of target Sprites to highlight.' }, thang),
      delay: { type: 'integer', minimum: 0, title: 'Delay', description: 'Delay in milliseconds before the highlight appears.' }
    }),
    lockSelect: { type: 'boolean', title: 'Lock Select', description: 'Whether to lock Sprite selection so that the player can\'t select/deselect anything.' }
  }),

  sound: c.object({ title: 'Sound', description: 'Commands to control sound playback.' }, {
    suppressSelectionSounds: { type: 'boolean', title: 'Suppress Selection Sounds', description: 'Whether to suppress selection sounds made from clicking on Thangs.' },
    music: c.object({ title: 'Music', description: 'Control music playing' }, {
      play: { title: 'Play', type: 'boolean' },
      file: c.shortString({
        title: 'File',
        enum: [
          '/music/OzariaPhoenixLandsMusicLoop4',
          '/music/OzariaPhoenixLandsMusicLoop3',
          '/music/OzariaPhoenixLandsMusicLoop2b',
          '/music/OzariaPhoenixLandsMusicLoop1b',
          '/music/OzariaCarnivalMusicLoop1',
          '/music/OzariaCarnivalMusicLoop2',
          '/music/OzariaCarnivalMusicLoop3',
          '/music/OzariaCityMusicLoop1',
          '/music/OzariaCityMusicLoop2',
          '/music/OzariaCityMusicLoop3',
          '/music/OzariaLoopMusic1',
          '/music/OzariaLoopMusic2',
          '/music/OzariaLoopMusic3',
          '/music/OzariaLoopMusic5',
          '/music/OzariaMusicLoop4',
          '/music/SpiritLandsAmbient01',
          '/music/OzariaSpiritLands1',
          '/music/OzariaSpiritLands2',
          '/music/OzariaSpiritLands3',
          '/music/forestAmbience01',
          '/music/forestAmbience02',
          '/music/forestAmbience03',
          '/music/mountainWind01',
          '/music/music_level_1',
          '/music/music_level_2',
          '/music/music_level_3',
          '/music/music_level_4',
          '/music/music_level_5',
          '/music/music_sophia_1']
      })
    }
    )
  }
  )
}
)

const ScriptSchema = c.object({
  title: 'Script',
  description: 'A script fires off a chain of notes to interact with the game when a certain event triggers it.',
  required: ['channel'],
  default: { channel: 'world:won', noteChain: [] }
}, {
  id: c.shortString({ title: 'ID', description: 'A unique ID that other scripts can rely on in their Happens After prereqs, for sequencing.', pattern: '^[a-zA-Z 0-9:\'"_!-]+$' }), // uniqueness? Ideally this would be just ids-like-this but we have a lot of legacy data.
  channel: c.shortString({ title: 'Event', format: 'event-channel', description: 'Event channel this script might trigger for, like "world:won".' }),
  eventPrereqs: c.array({ title: 'Event Checks', description: 'Logical checks on the event for this script to trigger.', format: 'event-prereqs' }, EventPrereqSchema),
  repeats: { title: 'Repeats', description: 'Whether this script can trigger more than once during a level.', enum: [true, false, 'session'] },
  scriptPrereqs: c.array({ title: 'Happens After', description: 'Scripts that need to fire first.' },
    c.shortString({ title: 'ID', description: 'A unique ID of a script.' })),
  notAfter: c.array({ title: 'Not After', description: 'Do not run this script if any of these scripts have run.' },
    c.shortString({ title: 'ID', description: 'A unique ID of a script.' })),
  noteChain: c.array({ title: 'Actions', description: 'A list of things that happen when this script triggers.' }, NoteGroupSchema)
}
)

const LevelThangSchema = c.object({
  title: 'Thang',
  description: 'Thangs are any units, doodads, or abstract things that you use to build the level. (\"Thing\" was too confusing to say.)', // eslint-disable-line no-useless-escape
  format: 'thang',
  required: ['id', 'thangType', 'components'],
  default: {
    id: 'Boris',
    thangType: 'Soldier',
    components: []
  }
}, {
  id: thang, // TODO: figure out if we can make this unique and how to set dynamic defaults
  thangType: c.objectId({ links: [{ rel: 'db', href: '/db/thang.type/{($)}/version' }], title: 'Thang Type', description: 'A reference to the original Thang template being configured.', format: 'thang-type' }),
  components: c.array({ title: 'Components', description: 'Thangs are configured by changing the Components attached to them.', uniqueItems: true, format: 'thang-components-array' }, ThangComponentSchema)
}
) // TODO: uniqueness should be based on 'original', not whole thing

const LevelSystemSchema = c.object({
  title: 'System',
  description: 'Configuration for a System that this Level uses.',
  format: 'level-system',
  required: ['original', 'majorVersion'],
  default: {
    majorVersion: 0,
    config: {}
  },
  links: [{ rel: 'db', href: '/db/level.system/{(original)}/version/{(majorVersion)}' }]
}, {
  original: c.objectId({ title: 'Original', description: 'A reference to the original System being configured.', format: 'hidden' }),
  config: c.object({ title: 'Configuration', description: 'System-specific configuration properties.', additionalProperties: true, format: 'level-system-configuration' }),
  majorVersion: { title: 'Major Version', description: 'Which major version of the System is being used.', type: 'integer', minimum: 0, format: 'hidden' }
})

const GeneralArticleSchema = c.object({
  title: 'Article',
  description: 'Reference to a general documentation article.',
  required: ['original'],
  format: 'latest-version-reference',
  default: {
    original: null,
    majorVersion: 0
  },
  links: [{ rel: 'db', href: '/db/article/{(original)}/version/{(majorVersion)}' }]
}, {
  original: c.objectId({ title: 'Original', description: 'A reference to the original Article.' }), //, format: 'hidden')  # hidden?
  majorVersion: { title: 'Major Version', description: 'Which major version of the Article is being used.', type: 'integer', minimum: 0 }
}) //, format: 'hidden'}  # hidden?

const IntroContentObject = {
  type: 'object',
  additionalProperties: false,
  properties: {
    type: { title: 'Content type', enum: ['cinematic', 'interactive', 'cutscene-video', 'avatarSelectionScreen'] },
    contentId: {
      oneOf: [
        c.stringID({ title: 'Content ID for all languages' }),
        {
          type: 'object',
          title: 'Content ID specific to languages',
          additionalProperties: c.stringID(),
          format: 'code-languages-object'
        }
      ]
    }
  }
}

const LevelSchema = c.object({
  title: 'Level',
  description: 'A spectacular level which will delight and educate its stalwart players with the sorcery of coding.',
  required: ['name'],
  default: {
    name: 'Ineffable Wizardry',
    description: 'This level is indescribably flarmy.',
    documentation: {},
    scripts: [],
    thangs: [],
    systems: [],
    victory: {},
    type: 'hero',
    goals: [
      { id: 'ogres-die', name: 'Defeat the ogres.', killThangs: ['ogres'], worldEndsAfter: 3 },
      { id: 'humans-survive', name: 'Your hero must survive.', saveThangs: ['Hero Placeholder'], howMany: 1, worldEndsAfter: 3, hiddenGoal: true }
    ],
    concepts: ['basic_syntax'],
    product: 'codecombat',
  }
})
c.extendNamedProperties(LevelSchema) // let's have the name be the first property
_.extend(LevelSchema.properties, {
  description: { title: 'Description', description: 'A short explanation of what this level is about.', type: 'string', maxLength: 65536, format: 'markdown', inEditor: true },
  displayName: c.shortString({ title: 'Display Name', inEditor: 'ozaria' }), // Currently just used in Ozaria
  studentPlayInstructions: { title: 'Student Play Instructions', description: 'Instructions for game dev levels when students play them.', type: 'string', maxLength: 65536, format: 'markdown', inEditor: true },
  loadingTip: { type: 'string', title: 'Loading Tip', description: 'What to show for this level while it\'s loading.', inEditor: 'codecombat' },
  documentation: c.object({ title: 'Documentation', description: 'Documentation articles relating to this level.', default: { specificArticles: [], generalArticles: [] }, inEditor: true }, {
    specificArticles: c.array({ title: 'Specific Articles', description: 'Specific documentation articles that live only in this level.', uniqueItems: true }, SpecificArticleSchema),
    generalArticles: c.array({ title: 'General Articles', description: 'General documentation articles that can be linked from multiple levels.', uniqueItems: true }, GeneralArticleSchema),
    hints: c.array({ title: 'Hints', description: 'Tips and tricks to help unstick a player for the level.', uniqueItems: true }, {
      type: 'object',
      properties: {
        body: { type: 'string', title: 'Content', description: 'The body content of the article, in Markdown.', format: 'markdown' },
        i18n: { type: 'object', format: 'i18n', props: ['body'], description: 'Help translate this hint' }
      }
    }),
    hintsB: c.array({ title: 'HintsB', description: '2nd style of hints for a/b testing significant variations', uniqueItems: true }, {
      type: 'object',
      properties: {
        body: { type: 'string', title: 'Content', description: 'The body content of the article, in Markdown.', format: 'markdown' },
        i18n: { type: 'object', format: 'i18n', props: ['body'], description: 'Help translate this hint' }
      }
    })
  }),
  // These next few properties are just for Ozaria
  screenshot: { type: 'string', format: 'image-file', title: 'Screenshot', description: 'Relevant for teacher dashboard', inEditor: 'ozaria' },
  exemplarProjectUrl: c.url({ title: 'Exemplar Project URL', description: 'Needed for capstones only. Relevant for teacher dashboard (curriculum guides and projects page)', inEditor: 'ozaria' }),
  exemplarCodeUrl: c.url({ title: 'Exemplar Code URL', description: 'Needed for capstones only. Relevant for teacher dashboard (curriculum guides and projects page)', inEditor: 'ozaria' }),
  projectRubricUrl: c.url({ title: 'Project Rubric URL', description: 'Needed for capstones only. Relevant for teacher dashboard (curriculum guides and projects page)', inEditor: 'ozaria' }),
  totalStages: c.int({ title: 'Capstone Total Stages', description: 'Only needed for chapter 1 capstones. Tells the teacher dashboard (track progress table and curriculum guide) where to display this capstone. Required when we want to offset capstone to display after levels that are between the stages.', inEditor: 'ozaria' }),

  arenaCurriculumUrl: c.url({ title: 'Arena Curriculum URL', description: 'Needed for arena levels only. Relevant for teacher dashboard (ai league page)', inEditor: 'codecombat' }),

  nextLevel: {
    type: 'object',
    links: [{ rel: 'extra', href: '/db/level/{($)}' }, { rel: 'db', href: '/db/level/{(original)}/version/{(majorVersion)}' }],
    format: 'latest-version-reference',
    title: 'Next Level',
    description: 'Reference to the next level players will play after beating this one.',
    inEditor: 'codecombat'
  },
  scripts: c.array({ title: 'Scripts', description: 'An array of scripts that trigger based on what the player does and affect things outside of the core level simulation.' }, ScriptSchema),
  thangs: c.array({ title: 'Thangs', description: 'An array of Thangs that make up the level.' }, LevelThangSchema),
  systems: c.array({ title: 'Systems', description: 'Levels are configured by changing the Systems attached to them.', uniqueItems: true }, LevelSystemSchema), // TODO: uniqueness should be based on 'original', not whole thing
  victory: c.object({ title: 'Victory Screen', inEditor: 'codecombat' }, {
    body: { type: 'string', format: 'markdown', title: 'Body Text', description: 'Inserted into the Victory Modal once this level is complete. Tell the player they did a good job and what they accomplished!' },
    i18n: { type: 'object', format: 'i18n', props: ['body'], description: 'Help translate this victory message' }
  }),
  i18n: { type: 'object', format: 'i18n', props: ['name', 'description', 'loadingTip', 'studentPlayInstructions', 'displayName'], description: 'Help translate this level', inEditor: true },
  banner: { type: 'string', format: 'image-file', title: 'Banner', inEditor: 'codecombat' },
  goals: c.array({ title: 'Goals', description: 'An array of goals which are visible to the player and can trigger scripts.', inEditor: true }, GoalSchema),
  type: c.shortString({ title: 'Type', description: 'What type of level this is.', enum: ['campaign', 'ladder', 'ladder-tutorial', 'hero', 'hero-ladder', 'hero-coop', 'course', 'course-ladder', 'game-dev', 'web-dev', 'intro'], inEditor: true }),
  kind: c.shortString({ title: 'Kind', description: 'Similar to type, but just for our organization.', enum: ['demo', 'usage', 'mastery', 'advanced', 'practice', 'challenge'], inEditor: 'codecombat' }),
  ozariaType: c.shortString({ title: 'Ozaria Level Type', description: 'Similar to type, specific to ozaria.', enum: ['practice', 'challenge', 'capstone'], inEditor: 'ozaria' }),
  terrain: c.terrainString,
  requiresSubscription: { title: 'Requires Subscription', description: 'Whether this level is available to subscribers only.', type: 'boolean', inEditor: 'codecombat' },
  classroomSub: { $ref: '#/definitions/classroomSub', inEditor: true },
  tasks: c.array({ title: 'Tasks', description: 'Tasks to be completed for this level.' }, c.task),
  helpVideos: c.array({ title: 'Help Videos', inEditor: 'codecombat' }, c.object({ default: { style: 'eccentric', url: '', free: false } }, {
    style: c.shortString({ title: 'Style', description: 'Like: original, eccentric, scripted, edited, etc.' }),
    free: { type: 'boolean', title: 'Free', description: 'Whether this video is freely available to all players without a subscription.' },
    url: c.url({ title: 'URL', description: 'Link to the video on Vimeo.' })
  })),
  replayable: { type: 'boolean', title: 'Replayable', description: 'Whether this (hero) level infinitely scales up its difficulty and can be beaten over and over for greater rewards.', inEditor: 'codecombat' },
  buildTime: { type: 'number', description: 'How long it has taken to build this level.' },
  practice: { type: 'boolean', inEditor: 'codecombat' },
  practiceThresholdMinutes: { type: 'number', description: 'Players with larger playtimes may be directed to a practice level.', inEditor: 'codecombat' },
  assessment: { type: ['boolean', 'string'], enum: [true, false, 'open-ended', 'cumulative'], description: 'Set to true if this is an assessment level.', inEditor: true }, // ozaria has a few, needed?
  assessmentPlacement: { type: 'string', enum: ['middle', 'end'], inEditor: 'codecombat' },

  characterPortrait: c.shortString({
    title: 'Character Portrait',
    description: 'The character portrait to use for the say messages.',
    enum: ['vega', 'blank', 'capella', 'octans', 'wise-capella', 'astra', 'snikrep', 'salazar', 'young-salazar', 'dragon-salazar'],
    default: 'vega',
    inEditor: 'ozaria'
  }),

  primerLanguage: { type: 'string', enum: ['javascript', 'python'], description: 'Programming language taught by this level.', inEditor: 'codecombat' },
  shareable: { title: 'Shareable', type: ['string', 'boolean'], enum: [false, true, 'project'], description: 'Whether the level is not shareable (false), shareable (true), or a sharing-encouraged project level ("project"). Make sure to use "project" for project levels so they show up correctly in the Teacher Dashboard.', inEditor: true },

  // Admin flags
  adventurer: { type: 'boolean', inEditor: 'codecombat' },
  adminOnly: { type: 'boolean', inEditor: 'codecombat' },
  releasePhase: { enum: ['beta', 'internalRelease', 'released'], title: 'Release status', description: 'Release status of the level, determining who sees it.', default: 'internalRelease', inEditor: true },
  disableSpaces: { type: ['boolean', 'integer'], inEditor: 'codecombat' },
  hidesSubmitUntilRun: { type: 'boolean', inEditor: 'codecombat' },
  hidesPlayButton: { type: 'boolean', inEditor: 'codecombat' },
  hidesRunShortcut: { type: 'boolean', inEditor: 'codecombat' },
  hidesHUD: { type: 'boolean', inEditor: 'codecombat' },
  hidesSay: { type: 'boolean', inEditor: 'codecombat' },
  hidesCodeToolbar: { type: 'boolean', inEditor: 'codecombat' },
  hidesRealTimePlayback: { type: 'boolean', inEditor: 'codecombat' },
  backspaceThrottle: { type: 'boolean', inEditor: 'codecombat' },
  lockDefaultCode: { type: ['boolean', 'integer'], inEditor: 'codecombat' },
  moveRightLoopSnippet: { type: 'boolean', inEditor: 'codecombat' },
  realTimeSpeedFactor: { type: 'number', inEditor: 'codecombat' },
  autocompleteFontSizePx: { type: 'number', inEditor: 'codecombat' },
  requiredCode: c.array({ inEditor: true }, {
    type: 'string'
  }),
  suspectCode: c.array({ inEditor: true }, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      pattern: { type: 'string' }
    }
  }),
  autocompleteReplacement: c.array({ inEditor: true }, {
    type: 'object',
    properties: {
      name: { type: 'string' },
      snippets: {
        type: 'object',
        title: 'Snippets',
        description: 'List of snippets for the respective programming languages',
        additionalProperties: c.codeSnippet,
        format: 'code-languages-object'
      }
    }
  }),
  requiredGear: {
    type: 'object',
    title: 'Required Gear',
    description: 'Slots that should require one of a set array of items for that slot',
    inEditor: 'codecombat',
    additionalProperties: {
      type: 'array',
      items: { type: 'string', links: [{ rel: 'db', href: '/db/thang.type/{($)}/version' }], format: 'latest-version-original-reference' }
    }
  },
  restrictedGear: {
    type: 'object',
    title: 'Restricted Gear',
    description: 'Slots that should restrict all of a set array of items for that slot',
    inEditor: 'codecombat',
    additionalProperties: {
      type: 'array',
      items: { type: 'string', links: [{ rel: 'db', href: '/db/thang.type/{($)}/version' }], format: 'latest-version-original-reference' }
    }
  },
  requiredProperties: { type: 'array', items: { type: 'string' }, description: 'Names of properties a hero must have equipped to play.', format: 'solution-gear', title: 'Required Properties', inEditor: 'codecombat' },
  restrictedProperties: { type: 'array', items: { type: 'string' }, description: 'Names of properties a hero must not have equipped to play.', title: 'Restricted Properties', inEditor: 'codecombat' },
  recommendedHealth: { type: 'number', minimum: 0, exclusiveMinimum: true, description: 'If set, will show the recommended health to be able to beat this level with the intended main solution to the player when choosing equipment.', format: 'solution-stats', title: 'Recommended Health', inEditor: 'codecombat' },
  maximumHealth: { type: 'number', minimum: 0, exclusiveMinimum: true, description: 'If set, will enforce the maximum health of the hero.', title: 'Maximum Health', inEditor: 'codecombat' },
  clampedProperties: {
    type: 'object',
    title: 'Clamped Properties',
    description: 'Other non-health properties that should be clamped to a range of values (attackDamage, maxSpeed, etc.). Only applies for classroom players with classroom items enabled.',
    inEditor: 'codecombat',
    additionalProperties: {
      type: 'object',
      properties: {
        min: { type: 'number' },
        max: { type: 'number' }
      }
    }
  },
  allowedHeroes: {
    type: 'array',
    title: 'Allowed Heroes',
    description: 'Which heroes can play this level. For any hero, leave unset.',
    inEditor: 'codecombat',
    items: {
      type: 'string', links: [{ rel: 'db', href: '/db/thang.type/{($)}/version' }], format: 'latest-version-original-reference'
    }
  },
  campaign: c.shortString({ title: 'Campaign', description: 'Set automatically by the campaign editor. Which campaign this level is part of (like "desert").', format: 'hidden', inEditor: 'ozaria' }),
  campaignIndex: c.int({ title: 'Campaign Index', description: 'The 0-based index of this level in its campaign.', format: 'hidden' }), // Automatically set by campaign editor.
  scoreTypes: c.array({ title: 'Score Types', description: 'What metric to show leaderboards for. Most important one first, not too many (2 is good).', inEditor: 'codecombat' }, {
    anyOf: [
      c.scoreType,
      {
        type: 'object',
        title: 'Score Type Object',
        required: ['type'],
        additionalProperties: false,
        properties: {
          type: c.scoreType,
          thresholds: {
            type: 'object',
            properties: {
              bronze: { type: 'number' },
              silver: { type: 'number' },
              gold: { type: 'number' }
            }
          }
        }
      }
    ]
  }),
  concepts: c.array({ title: 'Programming Concepts', description: 'Which programming concepts this level covers.', uniqueItems: true, format: 'concepts-list', inEditor: true }, c.concept),
  primaryConcepts: c.array({ title: 'Primary Concepts', description: 'The main 1-3 concepts this level focuses on.', uniqueItems: true, inEditor: true }, c.concept),
  picoCTFProblem: { type: 'string', description: 'Associated picoCTF problem ID, if this is a picoCTF level' },
  password: { type: 'string', description: 'The password required to create a session for this level', inEditor: 'codecombat' },
  mirrorMatch: { type: 'boolean', description: 'Whether a multiplayer ladder arena is a mirror match', inEditor: 'codecombat' },
  codePoints: c.int({ title: 'CodePoints', minimum: 0, description: 'CodePoints that can be earned for completing this level' }),
  clans: c.array({ description: 'If at least one clan is specified, only allow the users in these clans to access the level', format: 'clans-list', inEditor: 'codecombat' }, c.objectId()),
  // Next few are Ozaria-only
  introContent: { // valid for levels of type 'intro'
    title: 'Intro content',
    description: 'Intro content sequence',
    type: 'array',
    items: IntroContentObject,
    inEditor: 'ozaria'
  },
  creativeMode: { title: 'Creative Mode', type: 'boolean', description: 'Only changes behavior of capstone levels. Treats the last stage of capstones as a creative mode, where goals are turned off. This also saves the students prior code created in prior stages. A teacher is able to see both normal code and creative code. Finally when student restarts level they start from their normal code written before creative mode.', inEditor: 'ozaria' },
  additionalGoals: c.array({ title: 'Additional Goals', description: 'Goals that are added after the first regular goals are completed', inEditor: 'ozaria' }, c.object({
    title: 'Goals',
    description: 'Goals for this stage',
    minItems: 1,
    uniqueItems: true,
    properties: {
      stage: { type: 'integer', minimum: 2, title: 'Goal Stage', description: 'Which stage these additional goals are for (2 and onwards)' },
      goals: c.array({ title: 'Goals', description: 'An array of goals which are visible to the player and can trigger scripts.' }, GoalSchema)
    }
  })),
  isPlayedInStages: { type: 'boolean', title: 'Is Played in Stages', description: 'Is this level played in stages and other content(cinematics) is loaded in between stages', inEditor: 'ozaria' },
  methodsBankList: c.array({ title: 'Methods Bank List', inEditor: 'ozaria' }, c.object({
    properties: {
      name: c.shortString({ title: 'Name' }),
      section: c.shortString({ title: 'Methods Bank Section', pattern: /^\w[\w ]*$/ }),
      subSection: c.shortString({ title: 'Methods Bank Sub-Section', pattern: /^\w[\w ]*$/ }),
      componentName: c.shortString({ title: 'Level Component Name', description: 'Level Component to use for documentation in case there are multiple components with same property\'s documentation' })
    }
  })),
  archived: { type: 'integer', description: 'Marks this level with to be hidden from searches and lookups. Number is milliseconds since 1 January 1970 UTC, when it was marked as hidden.' },
  difficulty: { type: 'integer', title: 'Difficulty', description: 'Difficulty of this level - used to show difficulty in star-rating of 1 to 5', minimum: 1, maximum: 5, inEditor: 'codecombat' },
  product: _.extend(c.singleProduct, { inEditor: true }),
  aiAssistantSystemPrompt: { type: 'string', description: 'Prompt for the AI assistant system to use for this level', inEditor: 'codecombat', title: 'AI Assistant System Prompt', format: 'markdown' },
})

LevelSchema.definitions = {
  classroomSub: {
    title: 'Classroom Subscription',
    description: 'Whether this level is available in classroom content for subscribers only.',
    type: 'object',
    required: ['base'],
    properties: {
      base: {
        type: 'string',
        enum: ['paid', 'free', 'free-after-sales'],
      },
    },
    patternProperties: {
      '^[a-zA-Z-]*$': { // ISO country code
        type: 'string',
        enum: ['paid', 'free', 'free-after-sales'],
      },
    },
  },
}

c.extendBasicProperties(LevelSchema, 'level')
c.extendSearchableProperties(LevelSchema)
c.extendVersionedProperties(LevelSchema, 'level')
c.extendPermissionsProperties(LevelSchema, 'level')
c.extendPatchableProperties(LevelSchema)
c.extendTranslationCoverageProperties(LevelSchema)

module.exports = LevelSchema

// To test:
// 1: Copy the schema from http://localhost:3000/db/level/schema
// 2. Open up the Treema demo page http://localhost:9090/demo.html
// 3. tv4.addSchema(metaschema.id, metaschema)
// 4. S = <paste big schema here>
// 5. tv4.validateMultiple(S, metaschema) and look for errors
