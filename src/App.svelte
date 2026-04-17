<script lang="ts">
  import BlueprintList from './lib/BlueprintList.svelte'
  import FieldEditor from './lib/FieldEditor.svelte'
  import FieldPalette from './lib/FieldPalette.svelte'
  import LivePreview from './lib/LivePreview.svelte'
  import { clonePreset, fieldLibrary, presetSummaries } from './lib/data/presets'
  import type {
    BlueprintStats,
    FieldType,
    FormBlueprint,
    FormField,
    FormSection,
    PreviewMode,
    PresetKey,
  } from './lib/types'

  type FieldLocation = {
    section: FormSection
    sectionIndex: number
    field: FormField
    fieldIndex: number
  }

  const fieldSeedMap: Record<
    FieldType,
    { label: string; placeholder: string; helper: string; options: string[] }
  > = {
    text: {
      label: 'Text field',
      placeholder: 'Type a short answer',
      helper: 'Use for names, handles, or compact prompts.',
      options: [],
    },
    email: {
      label: 'Email field',
      placeholder: 'hello@brand.com',
      helper: 'Great for confirmations and reply routing.',
      options: [],
    },
    textarea: {
      label: 'Long answer',
      placeholder: 'Give a little more context',
      helper: 'Best when the preview should surface richer context.',
      options: [],
    },
    select: {
      label: 'Dropdown',
      placeholder: '',
      helper: 'Ideal when choices should stay compact.',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
    radio: {
      label: 'Radio group',
      placeholder: '',
      helper: 'Visible choices make fast decisions easier.',
      options: ['Option 1', 'Option 2'],
    },
    checkbox: {
      label: 'Consent',
      placeholder: '',
      helper: 'Perfect for explicit opt-ins or acknowledgements.',
      options: ['I agree to receive updates'],
    },
    date: {
      label: 'Date',
      placeholder: '',
      helper: 'Useful for launch windows and kickoff timing.',
      options: [],
    },
  }

  function createId(prefix: string) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
  }

  function getFirstFieldId(sections: FormSection[]) {
    for (const section of sections) {
      if (section.fields.length > 0) {
        return section.fields[0].id
      }
    }

    return null
  }

  function countFields(sections: FormSection[]) {
    return sections.reduce((total, section) => total + section.fields.length, 0)
  }

  function findFieldLocation(sections: FormSection[], fieldId: string | null): FieldLocation | null {
    if (!fieldId) {
      return null
    }

    for (const [sectionIndex, section] of sections.entries()) {
      const fieldIndex = section.fields.findIndex((field) => field.id === fieldId)

      if (fieldIndex !== -1) {
        return {
          section,
          sectionIndex,
          field: section.fields[fieldIndex],
          fieldIndex,
        }
      }
    }

    return null
  }

  function computeStats(sections: FormSection[]): BlueprintStats {
    const totalFields = countFields(sections)
    const requiredFields = sections.reduce(
      (total, section) => total + section.fields.filter((field) => field.required).length,
      0,
    )
    const choiceFields = sections.reduce(
      (total, section) =>
        total +
        section.fields.filter(
          (field) => field.type === 'select' || field.type === 'radio' || field.type === 'checkbox',
        ).length,
      0,
    )

    return {
      totalFields,
      requiredFields,
      choiceFields,
      sectionCount: sections.length,
      completionEstimate: Math.min(98, 34 + totalFields * 8 + requiredFields * 5 + choiceFields * 3),
    }
  }

  function createField(type: FieldType, seed: number): FormField {
    const shape = fieldSeedMap[type]

    return {
      id: createId('field'),
      type,
      label: seed > 1 ? `${shape.label} ${seed}` : shape.label,
      placeholder: shape.placeholder,
      helper: shape.helper,
      required: false,
      width: type === 'textarea' ? 'full' : 'half',
      options: [...shape.options],
    }
  }

  function createSection(seed: number): FormSection {
    return {
      id: createId('section'),
      title: `Section ${seed}`,
      description: 'Use this group for a clean cluster of related prompts.',
      fields: [createField('text', seed)],
    }
  }

  function duplicateFieldShape(field: FormField): FormField {
    return {
      ...field,
      id: createId('field'),
      label: field.label.includes('Copy') ? field.label : `${field.label} Copy`,
      options: [...field.options],
    }
  }

  function duplicateSectionShape(section: FormSection): FormSection {
    return {
      ...section,
      id: createId('section'),
      title: section.title.includes('Copy') ? section.title : `${section.title} Copy`,
      fields: section.fields.map((field) => duplicateFieldShape(field)),
    }
  }

  const initialBlueprint = clonePreset('waitlist')

  let presetKey = $state<PresetKey>('waitlist')
  let blueprint = $state<FormBlueprint>(initialBlueprint)
  let previewMode = $state<PreviewMode>('mobile')
  let fieldCounter = $state(countFields(initialBlueprint.sections) + 1)
  let sectionCounter = $state(initialBlueprint.sections.length + 1)
  let selectedFieldId = $state<string | null>(getFirstFieldId(initialBlueprint.sections))

  let selectedLocation = $derived(findFieldLocation(blueprint.sections, selectedFieldId))
  let selectedField = $derived(selectedLocation?.field ?? null)
  let activeSection = $derived(selectedLocation?.section ?? blueprint.sections[0] ?? null)
  let stats = $derived(computeStats(blueprint.sections))
  let currentPreset = $derived(presetSummaries.find((preset) => preset.key === presetKey) ?? null)
  let selectedPath = $derived(
    selectedField && activeSection ? `${activeSection.title} / ${selectedField.label}` : null,
  )
  let summaryCards = $derived([
    {
      label: 'Blueprint scale',
      value: `${stats.totalFields} fields`,
      note: `${stats.sectionCount} sections live in one schema`,
    },
    {
      label: 'Critical prompts',
      value: `${stats.requiredFields} required`,
      note: 'The preview marks them immediately',
    },
    {
      label: 'Choice density',
      value: `${stats.choiceFields} structured`,
      note: 'Select, radio, and consent inputs',
    },
    {
      label: 'Preview confidence',
      value: `${stats.completionEstimate}%`,
      note: 'Confirmation state adapts from the same model',
    },
  ])

  function syncSelection(preferredSectionId?: string) {
    const preferredSection = preferredSectionId
      ? blueprint.sections.find((section) => section.id === preferredSectionId)
      : undefined

    if (preferredSection && preferredSection.fields.length > 0) {
      selectedFieldId = preferredSection.fields[0].id
      return
    }

    selectedFieldId = getFirstFieldId(blueprint.sections)
  }

  function applyPreset(key: PresetKey) {
    presetKey = key
    blueprint = clonePreset(key)
    fieldCounter = countFields(blueprint.sections) + 1
    sectionCounter = blueprint.sections.length + 1
    selectedFieldId = getFirstFieldId(blueprint.sections)
  }

  function addField(type: FieldType, sectionId?: string) {
    const targetSection =
      (sectionId ? blueprint.sections.find((section) => section.id === sectionId) : undefined) ??
      activeSection ??
      blueprint.sections[0]

    if (!targetSection) {
      return
    }

    const field = createField(type, fieldCounter)
    fieldCounter += 1
    targetSection.fields.push(field)
    selectedFieldId = field.id
  }

  function addSection() {
    const section = createSection(sectionCounter)
    sectionCounter += 1
    fieldCounter += section.fields.length
    blueprint.sections.push(section)
    selectedFieldId = section.fields[0]?.id ?? null
  }

  function updateSection(sectionId: string, patch: { title?: string; description?: string }) {
    const section = blueprint.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      return
    }

    if (patch.title !== undefined) {
      section.title = patch.title
    }

    if (patch.description !== undefined) {
      section.description = patch.description
    }
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    const index = blueprint.sections.findIndex((section) => section.id === sectionId)
    const targetIndex = index + direction

    if (index === -1 || targetIndex < 0 || targetIndex >= blueprint.sections.length) {
      return
    }

    ;[blueprint.sections[index], blueprint.sections[targetIndex]] = [
      blueprint.sections[targetIndex],
      blueprint.sections[index],
    ]
  }

  function duplicateSection(sectionId: string) {
    const index = blueprint.sections.findIndex((section) => section.id === sectionId)

    if (index === -1) {
      return
    }

    const section = duplicateSectionShape(blueprint.sections[index])
    blueprint.sections.splice(index + 1, 0, section)
    fieldCounter += section.fields.length
    sectionCounter += 1
    selectedFieldId = section.fields[0]?.id ?? null
  }

  function removeSection(sectionId: string) {
    if (blueprint.sections.length === 1) {
      return
    }

    const index = blueprint.sections.findIndex((section) => section.id === sectionId)

    if (index === -1) {
      return
    }

    const [removed] = blueprint.sections.splice(index, 1)

    if (removed?.fields.some((field) => field.id === selectedFieldId)) {
      syncSelection()
    }
  }

  function moveField(sectionId: string, fieldId: string, direction: -1 | 1) {
    const section = blueprint.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      return
    }

    const index = section.fields.findIndex((field) => field.id === fieldId)
    const targetIndex = index + direction

    if (index === -1 || targetIndex < 0 || targetIndex >= section.fields.length) {
      return
    }

    ;[section.fields[index], section.fields[targetIndex]] = [
      section.fields[targetIndex],
      section.fields[index],
    ]
  }

  function duplicateField(sectionId: string, fieldId: string) {
    const section = blueprint.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      return
    }

    const index = section.fields.findIndex((field) => field.id === fieldId)

    if (index === -1) {
      return
    }

    const field = duplicateFieldShape(section.fields[index])
    section.fields.splice(index + 1, 0, field)
    fieldCounter += 1
    selectedFieldId = field.id
  }

  function removeField(sectionId: string, fieldId: string) {
    const section = blueprint.sections.find((entry) => entry.id === sectionId)

    if (!section) {
      return
    }

    const index = section.fields.findIndex((field) => field.id === fieldId)

    if (index === -1) {
      return
    }

    section.fields.splice(index, 1)

    if (fieldId === selectedFieldId) {
      syncSelection(sectionId)
    }
  }

  function addOptionToSelectedField() {
    if (!selectedField) {
      return
    }

    selectedField.options.push(`Option ${selectedField.options.length + 1}`)
  }

  function removeOptionFromSelectedField(index: number) {
    if (!selectedField) {
      return
    }

    selectedField.options.splice(index, 1)
  }

  function changeSelectedFieldType(type: FieldType) {
    if (!selectedField) {
      return
    }

    selectedField.type = type

    if (type === 'textarea') {
      selectedField.width = 'full'
    }

    if ((type === 'select' || type === 'radio' || type === 'checkbox') && selectedField.options.length === 0) {
      selectedField.options = [...fieldSeedMap[type].options]
    }

    if (!selectedField.placeholder && fieldSeedMap[type].placeholder) {
      selectedField.placeholder = fieldSeedMap[type].placeholder
    }

    if (!selectedField.helper && fieldSeedMap[type].helper) {
      selectedField.helper = fieldSeedMap[type].helper
    }
  }

  function duplicateSelectedField() {
    if (!selectedLocation) {
      return
    }

    duplicateField(selectedLocation.section.id, selectedLocation.field.id)
  }

  function removeSelectedField() {
    if (!selectedLocation) {
      return
    }

    removeField(selectedLocation.section.id, selectedLocation.field.id)
  }
</script>

<svelte:head>
  <title>Formline</title>
  <meta
    name="description"
    content="Formline is a schema-first Svelte form studio with a live blueprint editor, animated field reordering, and a reactive preview."
  />
</svelte:head>

<div class="min-h-screen">
  <div class="mx-auto max-w-[1720px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
    <header class="studio-panel relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
      <div class="absolute -left-16 top-0 h-44 w-44 rounded-full bg-[var(--color-form-cobalt)]/10 blur-3xl"></div>
      <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--color-form-coral)]/12 blur-3xl"></div>

      <div class="relative grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_22rem] xl:items-start">
        <div class="max-w-5xl">
          <div class="flex flex-wrap items-center gap-3">
            <span class="glass-chip">FORMLINE</span>
            <span class="rounded-full bg-[var(--color-form-cobalt-soft)] px-3 py-1 text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-form-cobalt)]">
              {blueprint.badge}
            </span>
          </div>

          <h1 class="mt-5 max-w-5xl font-[var(--font-display)] text-[2.85rem] leading-[0.93] tracking-tight text-[var(--color-form-ink)] sm:text-[3.5rem] xl:text-[4.7rem]">
            A calmer form studio where the UI feels usable before it feels clever.
          </h1>

          <p class="mt-5 max-w-3xl text-[0.98rem] leading-8 text-slate-600">
            The whole screen now revolves around one clearer rhythm: a relaxed top summary, a wide dock for presets and inserts, a spacious blueprint canvas, and a cleaner side studio for preview plus editing.
          </p>

          <div class="mt-5 flex flex-wrap gap-2.5">
            <span class="rounded-full bg-white/72 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/70">
              One schema drives every panel
            </span>
            <span class="rounded-full bg-white/72 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/70">
              Reordering stays animated
            </span>
            <span class="rounded-full bg-white/72 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/70">
              Preview updates while you type
            </span>
          </div>
        </div>

        <div class="studio-paper p-4 sm:p-5">
          <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Studio focus</p>
          <div class="mt-4 grid gap-3">
            <div class="studio-muted p-4">
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Current preset</p>
              <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">
                {currentPreset?.name ?? 'Preset'}
              </p>
              <p class="mt-1 text-sm leading-6 text-slate-600">
                {currentPreset?.description}
              </p>
            </div>

            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div class="studio-muted p-4">
                <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Selected field</p>
                <p class="mt-2 break-words text-base font-semibold text-[var(--color-form-ink)]">
                  {selectedPath ?? 'Choose a card on the blueprint'}
                </p>
              </div>
              <div class="studio-muted p-4">
                <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Preview mode</p>
                <p class="mt-2 text-base font-semibold text-[var(--color-form-ink)]">{previewMode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {#each summaryCards as card}
          <div class="studio-paper px-4 py-4">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">{card.label}</p>
            <p class="mt-2 text-[1.75rem] font-semibold tracking-tight text-[var(--color-form-ink)]">
              {card.value}
            </p>
            <p class="mt-2 text-sm leading-6 text-slate-600">{card.note}</p>
          </div>
        {/each}
      </div>
    </header>

    <section class="mt-6">
      <FieldPalette
        presetKey={presetKey}
        presets={presetSummaries}
        fieldLibrary={fieldLibrary}
        stats={stats}
        activeSectionTitle={activeSection?.title ?? 'First section'}
        selectedFieldLabel={selectedPath}
        onApplyPreset={applyPreset}
        onAddField={addField}
        onAddSection={addSection}
      />
    </section>

    <section class="mt-6 grid items-start gap-6 xl:grid-cols-2">
      <div class="min-w-0">
        <LivePreview
          {blueprint}
          {stats}
          {previewMode}
          {selectedFieldId}
          onSetPreviewMode={(mode) => (previewMode = mode)}
          onSelectField={(fieldId) => (selectedFieldId = fieldId)}
        />
      </div>

      <div class="min-w-0">
        <FieldEditor
          field={selectedField}
          sectionTitle={activeSection?.title ?? 'Section'}
          onChangeType={changeSelectedFieldType}
          onAddOption={addOptionToSelectedField}
          onRemoveOption={removeOptionFromSelectedField}
          onDuplicateField={duplicateSelectedField}
          onRemoveField={removeSelectedField}
        />
      </div>
    </section>

    <main class="mt-6">
      <BlueprintList
        sections={blueprint.sections}
        selectedFieldId={selectedFieldId}
        onSelectField={(fieldId) => (selectedFieldId = fieldId)}
        onUpdateSection={updateSection}
        onMoveSection={moveSection}
        onDuplicateSection={duplicateSection}
        onRemoveSection={removeSection}
        onMoveField={moveField}
        onDuplicateField={duplicateField}
        onRemoveField={removeField}
        onAddField={addField}
      />
    </main>
  </div>
</div>
