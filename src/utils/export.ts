export const exportToTxt = (text: string) => {
  return new Blob([text], { type: 'text/plain' });
};

export const exportToCSV = <T>(rows: T[], columns: (keyof T)[]) => {
  // Generate CSV header row
  const header = columns.join(',');

  // Generate CSV rows
  const dataRows = rows.map(row => {
    return columns
      .map(column => {
        const value = row[column];
        return typeof value === 'string'
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      })
      .join(',');
  });

  // Combine header and rows
  const csvContent = [header, ...dataRows].join('\n');

  return new Blob([csvContent], { type: 'text/csv' });
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
