"use client"
import { Box, Button, FormControl, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import {
    MaterialReactTable,
    MRT_GlobalFilterTextField,
    MRT_ShowHideColumnsButton,
    MRT_TableContainer,
    MRT_TablePagination,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_ToolbarAlertBanner,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowData,
} from 'material-react-table';
import React, { useEffect } from 'react';
import SearchIcon from "@/assets/icons/search.svg?icon";

interface GenericTableProps<T extends MRT_RowData> {
    title?: React.ReactNode;
    data?: T[];
    columns: MRT_ColumnDef<T>[];
    onRowClick?: (row: T) => void;
}

const GenericTable = <T extends MRT_RowData>({ title, data, columns, onRowClick }: GenericTableProps<T>) => {

    const handleRowClick = (row: T) => {
        if (!!onRowClick) {
            onRowClick(row);
        }
    };

    const enhancedColumns = columns.map((col) => {
        if (col.Cell) return col;
        return ({
            ...col,
            Cell: ({ cell }: { cell: any }) => {
                const value = cell.getValue();
                return value?.toString();
            },
        })
    });
    const table = useMaterialReactTable({
        columns: enhancedColumns,
        data: data || [],
        enableColumnActions: false,
        enableColumnPinning: true,
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => handleRowClick(row.original),
            className: `${!!onRowClick && 'cursor-pointer hover:bg-[#f6fbff]'} bg-[#f7f9fa]`,
        }),
        muiTableHeadCellProps: () => ({
            className: 'align-middle bg-[#f7f9fa]',
        }),
        muiPaginationProps: {
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
        },
        paginationDisplayMode: 'pages',
        initialState: {
            columnPinning: { left: [], right: ['showHide'] },
        },
    });

    return (
        <div className='scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
            <div className='flex justify-between py-4 gap-2'>
                <div className="text-xl font-semibold">{title}</div>
                <div className='flex gap-2'>
                    <FormControl className=''>
                        <TextField
                            size="small"
                            placeholder='Search'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: '#e6eaed', // Change to your desired color
                                borderRadius: 8, // Optional: Add border-radius for rounded corners,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none', // Remove the border
                                    },
                                    '&:hover fieldset': {
                                        border: 'none', // Remove the border on hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: 'none', // Remove the border when focused
                                    },
                                },
                            }}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MRT_ShowHideColumnsButton table={table} />
                    </Box>
                </div>
            </div>
            <MRT_TableContainer
                table={table}
            />
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <MRT_TablePagination table={table} />
                </Box>
                <Box sx={{ display: 'grid', width: '100%' }}>
                    <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
                </Box>
            </Box>
        </div>
    );
};

export default GenericTable;
