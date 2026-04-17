<script lang="ts">
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import type { FieldType, FormField, FormSection } from './types'

  type Props = {
    sections: FormSection[]
    selectedFieldId: string | null
    onSelectField: (fieldId: string) => void
    onUpdateSection: (sectionId: string, patch: { title?: string; description?: string }) => void
    onMoveSection: (sectionId: string, direction: -1 | 1) => void
    onDuplicateSection: (sectionId: string) => void
    onRemoveSection: (sectionId: string) => void
    onMoveField: (sectionId: string, fieldId: string, direction: -1 | 1) => void
    onDuplicateField: (sectionId: string, fieldId: string) => void
    onRemoveField: (sectionId: string, fieldId: string) => void
    onAddField: (type: FieldType, sectionId?: string) => void
  }

  let {
    sections,
    selectedFieldId,
    onSelectField,
    onUpdateSection,
    onMoveSection,
    onDuplicateSection,
    onRemoveSection,
    onMoveField,
    onDuplicateField,
    onRemoveField,
    onAddField,
  }: Props = $props()

  const typeLabels: Record<FieldType, string> = {
    text: 'Text',
    email: 'Email',
    textarea: 'Textarea',
    select: 'Select',
    radio: 'Radio',
    checkbox: 'Checkbox',
    date: 'Date',
  }

  const quickTypes: FieldType[] = ['text', 'select', 'date']

  function handleKeySelection(event: KeyboardEvent, fieldId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectField(fieldId)
    }
  }

  function getFieldSummary(field: FormField) {
    if (field.type === 'select' || field.type === 'radio') {
      return `${field.options.length || 0} visible options`
    }

    if (field.type === 'checkbox') {
      return `${field.options.length || 0} checkbox options`
    }

    if (field.type === 'date') {
      return 'Captures timing and launch windows'
    }

    return field.placeholder || 'No placeholder yet'
  }
</script>

<section class="studio-panel blueprint-surface overflow-hidden p-5 sm:p-6">
  <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div class="max-w-3xl">
      <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Blueprint canvas</p>
      <h2 class="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[var(--color-form-ink)] sm:text-[2.35rem]">
        Shape the structure with room to breathe
      </h2>
      <p class="mt-3 text-[0.98rem] leading-7 text-slate-600">
        The blueprint is now the main surface instead of a squeezed middle column, so section editing, field selection, and list motion all read more clearly.
      </p>
    </div>

    <div class="studio-paper grid gap-3 p-3 sm:grid-cols-3">
      <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
        <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Sections</p>
        <p class="mt-2 text-xl font-semibold text-[var(--color-form-ink)]">{sections.length}</p>
      </div>
      <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
        <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Cards</p>
        <p class="mt-2 text-xl font-semibold text-[var(--color-form-ink)]">
          {sections.reduce((total, section) => total + section.fields.length, 0)}
        </p>
      </div>
      <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
        <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">State model</p>
        <p class="mt-2 text-xl font-semibold text-[var(--color-form-ink)]">Shared</p>
      </div>
    </div>
  </div>

  <div class="mt-6 grid gap-5 min-[1440px]:grid-cols-2">
    {#each sections as section, sectionIndex (section.id)}
      <article
        animate:flip={{ duration: 220 }}
        transition:fade={{ duration: 180 }}
        class="studio-paper p-5 sm:p-6"
      >
        <div class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="block">
              <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Section title</span>
              <input
                class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                value={section.title}
                oninput={(event) =>
                  onUpdateSection(section.id, {
                    title: (event.currentTarget as HTMLInputElement).value,
                  })}
              />
            </label>

            <label class="block">
              <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Section prompt</span>
              <input
                class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                value={section.description}
                oninput={(event) =>
                  onUpdateSection(section.id, {
                    description: (event.currentTarget as HTMLInputElement).value,
                  })}
              />
            </label>
          </div>

          <div class="flex flex-wrap gap-2 xl:justify-end">
            <button
              type="button"
              class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              onclick={() => onMoveSection(section.id, -1)}
              disabled={sectionIndex === 0}
            >
              Move up
            </button>
            <button
              type="button"
              class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              onclick={() => onMoveSection(section.id, 1)}
              disabled={sectionIndex === sections.length - 1}
            >
              Move down
            </button>
            <button
              type="button"
              class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              onclick={() => onDuplicateSection(section.id)}
            >
              Duplicate
            </button>
            <button
              type="button"
              class="rounded-[16px] border border-[#f1c9b2] bg-[#fff3ea] px-3 py-2 text-sm font-medium text-[#c06b40] transition hover:border-[#e7b18f] hover:bg-[#ffe8da]"
              onclick={() => onRemoveSection(section.id)}
              disabled={sections.length === 1}
            >
              Remove
            </button>
          </div>
        </div>

        {#if section.fields.length > 0}
          <div class="mt-5 space-y-3">
            {#each section.fields as field, fieldIndex (field.id)}
              <div
                animate:flip={{ duration: 200 }}
                transition:fade={{ duration: 160 }}
                class={`relative overflow-hidden rounded-[28px] border transition ${
                  selectedFieldId === field.id
                    ? 'border-[var(--color-form-cobalt)] bg-[linear-gradient(145deg,rgba(219,229,255,0.5),rgba(255,255,255,0.98))] shadow-[0_24px_58px_-42px_rgba(49,97,246,0.5)]'
                    : 'border-[#eadfd3] bg-white/92 hover:border-slate-300 hover:shadow-[0_24px_52px_-42px_rgba(26,33,55,0.25)]'
                }`}
                role="button"
                tabindex="0"
                aria-pressed={selectedFieldId === field.id}
                onclick={() => onSelectField(field.id)}
                onkeydown={(event) => handleKeySelection(event, field.id)}
              >
                <div
                  class={`absolute inset-x-0 top-0 h-1 ${
                    selectedFieldId === field.id
                      ? 'bg-[linear-gradient(90deg,#3161f6,#ff9866)]'
                      : 'bg-slate-100'
                  }`}
                ></div>

                <div class="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_13rem]">
                  <div class="min-w-0 space-y-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="break-words text-lg font-semibold text-[var(--color-form-ink)]">
                        {field.label}
                      </p>
                      <span class="rounded-full bg-white/90 px-2.5 py-1 text-[0.72rem] font-semibold text-slate-500">
                        {typeLabels[field.type]}
                      </span>
                      <span class="rounded-full bg-white/90 px-2.5 py-1 text-[0.72rem] font-semibold text-slate-500">
                        {field.width}
                      </span>
                      <span
                        class={`rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
                          field.required
                            ? 'bg-[#fff1e8] text-[#c06b40]'
                            : 'bg-[#f2f5fb] text-slate-500'
                        }`}
                      >
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </div>

                    <p class="break-words text-sm leading-7 text-slate-600">
                      {field.helper || 'Select this card to shape its copy, width, and behavior in the editor.'}
                    </p>

                    <div class="grid gap-2 sm:grid-cols-2">
                      <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
                        <p class="text-[0.72rem] font-semibold tracking-[0.14em] text-slate-500">Field note</p>
                        <p class="mt-2 break-words text-sm leading-6 text-[var(--color-form-ink)]">
                          {getFieldSummary(field)}
                        </p>
                      </div>
                      <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
                        <p class="text-[0.72rem] font-semibold tracking-[0.14em] text-slate-500">Editor status</p>
                        <p class="mt-2 text-sm leading-6 text-[var(--color-form-ink)]">
                          {selectedFieldId === field.id
                            ? 'This card is currently bound to the live editor.'
                            : 'Select this card to tune its settings and preview.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    <button
                      type="button"
                      class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                      onclick={(event) => {
                        event.stopPropagation()
                        onMoveField(section.id, field.id, -1)
                      }}
                      disabled={fieldIndex === 0}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                      onclick={(event) => {
                        event.stopPropagation()
                        onMoveField(section.id, field.id, 1)
                      }}
                      disabled={fieldIndex === section.fields.length - 1}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                      onclick={(event) => {
                        event.stopPropagation()
                        onDuplicateField(section.id, field.id)
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      class="rounded-[16px] border border-[#f1c9b2] bg-[#fff3ea] px-3 py-2 text-sm font-medium text-[#c06b40] transition hover:border-[#e7b18f] hover:bg-[#ffe8da]"
                      onclick={(event) => {
                        event.stopPropagation()
                        onRemoveField(section.id, field.id)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="mt-5 rounded-[24px] border border-dashed border-[#d9cbbc] bg-white/72 px-4 py-6 text-sm leading-6 text-slate-600">
            This section is empty right now. Use the quick inserts below or add a field from the dock above.
          </div>
        {/if}

        <div class="mt-5 flex flex-wrap gap-2">
          {#each quickTypes as type}
            <button
              type="button"
              class="rounded-[18px] bg-[var(--color-form-ink)]/5 px-3.5 py-2 text-sm font-medium text-[var(--color-form-ink)] transition hover:bg-[var(--color-form-cobalt-soft)] hover:text-[var(--color-form-cobalt)]"
              onclick={() => onAddField(type, section.id)}
            >
              Add {typeLabels[type]}
            </button>
          {/each}
        </div>
      </article>
    {/each}
  </div>
</section>
