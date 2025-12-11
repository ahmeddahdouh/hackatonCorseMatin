import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export du rapport plan média en PDF
 */
export const exportPlanToPDF = async (plan, targetAudience, objectives) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Couleurs
  const blueMain = [33, 150, 243];
  const grayText = [80, 80, 80];
  const lightGray = [240, 240, 240];

  let yPos = 20;

  // 1. EN-TÊTE
  doc.setFillColor(...blueMain);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('PLAN MÉDIA', 20, 25);

  yPos = 50;

  // 2. RÉSUMÉ EXÉCUTIF
  doc.setFillColor(...lightGray);
  doc.rect(20, yPos - 5, 170, 30, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...grayText);
  doc.text('RÉSUMÉ EXÉCUTIF', 25, yPos + 5);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...grayText);
  yPos += 12;
  doc.text(
    `Campagne ciblant ${targetAudience.age} ans, ${targetAudience.csp}, région ${targetAudience.region}`,
    25,
    yPos
  );
  yPos += 7;
  doc.text(`Objectifs: ${objectives.join(', ')}`, 25, yPos);

  yPos += 25;

  // 3. KPIs PRINCIPAUX
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...grayText);
  doc.text('KPIs PRINCIPAUX', 20, yPos);

  yPos += 10;

  const kpiBoxWidth = 40;
  const kpiBoxHeight = 20;
  const kpiBoxes = [
    {
      label: 'Budget',
      value: `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(plan.kpis.budgetUtilise)}`,
      color: [33, 150, 243]
    },
    {
      label: 'Audience',
      value: `${(plan.kpis.reachTotal / 1000).toFixed(0)}K`,
      color: [76, 175, 80]
    },
    {
      label: 'Impressions',
      value: `${(plan.kpis.impressionsTotal / 1000).toFixed(0)}K`,
      color: [156, 39, 176]
    },
    {
      label: 'CPM',
      value: `${plan.kpis.cpmMoyen.toFixed(2)}€`,
      color: [255, 152, 0]
    },
  ];

  kpiBoxes.forEach((kpi, idx) => {
    const xPos = 20 + idx * (kpiBoxWidth + 5);
    doc.setFillColor(...kpi.color);
    doc.rect(xPos, yPos, kpiBoxWidth, kpiBoxHeight, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(kpi.label, xPos + 2, yPos + 5);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(kpi.value, xPos + 2, yPos + 15);
  });

  yPos += 35;

  // 4. PLAN MÉDIA PROPOSÉ
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...grayText);
  doc.text('PLAN MÉDIA PROPOSÉ', 20, yPos);

  yPos += 10;

  // Tableau des offres
  const tableData = plan.offers.map(offer => [
    offer.supportName,
    offer.formatName,
    offer.quantity.toString(),
    (offer.reach / 1000).toFixed(0) + 'K',
    (offer.impressions / 1000).toFixed(0) + 'K',
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(offer.totalPrice),
  ]);

  const startY = yPos;
  const lineHeight = 7;
  const columnWidths = [35, 30, 15, 20, 25, 30];
  const headers = ['Support', 'Format', 'Qty', 'Reach', 'Impr', 'Prix'];

  // En-têtes du tableau
  let xPos = 20;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(...blueMain);

  headers.forEach((header, idx) => {
    doc.rect(xPos, yPos, columnWidths[idx], lineHeight, 'F');
    doc.text(header, xPos + 2, yPos + 5, { maxWidth: columnWidths[idx] - 4 });
    xPos += columnWidths[idx];
  });

  yPos += lineHeight;

  // Lignes de données
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grayText);
  tableData.forEach((row, rowIdx) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const bgColor = rowIdx % 2 === 0 ? [255, 255, 255] : [245, 245, 245];
    doc.setFillColor(...bgColor);
    xPos = 20;

    row.forEach((cell, cellIdx) => {
      doc.rect(xPos, yPos, columnWidths[cellIdx], lineHeight, 'F');
      doc.text(cell, xPos + 2, yPos + 5, { maxWidth: columnWidths[cellIdx] - 4 });
      xPos += columnWidths[cellIdx];
    });

    yPos += lineHeight;
  });

  yPos += 10;

  // 5. RÉPARTITION
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...grayText);
  doc.text('RÉPARTITION BUDGÉTAIRE', 20, yPos);

  yPos += 10;

  // Print bar
  const barWidth = 150;
  const barHeight = 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Print (${plan.kpis.printPercentage}%)`, 20, yPos);
  doc.setFillColor(100, 150, 200);
  doc.rect(45, yPos - 5, (barWidth * parseFloat(plan.kpis.printPercentage)) / 100, barHeight, 'F');
  doc.setDrawColor(100, 100, 100);
  doc.rect(45, yPos - 5, barWidth, barHeight);
  doc.text(
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(plan.distribution.print),
    200,
    yPos
  );

  yPos += 15;

  // Digital bar
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Digital (${plan.kpis.digitalPercentage}%)`, 20, yPos);
  doc.setFillColor(100, 200, 100);
  doc.rect(45, yPos - 5, (barWidth * parseFloat(plan.kpis.digitalPercentage)) / 100, barHeight, 'F');
  doc.setDrawColor(100, 100, 100);
  doc.rect(45, yPos - 5, barWidth, barHeight);
  doc.text(
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(plan.distribution.digital),
    200,
    yPos
  );

  yPos += 25;

  // 6. PIED DE PAGE
  doc.setFont('Helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Plan Média Pro - Rapport généré automatiquement', 20, 280);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 286);

  // Sauvegarde
  const fileName = `Plan_Media_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);

  return fileName;
};
