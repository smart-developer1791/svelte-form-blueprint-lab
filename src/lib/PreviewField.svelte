<script lang="ts">
  import type { FormField } from './types'

  type Props = {
    field: FormField
    isSelected: boolean
    compact?: boolean
    onSelect: () => void
  }

  let { field, isSelected, compact = false, onSelect }: Props = $props()

  const renderedOptions = $derived(field.options.length > 0 ? field.options : ['Option'])

  function handleKeySelect(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect()
    }
  }
</script>

<div
  class={`rounded-[24px] border px-4 py-4 transition ${
    isSelected
      ? 'border-[var(--color-form-cobalt)] bg-[linear-gradient(145deg,rgba(219,229,255,0.52),rgba(255,255,255,0.98))] shadow-[0_20px_46px_-34px_rgba(49,97,246,0.44)]'
      : 'border-[#e7dccc] bg-white/96'
  }`}
  role="button"
  tabindex="0"
  aria-pressed={isSelected}
  onclick={onSelect}
  onkeydown={handleKeySelect}
>
  <div class="pointer-events-none">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="break-words text-sm font-semibold text-[var(--color-form-ink)]">
        {field.label}
        {#if field.required}
          <span class="ml-1 text-[var(--color-form-cobalt)]">*</span>
        {/if}
      </p>
      <span class="rounded-full bg-[var(--color-form-paper)] px-2.5 py-1 text-[0.72rem] font-semibold text-slate-500">
        {field.type}
      </span>
    </div>

    {#if field.type === 'textarea'}
      <textarea
        rows={compact ? 3 : 4}
        class="mt-3 w-full rounded-[18px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-4 py-3 text-sm text-slate-600"
        placeholder={field.placeholder}
      ></textarea>
    {:else if field.type === 'select'}
      <select class="mt-3 w-full rounded-[18px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-4 py-3 text-sm text-slate-600">
        {#each renderedOptions as option}
          <option>{option}</option>
        {/each}
      </select>
    {:else if field.type === 'radio'}
      <div class="mt-3 space-y-2">
        {#each renderedOptions as option}
          <div class="flex items-center gap-3 rounded-[16px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-3 py-2.5 text-sm text-slate-700">
            <span class="h-4 w-4 rounded-full border border-slate-300 bg-white"></span>
            <span class="break-words">{option}</span>
          </div>
        {/each}
      </div>
    {:else if field.type === 'checkbox'}
      <div class="mt-3 space-y-2">
        {#each renderedOptions as option}
          <div class="flex items-center gap-3 rounded-[18px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-3 py-3 text-sm text-slate-700">
            <span class="h-4 w-4 rounded border border-slate-300 bg-white"></span>
            <span class="break-words">{option}</span>
          </div>
        {/each}
      </div>
    {:else}
      <input
        class="mt-3 w-full rounded-[18px] border border-[#e7dccc] bg-[var(--color-form-paper)] px-4 py-3 text-sm text-slate-600"
        type={field.type === 'date' ? 'date' : field.type}
        placeholder={field.placeholder}
      />
    {/if}

    {#if field.helper}
      <p class="mt-3 break-words text-xs leading-6 text-slate-500">{field.helper}</p>
    {/if}
  </div>
</div>
