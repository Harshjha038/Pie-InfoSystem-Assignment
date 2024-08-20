import React, { useState, useCallback, useEffect } from 'react';
import { DataGrid, GridColDef, GridCellEditStopParams, GridValueGetter  } from '@mui/x-data-grid';
import './main.css';  // Import your custom CSS for styles
import { CiCircleChevDown  } from 'react-icons/ci';
import { initialTableData, initialColumn, TableData } from "../table/TableData";
import { calculateTotals, addNewRow, updateRowData, addNewColumn } from "../utils/calculateData";

const FinancialStatements: React.FC = () => {
  const [rowData, setRowData] = useState<TableData[]>(initialTableData);
  const [columnDefs, setColumnDefs] = useState<GridColDef[]>(initialColumn);
  const [activeTab, setActiveTab] = useState<string>('Profit & Loss');

  useEffect(() => {
    calculateTotals(rowData, setRowData);
  }, [rowData]);


  const handleAddNewRow = useCallback((id: number, type: string) => {
    setRowData(prevRowData => addNewRow(prevRowData, id, type));
  }, []);

  const handleCellValueChanged = useCallback(
    (params: GridCellEditStopParams  ) => {
      let updatedRowData = updateRowData(params, rowData);
      if (updatedRowData) {
        updatedRowData = updatedRowData.map(row => {
          const numericFields: (keyof TableData)[] = [2021, 2022, 2024] ;
          numericFields.forEach(field => {
            const value = row[field];
            if (typeof value === 'string' && value.trim() !== '') {
              // Parse and format only if value is a valid number
              const numericValue = parseFloat(value.replace(/,/g, ''));
              if (!isNaN(numericValue)) {
                (row as any)[field] = numericValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
              } else {
                // Preserve non-numeric text values
                (row as any)[field] = value;
              }
            } else {
              // Preserve non-numeric text values or empty strings
              (row as any)[field] = value;
            }
          });
          return row;
        });
  
        calculateTotals(updatedRowData, setRowData);
        setRowData(updatedRowData);
      }
    },
    [rowData]
  );

  const handleAddNewColumn = useCallback(() => {
    setColumnDefs(prevDefs => addNewColumn(prevDefs));
  }, []);

  const renderCell = columnDefs.map((def, index) => {
    if (index === 0) {
      return {
        ...def,
        renderCell: (params: any) => {
          if (params.row.isOthers) {
            return (
              <div>
                {params.value}
                <CiCircleChevDown 
                  size="20px"
                  color="black"
                  className="icon "
                  cursor= "pointer"
                  onClick={() => handleAddNewRow(params.row.id, params.row.type)}
                />
              </div>
            );
          }
          return (
            <span
              style={params.row.isHeader ? { fontWeight: "bold" } : undefined}
            >
              {params.value}
            </span>
          );
        },
      };
    }
    return def;
  });

  return (
    <div style={{ margin: '20px' }}>
      <h4 style={{ textAlign: 'left' }}>Financial statements</h4>
      <div className="tabs-container" style={{width: "100%"}}>
        <div className="horizontal-tabs">
          <div
            className={`tab ${activeTab === 'Profit & Loss' ? 'active' : ''}`}
            onClick={() => setActiveTab('Profit & Loss')}
          >
            Profit & Loss
          </div>
          <div className="tab disabled">Balance Sheet</div>
          <div className="tab disabled">Cashflow</div>
          <div className="tab disabled">Ratio</div>
        </div>

        <div className="horizontal-tabs">
          <button
            className="button-margin-right tab"
            onClick={handleAddNewColumn}
          >
            Add Column
          </button>
          <button className="button-margin-right tab disabled">
            Insert Comment
          </button>
          <button className="tab disabled">Update Columns</button>
        </div>
      </div>
      <div style={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={rowData}
          columns={renderCell}
          processRowUpdate={handleCellValueChanged}
          isCellEditable={(params : any) => params.row.isTotal || params.row.isOthers ? false : true}
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default FinancialStatements;