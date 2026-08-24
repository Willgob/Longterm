<script lang=ts>
  import { page } from '$app/stores';
  import Button from './SideNavbutton.svelte';
  let isMobileOpen = $state(false);
  
  let { slackId = '', displayName = '', avatarUrl = '', goldBars = 0, isReviewerUser = false } = $props();
  
  const navItems = $derived.by(() => {
    const items = [
    { label: 'Home', href: '/home'},
    { label: 'Shop', href: '/home/shop'},
    { label: 'Projects', href: '/home/projects'},
    { label: 'Gallery', href: '/home/gallery'},
    { label: 'Settings', href: '/home/settings'},
    ];

    if (isReviewerUser) {
      items.push({ label: 'Review', href: '/review' });
    }

    return items;
  });
</script>

<div class="sidebar-container">
  <!-- Mobile Toggle Button -->
  <button 
    class="mobile-toggle"
    onclick={() => isMobileOpen = !isMobileOpen}
    aria-label="Toggle navigation"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>

  <!-- Sidebar -->
  <nav class="sidebar" class:open={isMobileOpen}>
    <!-- Header -->
    <div class="sidebar-header">
      <img src="/assets/Text-logo (two lines).webp" alt="Treasure Hunt Logo" class="h-20 md:h-24 object-contain" />
    </div>

    <!-- Navigation Items -->
    <ul class="nav-list">
      {#each navItems as item}
        <Button href={item.href} text={item.label} />
      {/each}
    </ul>

    <!-- Footer Info -->
    <div class="sidebar-footer">
      <img src={avatarUrl} alt="User Avatar" class="avatar" />
      <div class="user-info">
        <p class="username">{displayName || 'Guest'}</p>
          <p class="gold-bars"><img draggable="false" src="/assets/Gold Bar.webp" alt="Gold Bar" class="gold-icon" />{goldBars}</p>
      </div>
      <a href="/api/logout" class="logout-btn" title="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
      </a>
    </div>
  </nav>

</div>

<style>
  .gold-bars {
    font-size: 0.75rem;
    color: var(--text-900);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
  }
  .sidebar-container {
    position: relative;
    width: 250px;
    min-width: 250px;
    flex-shrink: 0;
    height: 100vh;
  }

  .mobile-toggle {
    display: none;
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--text-900);
    z-index: 60;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    background: linear-gradient(135deg, var(--background-700) 0%, var(--background-800) 50%, var(--background-700) 100%);
    border-right: 3px solid var(--accent-500);
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;
    z-index: 45;
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--accent-500);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    position: relative;
  }

  .nav-list {
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid var(--accent-400);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid var(--accent-500);
    flex-shrink: 0;
    object-fit: cover;
  }

  .user-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .username {
    margin: 0;
    color: var(--text-900);
    font-size: 0.875rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gold-icon {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
    display: inline-block;
    flex-shrink: 0;
    transform: scale(2.5);
    transform-origin: center;
  }
  .gold-bars {
    margin: 0;
  }
  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    color: var(--text-900);
    background-color: var(--background-600);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .logout-btn:hover {
    background-color: var(--background-500);
    transform: scale(1.05);
  }

  .logout-btn svg {
    display: block;
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .mobile-toggle {
      display: flex;
    }

    .sidebar-container {
      width: auto;
      min-width: 0;
      height: auto;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      transform: translateX(-100%);
      z-index: 55;
      border-radius: 0 8px 8px 0;
    }

    .sidebar.open {
      transform: translateX(0);
    }

  }
</style>