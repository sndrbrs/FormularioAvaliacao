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

    document.getElementById("save-pdf").addEventListener("click", function () {
        const form = document.querySelector("form");
        const formData = new FormData(form);
        const { jsPDF } = window.jspdf; // jsPDF carregado da biblioteca
        const doc = new jsPDF();
    
        doc.setFontSize(16);
        doc.text("Formulário de Avaliação - HelpCenter Chatbot", 10, 10);
    
        doc.setFontSize(12);
        doc.text("Informações do Atendimento:", 10, 20);
    
        let yPosition = 30; // Posição inicial no eixo Y
        doc.setFontSize(10);
    
        // Adicionar campos preenchidos no PDF
        doc.text(`Número do Atendimento: ${formData.get("numero_atendimento")}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Matrícula/Chave: ${formData.get("matricula")}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Assunto: ${formData.get("assunto")}`, 10, yPosition);
        yPosition += 10;
    
        doc.text("Comentários Gerais:", 10, yPosition);
        yPosition += 10;
        doc.text(formData.get("comentarios_gerais") || "Nenhum comentário.", 10, yPosition);
    
        // Salvar o PDF
        doc.save("formulario_avaliacao.pdf");
    });
    
    
