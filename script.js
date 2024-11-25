document.addEventListener("DOMContentLoaded", () => {
    const totalPoints = 100; // Pontuação inicial total
    const pointsDistribution = {
        resolutividade: 30,
        etica: 20,
        humanizado: 20,
        comunicacao: 20,
        procedimento: 10,
    };

    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const scoreDisplay = document.getElementById("score");

    // Função para calcular a pontuação restante
    const calculateScore = () => {
        let deductedPoints = 0;

        Object.keys(pointsDistribution).forEach((criteria) => {
            const groupCheckboxes = document.querySelectorAll(`input[name="${criteria}[]"]:checked`);
            const groupTotalCheckboxes = document.querySelectorAll(`input[name="${criteria}[]"]`).length;

            if (groupTotalCheckboxes > 0) {
                const deductionPerItem = pointsDistribution[criteria] / groupTotalCheckboxes;
                deductedPoints += groupCheckboxes.length * deductionPerItem;
            }
        });

        const remainingPoints = Math.max(0, totalPoints - deductedPoints);
        scoreDisplay.textContent = `Pontuação restante: ${remainingPoints.toFixed(2)}`;
    };

    // Adicionar evento de mudança a cada checkbox
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", calculateScore);
    });

    // Atualizar pontuação ao carregar a página
    calculateScore();

    document.addEventListener("DOMContentLoaded", () => {
        // Verifica se o jsPDF está carregado corretamente
        if (typeof jsPDF === "undefined") {
            alert("jsPDF não foi carregado corretamente.");
            return;
        }
    
        const { jsPDF } = window.jspdf;
        const generatePDFButton = document.getElementById("generatePDF");
    
        generatePDFButton.addEventListener("click", () => {
            // Captura os dados do formulário
            const atendimento = document.getElementById("numero_atendimento").value;
            const matricula = document.getElementById("matricula").value;
            const assunto = document.getElementById("assunto").value;
            const canal = document.getElementById("canal").value;
            const comentarios = document.getElementById("comentarios_gerais").value;
    
            // Captura as checkboxes marcadas
            const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
            const checkedItems = Array.from(checkboxes).map(cb => cb.nextSibling.textContent.trim());
    
            // Verifica se ao menos uma checkbox foi marcada
            if (checkedItems.length === 0) {
                alert("Nenhuma opção foi selecionada. Marque pelo menos uma opção.");
                return;
            }
    
            // Cria o PDF
            const pdf = new jsPDF();
    
            // Adiciona título
            pdf.setFontSize(16);
            pdf.text("Formulário de Avaliação - HelpCenter Chatbot", 10, 10);
    
            // Adiciona informações principais
            pdf.setFontSize(12);
            pdf.text(`Número do Atendimento: ${atendimento}`, 10, 20);
            pdf.text(`Matrícula/Chave: ${matricula}`, 10, 30);
            pdf.text(`Assunto: ${assunto}`, 10, 40);
            pdf.text(`Canal de Atendimento: ${canal}`, 10, 50);
    
            // Adiciona as checkboxes marcadas
            pdf.text("Critérios de Avaliação (itens marcados):", 10, 60);
            checkedItems.forEach((item, index) => {
                pdf.text(`- ${item}`, 10, 70 + index * 10);
            });
    
            // Adiciona comentários gerais
            if (comentarios) {
                pdf.text("Comentários Gerais:", 10, 70 + checkedItems.length * 10 + 10);
                pdf.text(comentarios, 10, 70 + checkedItems.length * 10 + 20);
            }
    
            // Salva o PDF
            const fileName = `formulario_atendimento_${atendimento || "sem_numero"}.pdf`;
            pdf.save(fileName);
        });
    });
});
