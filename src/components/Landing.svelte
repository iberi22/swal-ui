<script>
  import Button from './Button.svelte';
  import Card from './Card.svelte';

  let {
    title = 'SWAL Ecosystem',
    subtitle = 'Decentralized Edge Intelligence & Mesh Orchestration',
    heroButtonText = 'Initialize Node',
    onHeroClick,
    features = [], // Array of objects { title, description, icon }
    stats = [], // Array of objects { value, label, trend }
    brandLogo,
    navLinks = [], // Array of objects { href, text }
    footerText = 'SWAL Ecosystem © 2026. All rights reserved.',
    children,
    ...rest
  } = $props();
</script>

<div class="swal-landing swal-grid-bg swal-dvh swal-safe-area swal-touch" {...rest}>
  <!-- Topbar Header -->
  <header class="landing-header">
    <div class="brand">
      {#if brandLogo}
        {@render brandLogo()}
      {:else}
        <span class="logo-text swal-neon-cyan">SWAL</span>
        <span class="logo-sub swal-neon-orange">HIVE</span>
      {/if}
    </div>

    {#if navLinks.length > 0}
      <nav class="nav-links">
        {#each navLinks as link}
          <a href={link.href} class="nav-link">{link.text}</a>
        {/each}
      </nav>
    {/if}

    <div class="header-actions">
      <Button variant="ghost" size="sm" onclick={onHeroClick}>Docs</Button>
      <Button variant="primary" size="sm" onclick={onHeroClick}>Launch App</Button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-content swal-enter">
      <div class="tag-container">
        <span class="swal-neon-orange-badge">NODE STATUS: ACTIVE</span>
      </div>
      <h1 class="hero-title">{title}</h1>
      <p class="hero-subtitle">{subtitle}</p>

      <div class="hero-cta">
        <Button variant="orange" size="lg" onclick={onHeroClick}>
          {heroButtonText}
        </Button>
        <Button variant="secondary" size="lg" onclick={onHeroClick}>
          Explore Mesh
        </Button>
      </div>
    </div>
  </section>

  <!-- Stats Grid -->
  {#if stats.length > 0}
    <section class="stats-section">
      <div class="stats-grid">
        {#each stats as stat}
          <Card variant="glass" padding="md" class="stat-card">
            <div class="stat-value swal-neon-cyan">{stat.value}</div>
            <div class="stat-label">{stat.label}</div>
            {#if stat.trend}
              <div class="stat-trend">{stat.trend}</div>
            {/if}
          </Card>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Features/Benefits Section -->
  {#if features.length > 0}
    <section class="features-section">
      <h2 class="section-title">Ecosystem Capabilities</h2>
      <div class="features-grid">
        {#each features as feature}
          <Card variant="surface" padding="lg" hoverable={true} class="feature-card">
            <div class="feature-header">
              {#if feature.icon}
                <div class="feature-icon">{@render feature.icon()}</div>
              {:else}
                <div class="feature-icon swal-neon-orange">◆</div>
              {/if}
              <h3 class="feature-title">{feature.title}</h3>
            </div>
            <p class="feature-description">{feature.description}</p>
          </Card>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Custom/Additional Slot Content -->
  {#if children}
    <section class="custom-content-section">
      {@render children()}
    </section>
  {/if}

  <!-- Footer -->
  <footer class="landing-footer">
    <p>{footerText}</p>
  </footer>
</div>

<style>
  .swal-landing {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: hidden;
    position: relative;
    background: var(--swal-bg);
    color: var(--swal-text);
    font-family: var(--swal-font);
  }

  /* Header */
  .landing-header {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--swal-space-6);
    border-bottom: 1px solid var(--swal-border);
    background: rgba(2, 6, 23, 0.7);
    backdrop-filter: blur(12px);
    z-index: 10;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--swal-space-2);
    font-family: var(--swal-font-mono);
    font-weight: 800;
    font-size: var(--swal-font-size-lg);
    letter-spacing: 0.05em;
  }

  .logo-sub {
    font-size: 0.85em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--swal-space-6);
  }

  .nav-link {
    color: var(--swal-text-secondary);
    text-decoration: none;
    font-size: var(--swal-font-size-sm);
    font-weight: 500;
    transition: color var(--swal-transition-fast);
  }

  .nav-link:hover {
    color: var(--swal-text);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--swal-space-3);
  }

  /* Hero Section */
  .hero-section {
    padding: var(--swal-space-10) var(--swal-space-6);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
    min-height: 500px;
    justify-content: center;
  }

  .hero-content {
    max-width: 800px;
  }

  .tag-container {
    margin-bottom: var(--swal-space-5);
  }

  .swal-neon-orange-badge {
    background: var(--swal-accent-orange-muted);
    border: 1px solid var(--swal-accent-orange);
    color: var(--swal-accent-orange);
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-xs);
    padding: 4px 12px;
    border-radius: 9999px;
    letter-spacing: 0.1em;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 var(--swal-space-4);
    background: linear-gradient(135deg, var(--swal-text) 50%, var(--swal-text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    font-size: var(--swal-font-size-lg);
    color: var(--swal-text-secondary);
    margin: 0 0 var(--swal-space-8);
    line-height: 1.5;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--swal-space-4);
  }

  /* Stats Section */
  .stats-section {
    padding: var(--swal-space-8) var(--swal-space-6);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--swal-space-5);
  }

  .stat-card {
    text-align: center;
  }

  .stat-value {
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--swal-space-2);
  }

  .stat-label {
    color: var(--swal-text-secondary);
    font-size: var(--swal-font-size-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-trend {
    color: var(--swal-success);
    font-size: 11px;
    font-family: var(--swal-font-mono);
    margin-top: var(--swal-space-2);
  }

  /* Features Section */
  .features-section {
    padding: var(--swal-space-10) var(--swal-space-6);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .section-title {
    text-align: center;
    font-size: var(--swal-font-size-2xl);
    margin-bottom: var(--swal-space-8);
    letter-spacing: -0.02em;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--swal-space-6);
  }

  .feature-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .feature-header {
    display: flex;
    align-items: center;
    gap: var(--swal-space-3);
    margin-bottom: var(--swal-space-3);
  }

  .feature-icon {
    font-size: var(--swal-font-size-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-title {
    font-size: var(--swal-font-size-lg);
    font-weight: 600;
    margin: 0;
  }

  .feature-description {
    color: var(--swal-text-secondary);
    font-size: var(--swal-font-size-sm);
    line-height: 1.5;
    margin: 0;
  }

  /* Custom Content Section */
  .custom-content-section {
    padding: var(--swal-space-8) var(--swal-space-6);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  /* Footer */
  .landing-footer {
    padding: var(--swal-space-8) var(--swal-space-6);
    border-top: 1px solid var(--swal-border);
    text-align: center;
    color: var(--swal-text-muted);
    font-size: var(--swal-font-size-xs);
    background: rgba(2, 6, 23, 0.4);
    margin-top: auto;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .landing-header {
      padding: 0 var(--swal-space-4);
    }

    .nav-links {
      display: none;
    }

    .hero-title {
      font-size: 2.25rem;
    }

    .hero-cta {
      flex-direction: column;
      width: 100%;
    }

    .hero-cta :global(.swal-btn) {
      width: 100%;
    }
  }
</style>
