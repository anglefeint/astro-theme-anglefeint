import { textExamples as samples, cryptoExample } from './examples.js';
import { decodeText, DECODER_INPUT_LIMIT } from './text.js';
import { createNumericReveal } from '../effects/numeric-reveal.js';
import { createPipeline } from './pipeline.js';
import { copyResult, downloadResult } from './actions.js';

let cryptoModule;
const loadCrypto = () =>
  (cryptoModule ||= import('./crypto/index.js').catch((error) => {
    cryptoModule = undefined;
    throw new Error('loadFailed', { cause: error });
  }));
export function createDecoderController(container, labels, clock, pageLabels = {}) {
  let listeners,
    animation,
    revision = 0;
  const stop = () => {
    revision++;
    listeners?.abort();
    listeners = undefined;
    animation?.dispose();
    animation = undefined;
  };
  const start = () => {
    stop();
    const form = container.matches?.('.hacker-decoder-form')
      ? container
      : container.querySelector('.hacker-decoder-form');
    if (!form) return;
    listeners = new AbortController();
    const { signal } = listeners;
    const find = (selector) => form.querySelector(selector);
    const input = find('[name="decoder-input"]'),
      format = find('[name="decoder-format"]');
    const task = find('[name="decoder-task"]'),
      chain = find('[name="decoder-chain"]');
    const decimals = find('[name="decoder-decimals"]'),
      network = find('[name="decoder-network"]');
    const output = find('.hacker-decoder-output'),
      status = find('.hacker-decoder-status');
    const copy = find('[data-decoder-copy]'),
      reuse = find('[data-decoder-reuse]');
    const history = find('[data-decoder-history]'),
      exportButton = find('[data-decoder-export]');
    const notice = find('[data-decoder-notice]');
    function setStatus(text, state = 'idle') {
      status.textContent = text;
      status.dataset.state = state;
    }
    const pipeline = createPipeline();
    let decoded = '',
      continuing = false,
      lastCall;
    const currentTask = () => task?.value || 'text';
    const options = () => ({
      task: currentTask(),
      chain: chain?.value,
      decimals: decimals?.value || '',
      network: network?.value,
    });
    const formatName = (id) =>
      ({
        base64: 'Base64',
        html: labels.html,
        unicode: labels.unicode,
        jwt: 'JWT',
        url: 'URL',
        hex: 'Hex',
        call: pageLabels.callTask,
        address: pageLabels.addressTask,
      })[id] ||
      pageLabels[id] ||
      id;
    function renderHistory() {
      if (!history) return;
      history.replaceChildren();
      const records = pipeline.list();
      exportButton.disabled = !records.length;
      records.forEach((record, index) => {
        const item = document.createElement('li'),
          details = document.createElement('details'),
          summary = document.createElement('summary');
        summary.textContent = formatName(record.format);
        const before = document.createElement('pre'),
          after = document.createElement('pre');
        before.textContent = record.input;
        after.textContent = record.text;
        const beforeLabel = document.createElement('p'),
          afterLabel = document.createElement('p');
        beforeLabel.textContent = labels.input;
        afterLabel.textContent = labels.output;
        details.append(summary, beforeLabel, before, afterLabel, after);
        if (record.steps) {
          const steps = document.createElement('ol');
          record.steps.forEach((key) => {
            const li = document.createElement('li');
            li.textContent = pageLabels[key];
            steps.append(li);
          });
          details.append(steps);
        }
        const back = document.createElement('button');
        back.type = 'button';
        back.textContent = pageLabels.back;
        back.disabled = record.text.length > DECODER_INPUT_LIMIT;
        back.addEventListener('click', () => {
          pipeline.truncate(index + 1);
          continuing = true;
          reset();
          input.value = record.text;
          task.value = 'text';
          format.value = 'auto';
          syncControls();
          renderHistory();
          input.focus();
        });
        details.append(back);
        item.append(details);
        history.append(item);
      });
    }
    function reset() {
      revision++;
      animation?.dispose();
      animation = undefined;
      lastCall = undefined;
      decoded = '';
      output.textContent = '';
      delete output.dataset.decoderState;
      output.removeAttribute('aria-busy');
      copy.disabled = reuse.disabled = true;
      setStatus(labels.ready);
      if (notice) notice.textContent = '';
    }
    function edit() {
      reset();
      if (!continuing) {
        pipeline.clear();
        renderHistory();
      }
    }
    function syncControls() {
      const kind = currentTask();
      const taskbar = find('.decoder-taskbar');
      if (taskbar) taskbar.hidden = kind === 'text';
      form.querySelectorAll('[data-decoder-task]').forEach((tab) => {
        const active = tab.dataset.decoderTask === kind;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      find('[role="tabpanel"]')?.setAttribute('aria-labelledby', `decoder-tab-${kind}`);

      form.querySelectorAll('[data-text-control]').forEach((el) => {
        el.hidden = kind !== 'text';
      });
      form.querySelectorAll('[data-crypto-control]').forEach((el) => {
        el.hidden = kind === 'text';
      });
      form.querySelectorAll('[data-decimals-control]').forEach((el) => {
        el.hidden = kind !== 'call';
      });
      const btc = chain?.querySelector('option[value="btc"]');
      if (btc) {
        btc.disabled = kind === 'call';
        if (kind === 'call' && chain.value === 'btc') chain.value = 'evm';
      }
      form.querySelectorAll('[data-network-control]').forEach((el) => {
        el.hidden = kind !== 'address' || chain.value !== 'btc';
      });
    }
    form.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
        reset();
        if (!continuing) pipeline.clear();
        const request = revision,
          source = input.value,
          params = options();
        copy.disabled = reuse.disabled = true;
        setStatus(labels.running, 'running');
        try {
          const result =
            params.task === 'text'
              ? decodeText(source, format.value)
              : (await loadCrypto()).runCrypto(source, params);
          if (request !== revision || signal.aborted) return;
          const record = {
            input: source,
            text: result.text,
            format: result.format || params.task,
            ...params,
            steps: result.steps,
          };
          if (history) pipeline.add(record);
          continuing = false;
          if (params.task === 'call') lastCall = { result, record };
          decoded = result.text;
          output.textContent = decoded;
          output.scrollTop = 0;
          output.setAttribute('aria-busy', 'true');
          const complete = () => {
            if (request !== revision || signal.aborted) return;
            copy.disabled = false;
            reuse.disabled = !decoded || decoded.length > DECODER_INPUT_LIMIT;
            output.setAttribute('aria-busy', 'false');
            setStatus(
              `${labels.done} · ${formatName(record.format)}${result.format === 'jwt' ? ` · ${labels.jwtWarning}` : ''}`,
              'done'
            );
            if (notice) notice.textContent = pageLabels[result.notice] || '';
            renderHistory();
          };
          const revealStyle = getComputedStyle(output);
          const numericStyle = (name) => {
            const value = revealStyle.getPropertyValue(name).trim();
            return value && Number.isFinite(Number(value)) ? Number(value) : undefined;
          };
          const revealColor = revealStyle.getPropertyValue('--numeric-reveal-color').trim();
          const revealHighlight = revealStyle.getPropertyValue('--numeric-reveal-highlight').trim();
          animation = createNumericReveal({
            target: output,
            color: revealColor === 'currentColor' ? revealStyle.color : revealColor || undefined,
            highlight:
              revealHighlight === 'currentColor' ? revealStyle.color : revealHighlight || undefined,
            opacityRange: [
              numericStyle('--numeric-reveal-opacity-min'),
              numericStyle('--numeric-reveal-opacity-max'),
            ],
            trailOpacity: numericStyle('--numeric-reveal-trail-opacity'),
            clock,
            durationRangeMs: [1500, 3000],
            fadeMs: 1200,
            inputLength: source.length,
            signal,
          });
          animation.play(complete);
        } catch (error) {
          if (request === revision && !signal.aborted) {
            setStatus(
              pageLabels[error.message] || labels[error.message] || labels.invalid,
              'error'
            );
            renderHistory();
          }
        }
      },
      { signal }
    );
    find('[data-decoder-clear]').addEventListener(
      'click',
      () => {
        continuing = false;
        reset();
        input.value = '';
        pipeline.clear();
        renderHistory();
        input.focus();
      },
      { signal }
    );
    find('[data-decoder-example]').addEventListener(
      'click',
      () => {
        continuing = false;
        reset();
        pipeline.clear();
        renderHistory();
        const request = revision;
        try {
          const value =
            currentTask() === 'text'
              ? samples[format.value] || samples.base64
              : cryptoExample(currentTask(), chain.value, network?.value);
          if (request === revision && !signal.aborted) {
            input.value = value;
            input.focus();
          }
        } catch {
          if (request === revision && !signal.aborted) setStatus(labels.invalid, 'error');
        }
      },
      { signal }
    );
    reuse.addEventListener(
      'click',
      () => {
        const value = decoded;
        continuing = true;
        reset();
        input.value = value;
        format.value = 'auto';
        if (task) task.value = 'text';
        syncControls();
        input.focus();
      },
      { signal }
    );
    copy.addEventListener(
      'click',
      async () => {
        const request = revision;
        try {
          await copyResult(decoded);
          if (request === revision && !signal.aborted) setStatus(labels.copied, 'done');
        } catch {
          if (request === revision && !signal.aborted) setStatus(labels.copyFailed, 'error');
        }
      },
      { signal }
    );
    exportButton?.addEventListener('click', () => downloadResult(pipeline.list()), { signal });
    input.addEventListener('input', edit, { signal });
    format.addEventListener('change', edit, { signal });
    for (const control of [task, chain, network])
      control?.addEventListener(
        'change',
        () => {
          continuing = false;
          edit();
          syncControls();
        },
        { signal }
      );

    const tabs = Array.from(form.querySelectorAll('[data-decoder-task]'));
    tabs.forEach((tab, index) => {
      tab.addEventListener(
        'click',
        () => {
          if (task.value === tab.dataset.decoderTask) return;
          task.value = tab.dataset.decoderTask;
          task.dispatchEvent(new Event('change', { bubbles: true }));
        },
        { signal }
      );
      tab.addEventListener(
        'keydown',
        (event) => {
          let next;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          if (next === undefined) return;
          event.preventDefault();
          tabs[next].focus();
          tabs[next].click();
        },
        { signal }
      );
    });
    decimals?.addEventListener(
      'input',
      async () => {
        if (!lastCall) {
          edit();
          return;
        }
        const saved = lastCall;
        animation?.finish();
        const request = ++revision;
        try {
          const next = (await loadCrypto()).updateCallPrecision(saved.result.data, decimals.value);
          if (request !== revision || signal.aborted) return;
          const record = {
            ...saved.record,
            decimals: decimals.value,
            text: next.text,
            steps: next.steps,
          };
          if (history) {
            pipeline.truncate(Math.max(0, pipeline.list().length - 1));
            pipeline.add(record);
          }
          lastCall = { result: next, record };
          decoded = next.text;
          output.textContent = decoded;
          copy.disabled = false;
          reuse.disabled = decoded.length > DECODER_INPUT_LIMIT;
          setStatus(labels.done, 'done');
          renderHistory();
        } catch (error) {
          if (request !== revision || signal.aborted) return;
          decoded = '';
          output.textContent = '';
          copy.disabled = reuse.disabled = true;
          setStatus(pageLabels[error.message] || labels.invalid, 'error');
        }
      },
      { signal }
    );
    window.addEventListener('pagehide', stop, { signal, once: true });
    document.addEventListener('astro:before-swap', stop, { signal, once: true });
    container.addEventListener('window:geometry', () => animation?.finish(), { signal });
    reset();
    renderHistory();
    syncControls();
  };
  return { start, stop };
}
