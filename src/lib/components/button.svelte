<script>
    let { href, text } = $props();
</script>
<style>
    .on-hover {
        transition: transform 0.2s ease;
        display: inline-block;
    }

    .on-hover:hover {
        transform: scale(1.1);
    }
</style>
<a href={href} aria-label={text} data-sveltekit-preload-data="hover">
  <button class="on-hover" style="background: none; border: none; cursor: pointer; padding: 0;">
    <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
      <!-- Parchment Paper Background with slight "burnt" jagged edges -->
      <path d="M5,10 L195,5 L190,50 L10,55 Z" fill="#F3E1AD" stroke="#1B2D48" stroke-width="3" stroke-linejoin="round" />
      
      <!-- Decorative Compass lines in the corner to match the letter style -->
    <line x1="15" y1="20" x2="30" y2="20" stroke="#1B2D48" stroke-width="1" opacity="0.5" />
    <line x1="22" y1="12" x2="22" y2="28" stroke="#1B2D48" stroke-width="1" opacity="0.5" />
    
    <!-- Button Text using a stylized feel -->
    <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" 
          font-family="sans-serif" font-weight="bold" font-size="18" fill="#1B2D48" style="text-transform: uppercase; letter-spacing: 1px;">
      {text}
    </text>
    
    <!-- Subtle texture lines -->
    <path d="M160,15 Q170,20 180,15" fill="none" stroke="#1B2D48" stroke-width="1" opacity="0.3" />
  </svg>
</button>
</a>