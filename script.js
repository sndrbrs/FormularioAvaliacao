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
    let pontuacaoAtual = totalPontos; // Armazenar a pontuação atual

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

        pontuacaoAtual = Math.max(0, totalPontos - deducaoPontos);
        mostradorPontos.textContent = `Pontuação da avaliação: ${pontuacaoAtual.toFixed(2)}`;
    };

    // Adicionar evento de mudança a cada checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", calcularPontuacao);
    });

    // Atualizar pontuação ao carregar a página
    calcularPontuacao();

    document.getElementById("save-pdf").addEventListener("click", function () {
        const form = document.querySelector("form");
        const formData = new FormData(form);
        const { jsPDF } = window.jspdf; // jsPDF carregado da biblioteca
        const doc = new jsPDF();

        // Título
        doc.setFontSize(16);
        doc.text("Formulário de Avaliação - HelpCenter Chatbot", 10, 10);

        // Informações do Atendimento
        doc.setFontSize(12);
        doc.text("Informações do Atendimento:", 10, 20);
        let yPosition = 30;

        doc.setFontSize(10);
        doc.text(`Número do Atendimento: ${formData.get("numero_atendimento")}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Matrícula/Chave: ${formData.get("matricula")}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Assunto: ${formData.get("assunto")}`, 10, yPosition);
        yPosition += 10;

        
        // Nota Final
        doc.text(`Pontuação Final: ${pontuacaoAtual.toFixed(2)}`, 20, yPosition);
        yPosition += 20;

        // Critérios Avaliados (apenas os selecionados)
        doc.text("Critérios Selecionados:", 10, yPosition);
        yPosition += 10;

         // Comentários Gerais
         doc.text("Comentários gerais:", 10, yPosition);
         yPosition += 10;
         doc.text(formData.get("comentarios_gerais") || "Nenhum comentário.", 10, yPosition);
         yPosition += 20;


        const addWrappedText = (doc, text, x, y, maxWidth, lineHeight) => {
            const words = text.split(" ");
            let line = "";
            words.forEach((word) => {
                const testLine = line + word + " ";
                const testWidth = doc.getTextWidth(testLine);
                if (testWidth > maxWidth && line !== "") {
                    doc.text(line, x, y);
                    line = word + " ";
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            });
            if (line !== "") {
                doc.text(line, x, y);
                y += lineHeight;
            }
            return y;
        };

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                if (yPosition > 280) { // Adicionar nova página, se necessário
                    doc.addPage();
                    yPosition = 10;
                }
                const criterio = checkbox.name.replace("[]", ""); // Remove o sufixo []
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                const descricao = label ? label.textContent.trim() : "Sem descrição";

                // Adicionar descrição com quebra de linha
                yPosition = addWrappedText(
                    doc,
                    `- ${criterio}: ${descricao}`,
                    10,
                    yPosition,
                    180, // Largura máxima do texto
                    10 // Altura da linha
                );
            }
        });

        // Salvar o PDF
        doc.save("formulario_avaliacao.pdf");
    });
});
