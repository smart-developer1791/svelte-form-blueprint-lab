<script lang="ts">
  import type { FieldType, FieldWidth, FormField } from './types'

  type Props = {
    field: FormField | null
    sectionTitle: string
    onChangeType: (type: FieldType) => void
    onAddOption: () => void
    onRemoveOption: (index: number) => void
    onDuplicateField: () => void
    onRemoveField: () => void
  }

  let {
    field = $bindable(),
    sectionTitle,
    onChangeType,
    onAddOption,
    onRemoveOption,
    onDuplicateField,
    onRemoveField,
  }: Props = $props()

  const typeOptions: { value: FieldType; label: string }[] = [
    { value: 'text', label: 'Text input' },
    { value: 'email', label: 'Email input' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select menu' },
    { value: 'radio', label: 'Radio group' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date picker' },
  ]

  const widthOptions: { value: FieldWidth; label: string }[] = [
    { value: 'half', label: 'Half width' },
    { value: 'full', label: 'Full width' },
  ]

  function isChoiceField(type: FieldType) {
    return type === 'select' || type === 'radio' || type === 'checkbox'
  }
</script>

<section class="studio-panel p-5 sm:p-6">
  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div class="max-w-xl">
      <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Editor</p>
      <h2 class="mt-2 font-[var(--font-display)] text-[1.95rem] leading-none text-[var(--color-form-ink)]">
        Tune the selected card
      </h2>
      <p class="mt-3 text-sm leading-7 text-slate-600">
        The editor should feel calm and direct: change copy, width, options, and required state without squeezing everything into tiny boxes.
      </p>
    </div>

    <span class="rounded-full bg-white/76 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/80">
      Bound to selection
    </span>
  </div>

  {#if field}
      <div class="mt-6 space-y-5">
        <div class="min-h-[11.75rem] rounded-[30px] border border-white/80 bg-[linear-gradient(155deg,rgba(219,229,255,0.62),rgba(255,255,255,0.98),rgba(255,250,243,0.98))] p-5 shadow-[0_24px_58px_-42px_rgba(26,33,55,0.36)]">
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-white/82 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {sectionTitle}
            </span>
            <span class="rounded-full bg-white/82 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {field.type}
            </span>
          </div>
          <h3 class="mt-4 text-[1.5rem] font-semibold tracking-tight text-[var(--color-form-ink)]">
            {field.label}
          </h3>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            {field.helper || 'This card does not have helper copy yet. Add a clearer note to make the preview feel more intentional.'}
          </p>
        </div>

        <div class="studio-paper p-5">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Basics</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">Name the field, choose its type, and set the overall layout footprint.</p>
            </div>
          </div>

          <div class="mt-4 grid gap-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block">
                <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Label</span>
                <input
                  class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                  bind:value={field.label}
                />
              </label>

              <label class="block">
                <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Type</span>
                <select
                  class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                  value={field.type}
                  onchange={(event) => onChangeType((event.currentTarget as HTMLSelectElement).value as FieldType)}
                >
                  {#each typeOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </label>
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <label class="block">
                <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Placeholder</span>
                <input
                  class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                  bind:value={field.placeholder}
                />
              </label>

              <label class="block">
                <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Layout width</span>
                <select
                  class="mt-2 w-full rounded-[20px] border border-[#e7dccc] bg-white px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                  bind:value={field.width}
                >
                  {#each widthOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div class="studio-paper p-5">
          <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Helper copy</p>
          <p class="mt-1 text-sm leading-6 text-slate-600">
            Give the card a friendlier explanation so the preview feels designed, not generic.
          </p>
          <textarea
            class="mt-4 min-h-[8rem] w-full rounded-[22px] border border-[#e7dccc] bg-white px-4 py-3 text-sm leading-7 text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
            bind:value={field.helper}
          ></textarea>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="studio-muted flex min-h-[10rem] flex-col justify-between p-4">
            <div>
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Required state</p>
              <p class="mt-2 text-sm leading-7 text-slate-600">
                Toggle whether this field should immediately read as required inside the preview.
              </p>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <input
                class="h-4 w-4 rounded border-slate-300 text-[var(--color-form-cobalt)]"
                type="checkbox"
                bind:checked={field.required}
              />
              <span class="text-sm font-medium text-[var(--color-form-ink)]">Mark this response as required</span>
            </div>
          </label>

          <div class="studio-muted min-h-[10rem] p-4">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Live behavior</p>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              Change the field type, placeholder, or helper text here and the preview recomputes from the same blueprint immediately.
            </p>
          </div>
        </div>

        <div class="studio-paper min-h-[15.25rem] p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Options</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">
                {#if isChoiceField(field.type)}
                  {field.type === 'checkbox'
                    ? 'Use the first option as the consent line shown in preview.'
                    : 'Keep options short and readable so the preview stays elegant.'}
                {:else}
                  This area stays reserved so the editor does not jump when you switch between simple fields and choice-based ones.
                {/if}
              </p>
            </div>
            <button
              type="button"
              class="rounded-[16px] border border-[#e3d8cb] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              onclick={onAddOption}
              disabled={!isChoiceField(field.type)}
            >
              Add option
            </button>
          </div>

          <div class="mt-4 space-y-3">
            {#if isChoiceField(field.type)}
              {#if field.options.length > 0}
                {#each field.options as option, optionIndex (`${field.id}-${optionIndex}`)}
                  <div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <input
                      class="w-full rounded-[18px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-4 py-3 text-sm text-[var(--color-form-ink)] shadow-sm transition focus:border-[var(--color-form-cobalt)]"
                      bind:value={field.options[optionIndex]}
                    />
                    <button
                      type="button"
                      class="rounded-[18px] border border-[#f1c9b2] bg-[#fff3ea] px-4 py-3 text-sm font-medium text-[#c06b40] transition hover:border-[#e7b18f] hover:bg-[#ffe8da] sm:shrink-0"
                      onclick={() => onRemoveOption(optionIndex)}
                    >
                      Remove
                    </button>
                  </div>
                {/each}
              {:else}
                <div class="rounded-[20px] border border-dashed border-[#d9cbbc] bg-[var(--color-form-paper)] px-4 py-4 text-sm leading-6 text-slate-600">
                  No options yet. Add the first item and the preview will render it immediately.
                </div>
              {/if}
            {:else}
              <div class="rounded-[20px] border border-dashed border-[#d9cbbc] bg-[var(--color-form-paper)] px-4 py-4 text-sm leading-7 text-slate-600">
                Switch this field to <strong>Select</strong>, <strong>Radio</strong>, or <strong>Checkbox</strong> if you want to edit an option list here.
              </div>
            {/if}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="rounded-[20px] border border-[#e3d8cb] bg-white px-4 py-3 text-sm font-medium text-[var(--color-form-ink)] transition hover:border-slate-300 hover:bg-slate-50"
            onclick={onDuplicateField}
          >
            Duplicate card
          </button>
          <button
            type="button"
            class="rounded-[20px] border border-[#f1c9b2] bg-[#fff3ea] px-4 py-3 text-sm font-medium text-[#c06b40] transition hover:border-[#e7b18f] hover:bg-[#ffe8da]"
            onclick={onRemoveField}
          >
            Remove card
          </button>
        </div>
      </div>
  {:else}
    <div class="mt-6 rounded-[28px] border border-dashed border-[#d9cbbc] bg-[var(--color-form-paper)] p-5 text-sm leading-7 text-slate-600">
      Choose a field card on the blueprint and the editor will open its copy, structure, and option controls here.
    </div>
  {/if}
</section>
