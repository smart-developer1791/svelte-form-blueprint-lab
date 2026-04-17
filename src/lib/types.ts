export type FieldType = 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date'

export type FieldWidth = 'full' | 'half'

export type PreviewMode = 'desktop' | 'mobile' | 'confirmation'

export type PresetKey = 'waitlist' | 'contact' | 'early-access'

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder: string
  helper: string
  required: boolean
  width: FieldWidth
  options: string[]
}

export interface FormSection {
  id: string
  title: string
  description: string
  fields: FormField[]
}

export interface FormBlueprint {
  title: string
  subtitle: string
  badge: string
  submitLabel: string
  sections: FormSection[]
}

export interface PresetSummary {
  key: PresetKey
  name: string
  description: string
  accent: string
}

export interface FieldLibraryItem {
  type: FieldType
  label: string
  hint: string
  glyph: string
}

export interface BlueprintStats {
  totalFields: number
  requiredFields: number
  choiceFields: number
  sectionCount: number
  completionEstimate: number
}
