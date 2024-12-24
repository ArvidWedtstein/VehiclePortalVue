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

export const parseRowsToTable = <T extends Record<string, unknown>>(
  rows: T[],
  columns: Array<keyof T>,
) => {
  const divider = '|';
  const headerRowDivider = '-';

  const formattedRows = rows.map(row => {
    return columns.reduce((acc, column) => {
      if (column in row) {
        acc[column] = row[column];
      }
      return acc;
    }, {} as Partial<T>);
  });

  const columnsLength = columns.map(col => {
    const maxColumnLength = Math.max(
      ...formattedRows.map(
        row => String(row[col]).replace(/(?:\r\n|\r|\n)/g, '').length,
      ),
      String(col).length,
    );

    return {
      column: col,
      length: maxColumnLength + 1,
    };
  });

  const headerRow = columnsLength
    .map(({ column, length }) => {
      return `${String(column)}${' '.repeat(length - String(column).length)}`;
    })
    .join(divider);

  const dividerRow = columnsLength
    .map(({ length }) => headerRowDivider.repeat(length))
    .join(divider);

  const rowsString = formattedRows
    .map(row => {
      return columnsLength
        .map(({ column, length }) => {
          return `${String(row[column])}${' '.repeat(length - String(row[column]).length)}`;
        })
        .join(divider);
    })
    .join('\n');

  return `${headerRow}\n${dividerRow}\n${rowsString}`;
};
