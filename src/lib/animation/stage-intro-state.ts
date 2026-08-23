'use client';

/**
 * Registra se a abertura teatral já foi exibida neste documento.
 *
 * É um singleton de módulo em vez de `sessionStorage`, pelo mesmo motivo que
 * `lenis-instance.ts` não é um Context: o problema é pequeno e local. O único
 * caso a cobrir é a navegação de cliente — trocar de idioma remonta o segmento
 * `[locale]` e reexibiria a abertura. Um módulo já sobrevive a isso e morre no
 * recarregamento, que é exatamente o comportamento especificado.
 *
 * `sessionStorage` exigiria leitura antes do primeiro quadro pintado, ou seja,
 * um script inline — que o guia de segurança proíbe.
 *
 * Não há risco de hidratação: no servidor o módulo é sempre novo, então a
 * marcação sai sempre; na primeira hidratação o valor ainda é `false`, de modo
 * que cliente e servidor coincidem. Ele só vira `true` depois da conclusão, que
 * acontece bem após a hidratação.
 */
let played = false;

export function hasStageIntroPlayed(): boolean {
  return played;
}

export function markStageIntroPlayed(): void {
  played = true;
}

/** Existe para os testes: nenhum caminho da aplicação volta atrás. */
export function resetStageIntroForTesting(): void {
  played = false;
}
