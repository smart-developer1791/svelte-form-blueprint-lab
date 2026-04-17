<script lang="ts">
  import type { BlueprintStats, FieldLibraryItem, PresetKey, PresetSummary } from './types'

  type Props = {
    presetKey: PresetKey
    presets: PresetSummary[]
    fieldLibrary: FieldLibraryItem[]
    stats: BlueprintStats
    activeSectionTitle: string
    selectedFieldLabel: string | null
    onApplyPreset: (key: PresetKey) => void
    onAddField: (type: FieldLibraryItem['type']) => void
    onAddSection: () => void
  }

  let {
    presetKey,
    presets,
    fieldLibrary,
    stats,
    activeSectionTitle,
    selectedFieldLabel,
    onApplyPreset,
    onAddField,
    onAddSection,
  }: Props = $props()

  const signalCards = $derived([
    {
      label: 'Fields',
      value: `${stats.totalFields}`,
      note: `${stats.sectionCount} sections`,
    },
    {
      label: 'Required',
      value: `${stats.requiredFields}`,
      note: 'Marked live in preview',
    },
    {
      label: 'Choices',
      value: `${stats.choiceFields}`,
      note: 'Structured inputs',
    },
    {
      label: 'Confidence',
      value: `${stats.completionEstimate}%`,
      note: 'Confirmation feels ready',
    },
  ])
</script>

<section class="studio-panel overflow-hidden">
  <div class="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.18fr)_21rem]">
    <div class="space-y-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Studio dock</p>
          <h2 class="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[var(--color-form-ink)] sm:text-[2.3rem]">
            Compose without hunting for controls
          </h2>
          <p class="mt-3 text-[0.98rem] leading-7 text-slate-600">
            Presets, field inserts, and live context now live in one wider dock so the page feels easier to use and less like three competing sidebars.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-[20px] bg-[var(--color-form-ink)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(26,33,55,0.5)] transition hover:brightness-105"
          onclick={onAddSection}
        >
          New section
        </button>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        {#each presets as preset}
          <button
            type="button"
            class={`rounded-[26px] border px-4 py-4 text-left transition ${
              preset.key === presetKey
                ? 'border-[var(--color-form-cobalt)] bg-[linear-gradient(145deg,rgba(219,229,255,0.95),rgba(255,255,255,0.96))] shadow-[0_20px_44px_-30px_rgba(49,97,246,0.48)]'
                : 'border-[#e8ddd1] bg-white/88 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_22px_46px_-36px_rgba(26,33,55,0.35)]'
            }`}
            onclick={() => onApplyPreset(preset.key)}
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[0.72rem] font-semibold tracking-[0.14em] text-slate-500">{preset.accent}</p>
                <p class="mt-2 break-words text-lg font-semibold text-[var(--color-form-ink)]">
                  {preset.name}
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">{preset.description}</p>
              </div>
              <span class="rounded-full bg-white/75 px-2.5 py-1 text-[0.72rem] font-semibold text-slate-500">
                {preset.key === presetKey ? 'Live' : 'Load'}
              </span>
            </div>
          </button>
        {/each}
      </div>

      <div class="studio-muted p-4 sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Insert fields</p>
            <h3 class="mt-2 text-[1.35rem] font-semibold tracking-tight text-[var(--color-form-ink)]">
              Drop new cards into the active section
            </h3>
          </div>

          <div class="rounded-full bg-white/76 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-white/80">
            Adding to {activeSectionTitle}
          </div>
        </div>

        <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {#each fieldLibrary as item}
            <button
              type="button"
              class="rounded-[24px] border border-[#eadfd3] bg-white/92 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_40px_-34px_rgba(26,33,55,0.36)]"
              onclick={() => onAddField(item.type)}
            >
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,rgba(219,229,255,0.92),rgba(255,255,255,0.96))] text-base font-bold text-[var(--color-form-cobalt)] shadow-sm">
                {item.glyph}
              </span>
              <p class="mt-4 text-base font-semibold text-[var(--color-form-ink)]">{item.label}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">{item.hint}</p>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <aside class="grid content-start gap-4">
      <div class="rounded-[30px] border border-white/80 bg-[linear-gradient(155deg,rgba(219,229,255,0.64),rgba(255,255,255,0.96),rgba(255,250,243,0.96))] p-4 shadow-[0_24px_60px_-44px_rgba(26,33,55,0.36)]">
        <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Current context</p>
        <p class="mt-3 text-lg font-semibold text-[var(--color-form-ink)]">{activeSectionTitle}</p>
        <p class="mt-1 text-sm leading-6 text-slate-600">
          New cards will appear here first so the dock always tells you where your next edit is going.
        </p>

        <div class="mt-4 rounded-[22px] border border-white/80 bg-white/76 p-4">
          <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Selected field</p>
          <p class="mt-2 break-words text-base font-semibold text-[var(--color-form-ink)]">
            {selectedFieldLabel ?? 'Choose a field card to bind the editor and preview.'}
          </p>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
        {#each signalCards as card}
          <div class="studio-paper px-4 py-4">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">{card.label}</p>
            <p class="mt-2 text-[1.65rem] font-semibold tracking-tight text-[var(--color-form-ink)]">
              {card.value}
            </p>
            <p class="mt-1 text-sm leading-6 text-slate-600">{card.note}</p>
          </div>
        {/each}
      </div>

      <div class="studio-paper p-4">
        <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-form-cobalt)]">
          Why this feels more like Svelte
        </p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="rounded-full bg-[var(--color-form-cobalt-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-form-cobalt)]">
            Shared state
          </span>
          <span class="rounded-full bg-[#fff2ea] px-3 py-1.5 text-xs font-medium text-[#c46b3e]">
            Instant preview
          </span>
          <span class="rounded-full bg-[#f4f0e8] px-3 py-1.5 text-xs font-medium text-slate-600">
            Animated reorder
          </span>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600">
          The dock stays simple because Svelte is doing the heavy lifting underneath: the same blueprint feeds presets, insertion targets, counts, editor bindings, and the rendered preview.
        </p>
      </div>
    </aside>
  </div>
</section>
