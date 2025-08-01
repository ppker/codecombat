// WARNING: This file is auto-generated from within AI HackStack. Do not edit directly.
// Instead, edit the corresponding Zod schema in the HackStack repo and run `npm run build` or `npm run build:schemas
//
// Last updated: 2024-10-03T19:41:05.121Z

const _ = require('lodash')
const c = require('./../schemas')

const AIChatMessageSchema = c.object({
  title: 'AI Chat Message',
  description: 'A generative AI interaction',
})

_.extend(AIChatMessageSchema.properties, {
  actor: { title: 'Actor', type: 'string', enum: ['user', 'model', 'teacher', 'celebrate', 'alert'] },
  parent: {
    title: 'Parent',
    type: ['object', 'string'],
    description: 'The parent chat of this message',
    format: 'chat-message-parent-link',
    refPath: 'parentKind',
  },
  parentKind: {
    title: 'Parent Kind',
    type: 'string',
    description: 'Whether this message is part of a scenario or project chat',
    enum: ['scenario', 'project'],
  },
  sentAt: { title: 'Sent At', type: 'number' },
  text: { title: 'Text', type: 'string', description: 'The content text of the chat message', format: 'markdown' },
  documents: {
    title: 'Documents',
    type: 'array',
    description: 'The attached AI Document objects',
    items: {
      type: ['string', 'object'],
      links: [{ rel: 'db', href: '/db/level/{($)}/version' }],
      format: 'ai-document-link',
    },
  },
  actionData: {
    title: 'Action Data',
    type: 'object',
    description: 'Metadata for rendering this chat message as an action UI element',
    additionalProperties: true,
    properties: {
      choices: {
        type: 'array',
        description: 'A choice for the user to select from',
        items: {
          type: 'object',
          additionalProperties: true,
          properties: {
            text: { type: 'string', title: 'Text', description: 'Text of the choice' },
            responseText: { type: 'string', title: 'Response', description: 'the response of the choice' },
            i18n: {
              type: 'object',
              format: 'i18n',
              props: ['text', 'responseText'],
              description: 'Help translate this property',
            },
          },
        },
      },
    },
  },
  i18n: { title: 'I18n', type: 'object', description: 'Help translate this property', format: 'i18n', props: ['text'] },
  ownerID: { title: 'Owner Id', type: ['object', 'string'], description: 'The user who created this chat message' },
  safetyValidation: {
    title: 'Safety Validation',
    type: 'array',
    description: 'The safety validation of the chat message',
    items: {
      type: 'object',
      properties: {
        failureType: {
          title: 'Failure Type',
          type: 'string',
          description: 'The type of failure that occurred when validating the chat message',
          enum: ['Adults', 'Inappropriate', 'Spam', 'Violence', 'Drugs', 'Other'],
        },
        failureDetails: {
          title: 'Failure Details',
          type: 'string',
          description: 'Details about the failure that occurred when validating the chat message',
        },
      },
    },
  },
  apiUsage: {
    title: 'API Usage',
    type: 'object',
    description: 'The API usage of the chat message',
    additionalProperties: true,
    properties: {
      tool: {
        type: 'string',
        description: 'The tool/model used for the chat message',
      },
    },
  },
  safetyApiUsage: {
    title: 'Safety API Usage',
    type: 'object',
    description: 'The safety API usage of the chat message',
    additionalProperties: true,
    properties: {
      tool: {
        type: 'string',
        description: 'The tool/model used for the chat message',
      },
    },
  },
})

AIChatMessageSchema.required = ['actor', 'parent', 'parentKind', 'sentAt', 'text', 'documents', 'ownerID']

c.extendBasicProperties(AIChatMessageSchema, 'ai_chat_message')
c.extendSearchableProperties(AIChatMessageSchema, 'ai_chat_message')
c.extendTranslationCoverageProperties(AIChatMessageSchema, 'ai_chat_message')

module.exports = AIChatMessageSchema
