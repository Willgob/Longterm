<script>
    import { preloadCode, preloadData } from "$app/navigation";
    import { onMount } from "svelte";

  let lastPage = $state('/');

  onMount(() => {
    if (document.referrer) {
      lastPage = document.referrer;
    }
    preloadCode(lastPage);
    preloadData(lastPage);
  });
</script>

<div style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 40px 20px; filter: drop-shadow(10px 10px 0px rgba(27, 45, 72, 0.15));">
  <svg viewBox="0 0 550 450" xmlns="http://www.w3.org/2000/svg" style="width: min(700px, 92vw); height: auto;">
    <!-- Wobbly "Tattered" Map Card - Corrected Path -->
    <path d="M40,60 Q70,20 250,35 L480,20 Q520,40 510,120 L530,350 Q480,430 250,410 L60,435 Q20,410 45,220 L25,100 Q20,50 40,60 Z" 
          fill="#F3E1AD" 
          stroke="#1B2D48" 
          stroke-width="5" 
          stroke-linejoin="round" />
    

    <!-- 2. Broken Compass Graphic -->
    <g transform="translate(275, 160) scale(1.05)" opacity="0.6">
       <circle cx="0" cy="0" r="35" fill="none" stroke="#1B2D48" stroke-width="3" stroke-dasharray="4,4" />
       <line x1="-20" y1="-20" x2="20" y2="20" stroke="#1B2D48" stroke-width="4" stroke-linecap="round" />
       <line x1="20" y1="-20" x2="-20" y2="20" stroke="#1B2D48" stroke-width="4" stroke-linecap="round" />
     </g>

    <!-- 3. Primary Error Message -->
    <text x="50%" y="225" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="28" fill="#1B2D48">
      OFF THE EDGE OF THE MAP!
    </text>
    
    <!-- 4. Description Text (Separated lines for clarity) -->
    <text x="50%" y="265" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#1B2D48" font-weight="bold">
      The page you're looking for is gone.
    </text>
    <text x="50%" y="290" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#1B2D48" opacity="0.8">
      It might have been pillaged or moved.
    </text>

    <!-- 5. Return Button (Using the Dashboard Style) -->
    <a href={lastPage} style="cursor: pointer; text-decoration: none;" data-sveltekit-preload-data="hover" data-sveltekit-preload-code="hover">
      <g transform="translate(140, 330) scale(1)">
        <path d="M5,8 Q10,2 30,5 L220,2 Q235,5 232,20 L238,35 Q220,43 120,40 L20,43 Q5,40 8,25 Z" 
              fill="#FFB400" 
              stroke="#1B2D48" 
              stroke-width="3" 
              stroke-linejoin="round" />
        <text x="125" y="26" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', sans-serif" font-weight="900" font-size="14" fill="#1B2D48" style="text-transform: uppercase;">
          SAIL BACK TO LAST PAGE
        </text>
        <path d="M15,12 Q25,8 50,10" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
      </g>
    </a>
  </svg>
</div>