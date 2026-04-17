import type { FieldLibraryItem, FormBlueprint, PresetSummary, PreviewMode } from '../types'

export const presetSummaries: PresetSummary[] = [
  {
    key: 'waitlist',
    name: 'Orbit waitlist',
    description: 'Lean launch intake tuned for early-access signups and rollout notes.',
    accent: 'Launch',
  },
  {
    key: 'contact',
    name: 'Studio contact',
    description: 'A warmer client intake flow with project scope and preferred kickoff timing.',
    accent: 'Client',
  },
  {
    key: 'early-access',
    name: 'Beta rollout',
    description: 'A sharper internal pilot form for team setup, access shape, and feedback loops.',
    accent: 'Pilot',
  },
]

export const fieldLibrary: FieldLibraryItem[] = [
  { type: 'text', label: 'Text', hint: 'Names, handles, short answers', glyph: 'Aa' },
  { type: 'email', label: 'Email', hint: 'Inbox and contact routing', glyph: '@' },
  { type: 'textarea', label: 'Textarea', hint: 'Longer intent or project notes', glyph: '¶' },
  { type: 'select', label: 'Select', hint: 'Controlled choices in a dropdown', glyph: 'v' },
  { type: 'radio', label: 'Radio', hint: 'Single pick with visible options', glyph: 'o' },
  { type: 'checkbox', label: 'Checkbox', hint: 'Consent, updates, confirmations', glyph: '+' },
  { type: 'date', label: 'Date', hint: 'Launch windows and kickoff timing', glyph: '31' },
]

export const previewModeOptions: { key: PreviewMode; label: string }[] = [
  { key: 'mobile', label: 'Mobile' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'confirmation', label: 'Confirm' },
]

const basePresets: Record<PresetSummary['key'], FormBlueprint> = {
  waitlist: {
    title: 'Orbit waitlist',
    subtitle:
      'A studio-style early access form where product signals, launch intent, and onboarding fit all stay inside one tidy blueprint.',
    badge: 'Early access intake',
    submitLabel: 'Join waitlist',
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        description: 'Who is requesting access and where should the invite land?',
        fields: [
          {
            id: 'full-name',
            type: 'text',
            label: 'Full name',
            placeholder: 'Ada Lovelace',
            helper: 'Used in invite records and launch notes.',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'work-email',
            type: 'email',
            label: 'Work email',
            placeholder: 'team@orbital.io',
            helper: 'Primary address for access and release updates.',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'team-name',
            type: 'text',
            label: 'Team or studio',
            placeholder: 'Northline Collective',
            helper: 'Helps segment approvals and launch follow-up.',
            required: false,
            width: 'full',
            options: [],
          },
        ],
      },
      {
        id: 'rollout-profile',
        title: 'Rollout profile',
        description: 'A few cues that shape onboarding, triage, and the preview copy.',
        fields: [
          {
            id: 'launch-intent',
            type: 'textarea',
            label: 'What are you hoping to launch?',
            placeholder: 'Tell us what this rollout unlocks.',
            helper: 'Short answers are enough for early review.',
            required: true,
            width: 'full',
            options: [],
          },
          {
            id: 'team-size',
            type: 'select',
            label: 'Team size',
            placeholder: '',
            helper: 'Lets onboarding switch between self-serve and guided tracks.',
            required: false,
            width: 'half',
            options: ['Solo', '2-5', '6-15', '16+'],
          },
          {
            id: 'milestone-updates',
            type: 'checkbox',
            label: 'Product updates',
            placeholder: '',
            helper: 'Keep milestone notes and release emails in one opt-in field.',
            required: false,
            width: 'half',
            options: ['Keep me looped into milestone updates'],
          },
        ],
      },
    ],
  },
  contact: {
    title: 'Studio contact',
    subtitle:
      'A softer editorial contact form for client inquiries, project fit, and the timeline cues that matter before kickoff.',
    badge: 'Client intake',
    submitLabel: 'Send inquiry',
    sections: [
      {
        id: 'contact-basics',
        title: 'Contact basics',
        description: 'Keep the essentials tight and easy to scan.',
        fields: [
          {
            id: 'client-name',
            type: 'text',
            label: 'Name',
            placeholder: 'Morgan Lee',
            helper: 'Who should the reply be addressed to?',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'client-email',
            type: 'email',
            label: 'Email',
            placeholder: 'hello@studio.co',
            helper: 'Where should the project reply land?',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'brand-name',
            type: 'text',
            label: 'Brand or project',
            placeholder: 'North Coast Archive',
            helper: 'Useful for organizing responses in the preview stack.',
            required: false,
            width: 'full',
            options: [],
          },
        ],
      },
      {
        id: 'project-fit',
        title: 'Project fit',
        description: 'Ask just enough to tell whether the project should move ahead.',
        fields: [
          {
            id: 'project-brief',
            type: 'textarea',
            label: 'Project brief',
            placeholder: 'What are you building, redesigning, or launching?',
            helper: 'A focused paragraph is perfect.',
            required: true,
            width: 'full',
            options: [],
          },
          {
            id: 'timeline',
            type: 'date',
            label: 'Ideal kickoff',
            placeholder: '',
            helper: 'Useful when the preview swaps to a confirmation view.',
            required: false,
            width: 'half',
            options: [],
          },
          {
            id: 'scope-band',
            type: 'radio',
            label: 'Project scale',
            placeholder: '',
            helper: 'Visible choice sets feel better than a buried dropdown here.',
            required: false,
            width: 'half',
            options: ['Landing page', 'Brand site', 'Full product surface'],
          },
        ],
      },
    ],
  },
  'early-access': {
    title: 'Beta rollout',
    subtitle:
      'A sharper internal pilot blueprint for selecting testers, routing access, and capturing what should happen after the invite.',
    badge: 'Internal pilot',
    submitLabel: 'Request access',
    sections: [
      {
        id: 'team-setup',
        title: 'Team setup',
        description: 'Capture access owner details and the shape of the cohort.',
        fields: [
          {
            id: 'owner-name',
            type: 'text',
            label: 'Access owner',
            placeholder: 'Sam Rivera',
            helper: 'Primary teammate responsible for the rollout.',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'owner-email',
            type: 'email',
            label: 'Owner email',
            placeholder: 'pilot@company.com',
            helper: 'Used for staged access and key notices.',
            required: true,
            width: 'half',
            options: [],
          },
          {
            id: 'cohort-shape',
            type: 'select',
            label: 'Pilot cohort',
            placeholder: '',
            helper: 'Lets the live preview shift between invite flows.',
            required: true,
            width: 'full',
            options: ['Internal only', 'Trusted beta', 'Open pilot'],
          },
        ],
      },
      {
        id: 'feedback-loop',
        title: 'Feedback loop',
        description: 'Small prompts that drive what happens after access is granted.',
        fields: [
          {
            id: 'success-signal',
            type: 'textarea',
            label: 'What success looks like',
            placeholder: 'Describe the strongest sign this pilot is working.',
            helper: 'This becomes a strong summary line in confirmation mode.',
            required: true,
            width: 'full',
            options: [],
          },
          {
            id: 'feedback-format',
            type: 'radio',
            label: 'Preferred feedback rhythm',
            placeholder: '',
            helper: 'Visible options make quick team decisions easy.',
            required: false,
            width: 'half',
            options: ['Weekly digest', 'Inline comments', 'Recorded call'],
          },
          {
            id: 'release-notes-optin',
            type: 'checkbox',
            label: 'Release notes',
            placeholder: '',
            helper: 'A single consent field keeps pilot communications explicit.',
            required: false,
            width: 'half',
            options: ['Share release notes and bugfix updates with this team'],
          },
        ],
      },
    ],
  },
}

export function clonePreset(key: PresetSummary['key']): FormBlueprint {
  return structuredClone(basePresets[key])
}
