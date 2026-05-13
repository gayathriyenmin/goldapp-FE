import React, { useMemo } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Search, UserPlus, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, Button } from '../../components/common';
import type { Customer } from '../../interfaces';
import { formatCurrency, formatDate } from '../../helpers';

const mockCustomers: Customer[] = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543210', address: 'Mumbai, India', joinDate: '2023-01-15', status: 'active', totalPaid: 50000, dueAmount: 5000, schemes: ['1'] },
  { id: '2', name: 'Sneha Patil', email: 'sneha@example.com', phone: '+91 9876543211', address: 'Pune, India', joinDate: '2023-02-20', status: 'active', totalPaid: 120000, dueAmount: 0, schemes: ['2'] },
  { id: '3', name: 'Amit Sharma', email: 'amit@example.com', phone: '+91 9876543212', address: 'Delhi, India', joinDate: '2023-03-10', status: 'inactive', totalPaid: 20000, dueAmount: 10000, schemes: ['1'] },
  { id: '4', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 9876543213', address: 'Bangalore, India', joinDate: '2023-04-05', status: 'active', totalPaid: 75000, dueAmount: 2500, schemes: ['3'] },
  { id: '5', name: 'Vikram Mehta', email: 'vikram@example.com', phone: '+91 9876543214', address: 'Ahmedabad, India', joinDate: '2023-05-12', status: 'active', totalPaid: 30000, dueAmount: 0, schemes: ['1'] },
];

const columnHelper = createColumnHelper<Customer>();

export const CustomerListScreen: React.FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Customer',
      cell: info => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-background font-bold">
            {info.getValue().charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-text-light">{info.getValue()}</div>
            <div className="text-xs text-slate-500">{info.row.original.email}</div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
    }),
    columnHelper.accessor('joinDate', {
      header: 'Join Date',
      cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          info.getValue() === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('totalPaid', {
      header: 'Total Paid',
      cell: info => (
        <span className="font-semibold text-primary">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Eye size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-colors">
            <Edit size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: mockCustomers,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Customers</h1>
          <p className="text-slate-400 mt-1">Manage and track your customer base</p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus size={20} />
          <span>Add New Customer</span>
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search customers..."
              className="w-full bg-background border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Show</span>
            <select className="bg-background border border-white/10 rounded-lg px-2 py-1 text-text-light focus:outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-white/5">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="text-left py-4 px-4 text-slate-400 font-medium text-sm">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-4 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Showing {table.getRowModel().rows.length} of {mockCustomers.length} customers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
