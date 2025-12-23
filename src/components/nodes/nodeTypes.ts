import { NodeData } from '@/store/workflowStore';

export interface NodeTypeConfig {
  type: string;
  label: string;
  icon: string;
  color: string;
  category: string;
  description: string;
  configFields: ConfigField[];
  defaultConfig: Record<string, any>;
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'json';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export const nodeTypes: NodeTypeConfig[] = [
  // Triggers
  {
    type: 'youtube-trigger',
    label: 'YouTube Trigger',
    icon: '▶️',
    color: '#ff0000',
    category: 'Triggers',
    description: 'Triggers workflow when new video is uploaded to a channel',
    configFields: [
      { name: 'channelId', label: 'Channel ID', type: 'text', placeholder: 'UC...', required: true },
      { name: 'pollInterval', label: 'Poll Interval (min)', type: 'number', placeholder: '15' },
      { name: 'filterKeywords', label: 'Filter Keywords', type: 'text', placeholder: 'tutorial, review' },
    ],
    defaultConfig: { channelId: '', pollInterval: 15, filterKeywords: '' },
  },
  {
    type: 'schedule-trigger',
    label: 'Schedule Trigger',
    icon: '⏰',
    color: '#9d4edd',
    category: 'Triggers',
    description: 'Triggers workflow on a schedule',
    configFields: [
      { name: 'cronExpression', label: 'Cron Expression', type: 'text', placeholder: '0 */6 * * *' },
      { name: 'timezone', label: 'Timezone', type: 'select', options: [
        { value: 'UTC', label: 'UTC' },
        { value: 'America/New_York', label: 'New York' },
        { value: 'America/Los_Angeles', label: 'Los Angeles' },
        { value: 'Europe/London', label: 'London' },
      ]},
    ],
    defaultConfig: { cronExpression: '0 */6 * * *', timezone: 'UTC' },
  },
  {
    type: 'webhook-trigger',
    label: 'Webhook Trigger',
    icon: '🔗',
    color: '#00d4ff',
    category: 'Triggers',
    description: 'Triggers workflow from external webhook',
    configFields: [
      { name: 'webhookPath', label: 'Webhook Path', type: 'text', placeholder: '/youtube-webhook' },
      { name: 'method', label: 'HTTP Method', type: 'select', options: [
        { value: 'POST', label: 'POST' },
        { value: 'GET', label: 'GET' },
      ]},
    ],
    defaultConfig: { webhookPath: '/youtube-webhook', method: 'POST' },
  },

  // YouTube Actions
  {
    type: 'get-video-details',
    label: 'Get Video Details',
    icon: '📹',
    color: '#ff0000',
    category: 'YouTube',
    description: 'Fetches detailed information about a YouTube video',
    configFields: [
      { name: 'videoId', label: 'Video ID', type: 'text', placeholder: 'dQw4w9WgXcQ or {{$node.input.videoId}}' },
      { name: 'parts', label: 'Data Parts', type: 'select', options: [
        { value: 'snippet,statistics', label: 'Snippet & Statistics' },
        { value: 'snippet,statistics,contentDetails', label: 'All Details' },
        { value: 'snippet', label: 'Snippet Only' },
      ]},
    ],
    defaultConfig: { videoId: '', parts: 'snippet,statistics' },
  },
  {
    type: 'get-channel-videos',
    label: 'Get Channel Videos',
    icon: '📺',
    color: '#ff0000',
    category: 'YouTube',
    description: 'Fetches recent videos from a YouTube channel',
    configFields: [
      { name: 'channelId', label: 'Channel ID', type: 'text', placeholder: 'UC...' },
      { name: 'maxResults', label: 'Max Results', type: 'number', placeholder: '10' },
      { name: 'order', label: 'Order By', type: 'select', options: [
        { value: 'date', label: 'Date (Newest)' },
        { value: 'viewCount', label: 'View Count' },
        { value: 'rating', label: 'Rating' },
      ]},
    ],
    defaultConfig: { channelId: '', maxResults: 10, order: 'date' },
  },
  {
    type: 'search-videos',
    label: 'Search Videos',
    icon: '🔍',
    color: '#ff0000',
    category: 'YouTube',
    description: 'Search for videos on YouTube',
    configFields: [
      { name: 'query', label: 'Search Query', type: 'text', placeholder: 'AI tutorials' },
      { name: 'maxResults', label: 'Max Results', type: 'number', placeholder: '25' },
      { name: 'publishedAfter', label: 'Published After', type: 'text', placeholder: '2024-01-01' },
      { name: 'order', label: 'Order By', type: 'select', options: [
        { value: 'relevance', label: 'Relevance' },
        { value: 'date', label: 'Date' },
        { value: 'viewCount', label: 'View Count' },
      ]},
    ],
    defaultConfig: { query: '', maxResults: 25, publishedAfter: '', order: 'relevance' },
  },
  {
    type: 'download-transcript',
    label: 'Download Transcript',
    icon: '📝',
    color: '#ff0000',
    category: 'YouTube',
    description: 'Downloads video transcript/captions',
    configFields: [
      { name: 'videoId', label: 'Video ID', type: 'text', placeholder: '{{$node.input.videoId}}' },
      { name: 'language', label: 'Language', type: 'select', options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'auto', label: 'Auto-detect' },
      ]},
    ],
    defaultConfig: { videoId: '', language: 'en' },
  },
  {
    type: 'get-comments',
    label: 'Get Comments',
    icon: '💬',
    color: '#ff0000',
    category: 'YouTube',
    description: 'Fetches comments from a YouTube video',
    configFields: [
      { name: 'videoId', label: 'Video ID', type: 'text', placeholder: '{{$node.input.videoId}}' },
      { name: 'maxResults', label: 'Max Comments', type: 'number', placeholder: '100' },
      { name: 'order', label: 'Order By', type: 'select', options: [
        { value: 'relevance', label: 'Relevance' },
        { value: 'time', label: 'Time (Newest)' },
      ]},
    ],
    defaultConfig: { videoId: '', maxResults: 100, order: 'relevance' },
  },

  // AI Processing
  {
    type: 'ai-summarize',
    label: 'AI Summarize',
    icon: '🤖',
    color: '#00ff9d',
    category: 'AI Processing',
    description: 'Summarizes content using AI',
    configFields: [
      { name: 'inputField', label: 'Input Field', type: 'text', placeholder: '{{$node.input.transcript}}' },
      { name: 'model', label: 'AI Model', type: 'select', options: [
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        { value: 'claude-3', label: 'Claude 3' },
      ]},
      { name: 'summaryLength', label: 'Summary Length', type: 'select', options: [
        { value: 'brief', label: 'Brief (1-2 sentences)' },
        { value: 'medium', label: 'Medium (1 paragraph)' },
        { value: 'detailed', label: 'Detailed (multiple paragraphs)' },
      ]},
      { name: 'customPrompt', label: 'Custom Prompt', type: 'textarea', placeholder: 'Additional instructions...' },
    ],
    defaultConfig: { inputField: '', model: 'gpt-4', summaryLength: 'medium', customPrompt: '' },
  },
  {
    type: 'ai-extract-topics',
    label: 'Extract Topics',
    icon: '🏷️',
    color: '#00ff9d',
    category: 'AI Processing',
    description: 'Extracts main topics and keywords using AI',
    configFields: [
      { name: 'inputField', label: 'Input Field', type: 'text', placeholder: '{{$node.input.transcript}}' },
      { name: 'maxTopics', label: 'Max Topics', type: 'number', placeholder: '10' },
      { name: 'includeTimestamps', label: 'Include Timestamps', type: 'boolean' },
    ],
    defaultConfig: { inputField: '', maxTopics: 10, includeTimestamps: true },
  },
  {
    type: 'sentiment-analysis',
    label: 'Sentiment Analysis',
    icon: '😊',
    color: '#00ff9d',
    category: 'AI Processing',
    description: 'Analyzes sentiment of text content',
    configFields: [
      { name: 'inputField', label: 'Input Field', type: 'text', placeholder: '{{$node.input.comments}}' },
      { name: 'granularity', label: 'Granularity', type: 'select', options: [
        { value: 'overall', label: 'Overall Score' },
        { value: 'per-item', label: 'Per Item' },
      ]},
    ],
    defaultConfig: { inputField: '', granularity: 'per-item' },
  },
  {
    type: 'generate-content',
    label: 'Generate Content',
    icon: '✍️',
    color: '#00ff9d',
    category: 'AI Processing',
    description: 'Generates content based on video data',
    configFields: [
      { name: 'contentType', label: 'Content Type', type: 'select', options: [
        { value: 'blog-post', label: 'Blog Post' },
        { value: 'social-post', label: 'Social Media Post' },
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'script', label: 'Video Script' },
      ]},
      { name: 'inputContext', label: 'Input Context', type: 'text', placeholder: '{{$node.input}}' },
      { name: 'tone', label: 'Tone', type: 'select', options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'humorous', label: 'Humorous' },
      ]},
      { name: 'additionalInstructions', label: 'Additional Instructions', type: 'textarea' },
    ],
    defaultConfig: { contentType: 'blog-post', inputContext: '', tone: 'professional', additionalInstructions: '' },
  },

  // Data Processing
  {
    type: 'filter',
    label: 'Filter',
    icon: '🔀',
    color: '#ffc300',
    category: 'Data Processing',
    description: 'Filters data based on conditions',
    configFields: [
      { name: 'field', label: 'Field to Check', type: 'text', placeholder: 'viewCount' },
      { name: 'operator', label: 'Operator', type: 'select', options: [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Not Equals' },
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'lessThan', label: 'Less Than' },
        { value: 'contains', label: 'Contains' },
      ]},
      { name: 'value', label: 'Value', type: 'text', placeholder: '1000' },
    ],
    defaultConfig: { field: '', operator: 'greaterThan', value: '' },
  },
  {
    type: 'transform',
    label: 'Transform Data',
    icon: '⚙️',
    color: '#ffc300',
    category: 'Data Processing',
    description: 'Transforms and maps data fields',
    configFields: [
      { name: 'mapping', label: 'Field Mapping (JSON)', type: 'json', placeholder: '{"title": "{{title}}", "views": "{{statistics.viewCount}}"}' },
      { name: 'keepOriginal', label: 'Keep Original Fields', type: 'boolean' },
    ],
    defaultConfig: { mapping: '{}', keepOriginal: false },
  },
  {
    type: 'merge',
    label: 'Merge Data',
    icon: '🔗',
    color: '#ffc300',
    category: 'Data Processing',
    description: 'Merges data from multiple sources',
    configFields: [
      { name: 'mode', label: 'Merge Mode', type: 'select', options: [
        { value: 'append', label: 'Append' },
        { value: 'combine', label: 'Combine by Key' },
        { value: 'keepMatched', label: 'Keep Matched' },
      ]},
      { name: 'mergeKey', label: 'Merge Key', type: 'text', placeholder: 'videoId' },
    ],
    defaultConfig: { mode: 'append', mergeKey: '' },
  },
  {
    type: 'split',
    label: 'Split Items',
    icon: '✂️',
    color: '#ffc300',
    category: 'Data Processing',
    description: 'Splits array into individual items',
    configFields: [
      { name: 'fieldToSplit', label: 'Field to Split', type: 'text', placeholder: 'items' },
    ],
    defaultConfig: { fieldToSplit: 'items' },
  },

  // Output Actions
  {
    type: 'send-email',
    label: 'Send Email',
    icon: '📧',
    color: '#ff6b35',
    category: 'Output',
    description: 'Sends an email with the data',
    configFields: [
      { name: 'to', label: 'To', type: 'text', placeholder: 'email@example.com' },
      { name: 'subject', label: 'Subject', type: 'text', placeholder: 'New Video Alert: {{title}}' },
      { name: 'body', label: 'Email Body', type: 'textarea', placeholder: 'Email content with {{variables}}' },
    ],
    defaultConfig: { to: '', subject: '', body: '' },
  },
  {
    type: 'post-slack',
    label: 'Post to Slack',
    icon: '💬',
    color: '#ff6b35',
    category: 'Output',
    description: 'Posts a message to Slack',
    configFields: [
      { name: 'channel', label: 'Channel', type: 'text', placeholder: '#youtube-updates' },
      { name: 'message', label: 'Message', type: 'textarea', placeholder: 'New video: {{title}}' },
      { name: 'includeAttachment', label: 'Include Rich Attachment', type: 'boolean' },
    ],
    defaultConfig: { channel: '', message: '', includeAttachment: true },
  },
  {
    type: 'save-database',
    label: 'Save to Database',
    icon: '💾',
    color: '#ff6b35',
    category: 'Output',
    description: 'Saves data to a database',
    configFields: [
      { name: 'table', label: 'Table/Collection', type: 'text', placeholder: 'videos' },
      { name: 'operation', label: 'Operation', type: 'select', options: [
        { value: 'insert', label: 'Insert' },
        { value: 'upsert', label: 'Upsert' },
        { value: 'update', label: 'Update' },
      ]},
      { name: 'upsertKey', label: 'Upsert Key', type: 'text', placeholder: 'videoId' },
    ],
    defaultConfig: { table: '', operation: 'upsert', upsertKey: 'videoId' },
  },
  {
    type: 'post-twitter',
    label: 'Post to Twitter/X',
    icon: '🐦',
    color: '#ff6b35',
    category: 'Output',
    description: 'Posts a tweet',
    configFields: [
      { name: 'text', label: 'Tweet Text', type: 'textarea', placeholder: '🎬 New video: {{title}}' },
      { name: 'includeLink', label: 'Include Video Link', type: 'boolean' },
    ],
    defaultConfig: { text: '', includeLink: true },
  },
  {
    type: 'create-notion',
    label: 'Create Notion Page',
    icon: '📓',
    color: '#ff6b35',
    category: 'Output',
    description: 'Creates a page in Notion',
    configFields: [
      { name: 'databaseId', label: 'Database ID', type: 'text', placeholder: 'xxx-xxx-xxx' },
      { name: 'title', label: 'Page Title', type: 'text', placeholder: '{{title}}' },
      { name: 'properties', label: 'Properties (JSON)', type: 'json', placeholder: '{"Status": "New", "URL": "{{url}}"}' },
    ],
    defaultConfig: { databaseId: '', title: '', properties: '{}' },
  },
  {
    type: 'http-request',
    label: 'HTTP Request',
    icon: '🌐',
    color: '#ff6b35',
    category: 'Output',
    description: 'Makes an HTTP request',
    configFields: [
      { name: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/webhook' },
      { name: 'method', label: 'Method', type: 'select', options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ]},
      { name: 'headers', label: 'Headers (JSON)', type: 'json', placeholder: '{"Authorization": "Bearer xxx"}' },
      { name: 'body', label: 'Body (JSON)', type: 'json', placeholder: '{{$node.input}}' },
    ],
    defaultConfig: { url: '', method: 'POST', headers: '{}', body: '{}' },
  },
];

export const nodeCategories = Array.from(new Set(nodeTypes.map((n) => n.category)));

export const getNodeTypeConfig = (type: string): NodeTypeConfig | undefined => {
  return nodeTypes.find((n) => n.type === type);
};
