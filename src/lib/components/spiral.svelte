<script lang="ts">
  import { onMount } from 'svelte';
  let { size = 288 }: { size?: number } = $props();

  let wrapEl: HTMLDivElement;
  let svgEl: SVGSVGElement;
  let pathData = $state('');

  function buildSpiralPath(
    turns: number,
    startR: number,
    endR: number,
    cx: number,
    cy: number
  ): string {
    const steps = turns * 70;
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * turns * Math.PI * 2;
      const r = startR + (endR - startR) * t;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
    }
    return pts
      .map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(2) + ',' + p[1].toFixed(2))
      .join(' ');
  }

  function shortestDelta(from: number, to: number): number {
    let diff = (to - from) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  }

  onMount(() => {
    pathData = buildSpiralPath(4.2, 4, 230, 250, 250);

    let currentAngle = 0;
    let targetAngle = 0;
    let hovering = false;
    const idleSpeed = 0.4;
    let frameId: number;

    function handleMove(e: MouseEvent) {
      hovering = true;
      const rect = wrapEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    }

    function handleLeave() {
      hovering = false;
    }

    wrapEl.addEventListener('mousemove', handleMove);
    wrapEl.addEventListener('mouseleave', handleLeave);

    function tick() {
      currentAngle += hovering
        ? shortestDelta(currentAngle, targetAngle) * 0.12
        : idleSpeed;
      svgEl.style.transform = `rotate(${currentAngle}deg)`;
      frameId = requestAnimationFrame(tick);
    }
    tick();

    // cleanup when the component unmounts
    return () => {
      cancelAnimationFrame(frameId);
      wrapEl.removeEventListener('mousemove', handleMove);
      wrapEl.removeEventListener('mouseleave', handleLeave);
    };
  });
</script>

<div bind:this={wrapEl} class="relative mx-auto" style="width: {size}px; height: {size}px;">
  <svg bind:this={svgEl} viewBox="0 0 500 500" class="w-full h-full">
    <path
      d={pathData}
      fill="none"
      stroke="#c99a44"
      stroke-width="3.5"
      stroke-linecap="round"
    />
  </svg>
</div>