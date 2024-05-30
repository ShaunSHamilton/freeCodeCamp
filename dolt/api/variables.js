// table names in the database
const tables = {
  app_url: 'app_url',
  assignments: 'assignments',
  audio_path: 'audio_path',
  bilibili_ids: 'bilibili_ids',
  block_time_to_complete: 'block_time_to_complete',
  blocks_challenges: 'blocks_challenges',
  block_is_upcoming_change: 'block_is_upcoming_change',
  certifications_prerequisites: 'certifications_prerequisites',
  challenge_files: 'challenge_files',
  challenge_type: 'challenge_type',
  course_url: 'course_url',
  descriptions: 'descriptions',
  disable_loop_protect_preview: 'disable_loop_protect_preview',
  disable_loop_protect_tests: 'disable_loop_protect_tests',
  display_preview_modal: 'display_preview_modal',
  editor_address_allowed: 'editor_address_allowed',
  fill_in_the_blank: 'fill_in_the_blank',
  forum_topic_id: 'forum_topic_id',
  help_category: 'help_category',
  instructions: 'instructions',
  local_address_allowed: 'local_address_allowed',
  ms_trophy_id: 'ms_trophy_id',
  notes: 'notes',
  prerequisites: 'prerequisites',
  question: 'question',
  required_resources: 'required_resources',
  scene: 'scene',
  solutions: 'solutions',
  source_code_url: 'source_code_url',
  superblocks_blocks: 'superblocks_blocks',
  template: 'template',
  tests: 'tests',
  title: 'title',
  uses_multifile_editor: 'uses_multifile_editor',
  video_id: 'video_id',
  video_locale_ids: 'video_locale_ids',
  video_url: 'video_url',
  challenges: 'challenges',
  blocks: 'blocks',
  certifications: 'certifications',
  superblocks: 'superblocks'
};

// challenge feature tables with an identifying column in the table,
// column name in that table on the right
export const featureTablesWithColumns = {
  [tables.assignments]: 'assignments',
  [tables.audio_path]: 'audioPath',
  [tables.bilibili_ids]: 'bilibiliIds',
  // [tables.block_time_to_complete]: [],
  // [tables.blocks_challenges]: [],
  // [tables.certifications_prerequisites]: [],
  [tables.challenge_files]: 'challengeFiles',
  [tables.challenge_type]: 'challengeType',
  [tables.course_url]: 'course_url',
  [tables.descriptions]: 'descriptions',
  [tables.fill_in_the_blank]: 'fillInTheBlank',
  [tables.forum_topic_id]: 'forumTopicId',
  [tables.help_category]: 'helpCategory',
  [tables.instructions]: 'instructions',
  // [tables.local_address_allowed]: [],
  [tables.ms_trophy_id]: 'msTrophyId',
  [tables.notes]: 'notes',
  [tables.prerequisites]: 'prerequisites',
  [tables.question]: 'question',
  [tables.required_resources]: 'required_resources',
  [tables.scene]: 'scene',
  [tables.solutions]: 'solutions',
  // [tables.superblocks_blocks]: [],
  [tables.template]: 'template',
  [tables.tests]: 'tests',
  [tables.title]: 'title',
  [tables.video_id]: 'videoId',
  [tables.video_locale_ids]: 'videoLocaleIds',
  [tables.video_url]: 'videoUrl'
  // [tables.challenges]: [],
  // [tables.blocks]: [],
  // [tables.certifications]: [],
  // [tables.superblocks]: []
};

// feature tables with required columns
export const featureTablesWithRequiredColumns = {
  [tables.app_url]: ['required'],
  [tables.source_code_url]: ['required']
};

// tables with just a challenge_id column to represent a boolean value,
// graphQl names on the right
export const booleanFeatureTables = {
  [tables.disable_loop_protect_preview]: 'disableLoopProtectPreview',
  [tables.disable_loop_protect_tests]: 'disableLoopProtectTests',
  [tables.display_preview_modal]: 'displayPreviewModal',
  [tables.editor_address_allowed]: 'editorAddressAllowed',
  [tables.local_address_allowed]: 'localAddressAllowed',
  [tables.uses_multifile_editor]: 'usesMultifileEditor'
};

// should probably track the columns instead, but this works for now
// converts the main column in these tables to json
export const tablesToJson = [
  tables.assignments,
  tables.bilibili_ids,
  tables.challenge_files,
  tables.fill_in_the_blank,
  tables.prerequisites,
  tables.question,
  tables.required_resources,
  tables.scene,
  tables.solutions,
  tables.tests,
  tables.video_locale_ids
];

// names of keys our learn client expects that differ from the column names in the database
export const columnsToGraphqlName = {
  descriptions: 'description',
  disable_loop_protect_preview: 'disableLoopProtectPreview',
  disable_loop_protect_tests: 'disableLoopProtectTests',
  bilibili_ids: 'bilibiliIds',
  challenge_files: 'challengeFiles',
  fill_in_the_blank: 'fillInTheBlank',
  prerequisites: 'prerequisites',
  required_resources: 'required',
  question: 'question',
  course_url: 'url'
};

// Get the name of the cert key for the curriculum.certifications object from the cert dashed name
export const certDashedNameToKey = {
  'a2-english-for-developers': 'a2-english-for-developers-certification',
  'back-end-development-and-apis':
    'back-end-development-and-apis-certification',
  'college-algebra-with-python': 'college-algebra-with-python-certification',
  'data-analysis-with-python': 'data-analysis-with-python-certification',
  'data-visualization': 'data-visualization-certification',
  'example-certification': 'example-certification',
  'foundational-c-sharp-with-microsoft':
    'foundational-c-sharp-with-microsoft-certification',
  'front-end-development-libraries':
    'front-end-development-libraries-certification',
  'information-security': 'information-security-certification',
  'javascript-algorithms-and-data-structures':
    'javascript-algorithms-and-data-structures-certification',
  'javascript-algorithms-and-data-structures-v8':
    'javascript-algorithms-and-data-structures-v8',
  'legacy-back-end': 'legacy-back-end-certification',
  'legacy-data-visualization': 'legacy-data-visualization-certification',
  'legacy-front-end': 'legacy-front-end-certification',
  'legacy-full-stack': 'legacy-full-stack-certification',
  'legacy-information-security-and-quality-assurance':
    'legacy-information-security-and-quality-assurance-certification',
  'machine-learning-with-python': 'machine-learning-with-python-certification',
  'quality-assurance': 'quality-assurance-certification',
  'relational-database': 'relational-database-certification',
  'responsive-web-design': 'responsive-web-design-certification',
  'scientific-computing-with-python':
    'scientific-computing-with-python-certification',
  'upcoming-python-certification': 'upcoming-python-certification'
};
