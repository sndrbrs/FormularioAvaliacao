document.addEventListener("DOMContentLoaded", () => {
    const totalPontos = 100; // Pontuação inicial total
    const distribuicaoPontos = {
        resolutividade: 30,
        etica: 20,
        humanizado: 10,
        comunicacao: 20,
        procedimento: 20,
    };

    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const mostradorPontos = document.getElementById("score");

    // Função para calcular a pontuação restante
    const calcularPontuacao = () => {
        let deducaoPontos = 0;

        Object.keys(distribuicaoPontos).forEach((criterio) => {
            const groupCheckboxes = document.querySelectorAll(`input[name="${criterio}[]"]:checked`);
            const groupTotalCheckboxes = document.querySelectorAll(`input[name="${criterio}[]"]`).length;

            if (groupTotalCheckboxes > 0) {
                const deducaoItem = distribuicaoPontos[criterio] / groupTotalCheckboxes;
                deducaoPontos += groupCheckboxes.length * deducaoItem;
            }
        });

        const remanejamentoPontos = Math.max(0, totalPontos - deducaoPontos);
        mostradorPontos.textContent = `Pontuação da avaliação: ${remanejamentoPontos.toFixed(2)}`;
    };

    // Adicionar evento de mudança a cada checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", calcularPontuacao);
    });

    // Atualizar pontuação ao carregar a página
    calcularPontuacao();

    });
