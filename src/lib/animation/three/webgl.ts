/**
 * Detecta suporte a WebGL sem instanciar o Three.js.
 *
 * Executado apenas no cliente, dentro de um efeito: chamar no corpo do
 * componente causaria divergência entre servidor e cliente.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    return context !== null;
  } catch {
    // Alguns navegadores lançam exceção quando o WebGL está desabilitado por política.
    return false;
  }
}
