<script>
  import Badge from './Badge.svelte';
  import Input from './Input.svelte';
  import Button from './Button.svelte';

  let {
    title = 'ACCESO SOBERANO SWAL',
    subtitle = 'Autenticación passwordless · Zero-knowledge',
    apiEndpoint = 'https://xaviercloud.swal.network/auth/magic-link',
    onSuccess,
  } = $props();

  let email = $state('');
  let status = $state('idle'); // 'idle' | 'loading' | 'success' | 'error'
  let errorMessage = $state('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || status === 'loading' || status === 'success') return;

    status = 'loading';
    errorMessage = '';

    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.ok) {
        status = 'success';
        if (onSuccess) {
          onSuccess(data);
        }
        window.location.href = data.magic_url;
      } else {
        throw new Error(data.error || 'Unknown error during authentication');
      }
    } catch (err) {
      status = 'error';
      errorMessage = err.message || 'Error de conexión';
    }
  }
</script>

<div class="swal-magic-link-auth">
  <div class="header">
    <h2 class="title">{title}</h2>
    <p class="subtitle swal-text-secondary">{subtitle}</p>
  </div>

  {#if status === 'success'}
    <div class="success-message">
      <Badge variant="success">ENLACE MÁGICO GENERADO — REDIRIGIENDO...</Badge>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="form">
      <Input
        type="email"
        placeholder="Tu correo electrónico"
        bind:value={email}
        required
        disabled={status === 'loading'}
        autocomplete="email"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={!email || status === 'loading'}
        class="submit-button"
      >
        {#if status === 'loading'}
          Enviando...
        {:else}
          Ingresar
        {/if}
      </Button>
    </form>

    {#if status === 'error'}
      <div class="error-container">
        <Badge variant="danger">{errorMessage}</Badge>
      </div>
    {/if}
  {/if}
</div>

<style>
  .swal-magic-link-auth {
    /* MagicLinkAuth respects bone minimal tokens, but overrides accent to emerald */
    --swal-accent: #39ff14; /* cyberpunk emerald accent */
    --swal-accent-bg: #39ff14;
    --swal-accent-muted: rgba(57, 255, 20, 0.1);

    display: flex;
    flex-direction: column;
    gap: var(--swal-space-6);
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: var(--swal-space-6);
    background: var(--swal-surface);
    border: 1px solid var(--swal-border);
    border-radius: var(--swal-radius-lg);
  }

  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-2);
  }

  .title {
    font-family: var(--swal-font-mono);
    font-size: var(--swal-font-size-xl);
    font-weight: 600;
    margin: 0;
    color: var(--swal-text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .subtitle {
    margin: 0;
    font-size: var(--swal-font-size-sm);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: var(--swal-space-4);
  }

  /* Use explicit global targeting if needed, but standard components will inherit the CSS vars */
  :global(.swal-magic-link-auth .submit-button) {
    width: 100%;
    justify-content: center;
  }

  .success-message {
    display: flex;
    justify-content: center;
    padding: var(--swal-space-4) 0;
  }

  .error-container {
    display: flex;
    justify-content: center;
    margin-top: var(--swal-space-2);
  }
</style>
