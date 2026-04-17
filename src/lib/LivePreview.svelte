<script lang="ts">
  import PreviewField from './PreviewField.svelte'
  import { previewModeOptions } from './data/presets'
  import type { BlueprintStats, FormBlueprint, PreviewMode } from './types'

  type Props = {
    blueprint: FormBlueprint
    stats: BlueprintStats
    previewMode: PreviewMode
    selectedFieldId: string | null
    onSetPreviewMode: (mode: PreviewMode) => void
    onSelectField: (fieldId: string) => void
  }

  let {
    blueprint,
    stats,
    previewMode,
    selectedFieldId,
    onSetPreviewMode,
    onSelectField,
  }: Props = $props()
</script>

<section class="studio-panel overflow-hidden p-5 sm:p-6">
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-xl">
          <p class="text-[0.72rem] font-semibold tracking-[0.18em] text-slate-500">Preview</p>
          <h2 class="mt-2 font-[var(--font-display)] text-[2rem] leading-none text-[var(--color-form-ink)]">
            See the form as a calmer product surface
          </h2>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            Keep the rendered form and the editor on the same visual line, so structure changes are easier to compare while you work.
          </p>
        </div>

        <div class="inline-flex rounded-full border border-white/80 bg-white/76 p-1 shadow-sm">
          {#each previewModeOptions as option}
            <button
              type="button"
              class={`rounded-full px-3 py-2 text-sm font-medium transition ${
                option.key === previewMode
                  ? 'bg-[var(--color-form-ink)] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white/80'
              }`}
              onclick={() => onSetPreviewMode(option.key)}
            >
              {option.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="studio-paper p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Current form</p>
            <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{blueprint.title}</p>
          </div>
          <div class="rounded-full bg-[var(--color-form-paper)] px-3.5 py-2 text-sm font-medium text-slate-600">
            {stats.completionEstimate}% ready
          </div>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Fields</p>
            <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{stats.totalFields}</p>
          </div>
          <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Required</p>
            <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{stats.requiredFields}</p>
          </div>
          <div class="rounded-[20px] bg-[var(--color-form-paper)] px-3 py-3">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Submit</p>
            <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{blueprint.submitLabel}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-[32px] border border-white/80 bg-[linear-gradient(155deg,rgba(219,229,255,0.44),rgba(255,255,255,0.98),rgba(255,250,243,0.95))] p-3 sm:p-4 shadow-[0_28px_70px_-52px_rgba(26,33,55,0.34)]">
      {#if previewMode === 'confirmation'}
        <div class="studio-paper p-5">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-form-cobalt-soft)] text-lg font-bold text-[var(--color-form-cobalt)]">
            OK
          </div>
          <h3 class="mt-4 font-[var(--font-display)] text-[1.85rem] leading-none text-[var(--color-form-ink)]">
            Confirmation state
          </h3>
          <p class="mt-3 text-sm leading-7 text-slate-600">
            The screen can step out of editing mode without switching data models. Same blueprint, different state, cleaner product feel.
          </p>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-[22px] bg-[var(--color-form-paper)] px-4 py-4">
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Sections</p>
              <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{stats.sectionCount}</p>
            </div>
            <div class="rounded-[22px] bg-[var(--color-form-paper)] px-4 py-4">
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Choices</p>
              <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{stats.choiceFields}</p>
            </div>
            <div class="rounded-[22px] bg-[var(--color-form-paper)] px-4 py-4">
              <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">Confidence</p>
              <p class="mt-2 text-lg font-semibold text-[var(--color-form-ink)]">{stats.completionEstimate}%</p>
            </div>
          </div>

          <div class="mt-5 rounded-[24px] bg-[var(--color-form-paper)] p-4">
            <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">What users see next</p>
            <p class="mt-2 text-sm leading-7 text-slate-600">
              A clear success card, a short recap, and a softer follow-up action driven by the same blueprint metadata you edited on the main canvas.
            </p>
          </div>

          <button
            type="button"
            class="mt-5 w-full rounded-[22px] bg-[var(--color-form-ink)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(26,33,55,0.48)] transition hover:brightness-105"
          >
            {blueprint.submitLabel}
          </button>
        </div>
      {:else}
        <div class={`${previewMode === 'mobile' ? 'mx-auto max-w-[22.5rem]' : 'mx-auto max-w-[36rem]'}`}>
          <div
            class={`rounded-[34px] border border-[#ddd6cc] bg-[#f8f3ea] shadow-[0_30px_70px_-54px_rgba(26,33,55,0.44)] ${
              previewMode === 'mobile' ? 'overflow-hidden' : 'p-4'
            }`}
          >
            {#if previewMode === 'mobile'}
              <div class="bg-[var(--color-form-ink)] px-5 pb-2 pt-3">
                <div class="mx-auto h-1.5 w-24 rounded-full bg-white/25"></div>
              </div>
            {/if}

            <div class={`${previewMode === 'mobile' ? 'p-4 sm:p-5' : ''}`}>
              <div class="studio-paper p-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <span class="rounded-full bg-[var(--color-form-cobalt-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-form-cobalt)]">
                    {blueprint.badge}
                  </span>
                  <span class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">
                    {stats.completionEstimate}% complete
                  </span>
                </div>

                <p class="mt-4 text-[1.35rem] font-semibold tracking-tight text-[var(--color-form-ink)]">
                  {blueprint.title}
                </p>
                <p class="mt-2 text-sm leading-7 text-slate-600">{blueprint.subtitle}</p>

                <div class="mt-4 h-2.5 rounded-full bg-[#e7eaf2]">
                  <div
                    class="h-2.5 rounded-full bg-[linear-gradient(90deg,#3161f6,#ff9866)] transition-[width] duration-300"
                    style={`width: ${stats.completionEstimate}%`}
                  ></div>
                </div>
              </div>

              <div class="mt-4 space-y-4">
                {#each blueprint.sections as section (section.id)}
                  <section class="studio-paper p-4">
                    <p class="text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500">{section.title}</p>
                    <p class="mt-2 text-sm leading-7 text-slate-600">{section.description}</p>

                    <div class="mt-4 space-y-3">
                      {#each section.fields as field (field.id)}
                        <PreviewField
                          field={field}
                          compact={previewMode === 'mobile'}
                          isSelected={selectedFieldId === field.id}
                          onSelect={() => onSelectField(field.id)}
                        />
                      {/each}
                    </div>
                  </section>
                {/each}
              </div>

              <button
                type="button"
                class="mt-5 w-full rounded-[22px] bg-[var(--color-form-ink)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(26,33,55,0.48)] transition hover:brightness-105"
              >
                {blueprint.submitLabel}
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
