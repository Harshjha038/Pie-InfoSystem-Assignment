import { TableData } from "../table/TableData";
import { GridColDef } from '@mui/x-data-grid';


export const calculateTotals = (rowData: TableData[], setRowData: React.Dispatch<React.SetStateAction<TableData[]>>) => {
    let totalRevenue2021 = 0;
    let totalRevenue2022 = 0;
    let totalRevenue2024 = 0;
    let totalExpense2021 = 0;
    let totalExpense2022 = 0;
  
    rowData.forEach((row) => {
      if (row.type === 'Revenue') {
        totalRevenue2021 += parseFloat(row['2021'].replace(/,/g, '') || '0');
        totalRevenue2022 += parseFloat(row['2022'].replace(/,/g, '') || '0');
        totalRevenue2024 += parseFloat(row['2024'].replace(/,/g, '') || '0');
      } else if (row.type === 'Expense') {
        totalExpense2021 += parseFloat(row['2021'].replace(/,/g, '') || '0');
        totalExpense2022 += parseFloat(row['2022'].replace(/,/g, '') || '0');
      }
    });
  
    const updatedData = [...rowData];
    const totalRevenueRow = updatedData.find(row => row.type === 'TotalRevenue');
    if (totalRevenueRow) {
      totalRevenueRow['2021'] = totalRevenue2021.toFixed(2);
      totalRevenueRow['2022'] = totalRevenue2022.toFixed(2);
      totalRevenueRow['2024'] = totalRevenue2024.toFixed(2);
    }
  
    const totalExpenseRow = updatedData.find(row => row.type === 'TotalExpense');
    if (totalExpenseRow) {
      totalExpenseRow['2021'] = totalExpense2021.toFixed(2);
      totalExpenseRow['2022'] = totalExpense2022.toFixed(2);
    }
  
    setRowData(updatedData);
};
  
export const addNewRow = (prevRowData: TableData[], id: number, type: string): TableData[] => {
    const newIndex = prevRowData.length + 1; // Increment based on current length
    const newRow: TableData = {
      id: Date.now(),
      million: `New Row ${newIndex}`,
      '2021': '',
      '2022': '',
      '2024': '',
      type: type,
    };
    const insertIndex = prevRowData.findIndex(row => row.id === id);
    const updatedData = insertIndex !== -1
    ? [...prevRowData.slice(0, insertIndex), newRow, ...prevRowData.slice(insertIndex)]
    : [newRow, ...prevRowData];
    return updatedData;
};
  
export const calculateVariance = (value2022: number, value2024: number): string => {
    const variance = (value2024 - value2022).toFixed(2);
    return variance === '0.00' ? '' : variance;
};
  
export const calculateVariancePercentage = (value2022: number, value2024: number): string => {
    if (value2022 === 0) return '';
  
    const variance = calculateVariance(value2022, value2024);
    const variancePercentage = ((parseFloat(variance) / value2022) * 100).toFixed(2);
    return variancePercentage === '0.00' ? '' : `${variancePercentage}%`;
};

export const updateRowData = (
    data : any,
    rowData: TableData[]
  ): TableData[] => {
    const updatedRowData = data as TableData;
  
    const rowIndex = rowData.findIndex((params) => params.id === updatedRowData.id);
  
    if (rowIndex !== -1) {
      const updatedData = [...rowData];
      updatedData[rowIndex] = updatedRowData;
  
      if (updatedRowData.type === "Revenue") {  
        const val2022 = parseFloat(
          updatedRowData["2022"].replace(/,/g, "") || "0"
        );
        const val2024 = parseFloat(
          updatedRowData["2024"].replace(/,/g, "") || "0"
        );
  
        updatedData[rowIndex]["variance"] = calculateVariance(val2022, val2024);
        updatedData[rowIndex]["variancePercentage"] = calculateVariancePercentage(
          val2022,
          val2024
        );
      }
  
      return updatedData;
    }
  
    return rowData;
};

export const addNewColumn = (prevDefs: GridColDef []): GridColDef [] => {
    const newIndex = prevDefs.length;
    const newColumnDef: GridColDef  = {
      headerName: `New Column ${newIndex}`,
      field: `newColumn${newIndex}`,
      width: 150,
      editable: true,
      cellClassName: newIndex % 2 === 0 ? 'gray-color' : 'white-color',
    };
  
    return [...prevDefs, newColumnDef];
};
