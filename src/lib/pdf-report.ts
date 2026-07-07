import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Agendamento, Movimento, Config } from "./storage";
import { brl } from "./format";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function exportarRelatorioMensal(
  ags: Agendamento[],
  movs: Movimento[],
  config: Config,
  ref: Date = new Date(),
) {
  const mes = ref.getMonth();
  const ano = ref.getFullYear();
  const noMes = (d: string) => {
    const dt = new Date(d + "T00:00");
    return dt.getMonth() === mes && dt.getFullYear() === ano;
  };

  const agsMes = ags.filter((a) => noMes(a.data));
  const servicosConcluidos = agsMes.filter((a) => a.status === "concluido");
  const entradasServicos = servicosConcluidos.reduce((s, a) => s + Number(a.valor || 0), 0);
  const entradasExtras = movs
    .filter((m) => m.tipo === "entrada" && noMes(m.data))
    .reduce((s, m) => s + Number(m.valor || 0), 0);
  const saidas = movs
    .filter((m) => m.tipo === "saida" && noMes(m.data))
    .reduce((s, m) => s + Number(m.valor || 0), 0);
  const totalEntradas = entradasServicos + entradasExtras;
  const lucro = totalEntradas - saidas;

  const salario = (lucro * config.percentualSalario) / 100;
  const investimento = (lucro * config.percentualInvestimento) / 100;
  const reserva = (lucro * config.reservaEmergencia) / 100;
  const sobra = lucro - salario - investimento - reserva;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // Navy header band
  doc.setFillColor(24, 32, 74);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Navalha & Cifra", 40, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Relatório mensal da barbearia", 40, 62);
  doc.setFontSize(10);
  doc.text(`${MESES[mes]} / ${ano}`, W - 40, 42, { align: "right" });
  doc.text(
    `Emitido em ${new Date().toLocaleDateString("pt-BR")}`,
    W - 40,
    62,
    { align: "right" },
  );

  // Resumo
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Resumo do caixa", 40, 120);

  autoTable(doc, {
    startY: 130,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [24, 32, 74], textColor: 255 },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
    head: [["Descrição", "Valor"]],
    body: [
      ["Entradas — serviços (agenda concluída)", brl(entradasServicos)],
      ["Entradas — extras (produtos, gorjetas etc.)", brl(entradasExtras)],
      ["Total de entradas", brl(totalEntradas)],
      ["Total de saídas", `- ${brl(saidas)}`],
      ["Lucro líquido do mês", brl(lucro)],
    ],
  });

  // Distribuição
  const afterResumo = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY + 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Distribuição do lucro", 40, afterResumo);

  autoTable(doc, {
    startY: afterResumo + 10,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 8 },
    headStyles: { fillColor: [24, 32, 74], textColor: 255 },
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "right", fontStyle: "bold" },
    },
    head: [["Destinação", "%", "Valor"]],
    body: [
      ["Salário (retirada do dono)", `${config.percentualSalario}%`, brl(salario)],
      ["Reinvestimento no negócio", `${config.percentualInvestimento}%`, brl(investimento)],
      ["Reserva de emergência", `${config.reservaEmergencia}%`, brl(reserva)],
      [
        "Sobra livre",
        `${Math.max(0, 100 - config.percentualSalario - config.percentualInvestimento - config.reservaEmergencia)}%`,
        brl(sobra),
      ],
    ],
  });

  // Atendimentos concluídos
  const afterDist = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY + 25;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Atendimentos concluídos no mês", 40, afterDist);

  autoTable(doc, {
    startY: afterDist + 10,
    theme: "striped",
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [24, 32, 74], textColor: 255 },
    columnStyles: { 3: { halign: "right" } },
    head: [["Data", "Hora", "Cliente / Serviço", "Valor"]],
    body:
      servicosConcluidos.length === 0
        ? [["-", "-", "Nenhum atendimento concluído no mês", "-"]]
        : servicosConcluidos
            .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
            .map((a) => [
              formatData(a.data),
              a.hora,
              `${a.cliente} — ${a.servico}`,
              brl(a.valor),
            ]),
  });

  // Saídas
  const saidasMes = movs.filter((m) => m.tipo === "saida" && noMes(m.data));
  if (saidasMes.length > 0) {
    const afterAg = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Saídas do mês", 40, afterAg);

    autoTable(doc, {
      startY: afterAg + 10,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [24, 32, 74], textColor: 255 },
      columnStyles: { 3: { halign: "right" } },
      head: [["Data", "Categoria", "Descrição", "Valor"]],
      body: saidasMes
        .sort((a, b) => a.data.localeCompare(b.data))
        .map((m) => [formatData(m.data), m.categoria, m.descricao || "-", brl(m.valor)]),
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Navalha & Cifra · Relatório ${MESES[mes]}/${ano} · Página ${i} de ${pageCount}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" },
    );
  }

  doc.save(`relatorio-${ano}-${String(mes + 1).padStart(2, "0")}.pdf`);
}

function formatData(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y.slice(2)}`;
}
