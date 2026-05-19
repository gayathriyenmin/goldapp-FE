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
import { Card, Button, Modal } from '../../components/common';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
import type { Customer } from '../../interfaces';
import { formatCurrency, formatDate } from '../../helpers';
import { useCustomers } from '../../hooks/useCustomers';
import { CheckCircle, Clock, XCircle, ArrowLeft } from 'lucide-react';


const columnHelper = createColumnHelper<Customer>();

export const CustomerListScreen: React.FC = () => {
  const { customers, isLoading } = useCustomers();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [selectedScheme, setSelectedScheme] = React.useState<any>(null);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Customer',
      cell: info => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-background font-bold">
            {info.getValue()?.charAt(0) || 'C'}
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
    // columnHelper.accessor('totalPaid', {
    //   header: 'Total Paid',
    //   cell: info => (
    //     <span className="font-semibold text-primary">{formatCurrency(info.getValue())}</span>
    //   ),
    // }),
    // columnHelper.display({
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: () => (
    //     <div className="flex items-center space-x-2">
    //       <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
    //         <Eye size={18} />
    //       </button>
    //       <button className="p-2 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-colors">
    //         <Edit size={18} />
    //       </button>
    //       <button className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
    //         <Trash2 size={18} />
    //       </button>
    //     </div>
    //   ),
    // }),
  ], []);

  const table = useReactTable({
    data: customers,
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

  if (isLoading) {
    return <PremiumPageLoader isLoading={true} text="Synchronizing Customers" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Customers</h1>
          <p className="text-slate-400 mt-1">Manage and track your customer base</p>
        </div>
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
                <tr 
                  key={row.id} 
                  className="group hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(row.original)}
                >
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
            Showing {table.getRowModel().rows.length} of {customers.length} customers
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

      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => {
          setSelectedCustomer(null);
          setSelectedScheme(null);
        }}
        title={selectedScheme ? 'Installment Progress' : 'Customer Schemes'}
      >
        {selectedCustomer && (
          <div className="space-y-4">
            {!selectedScheme ? (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-background font-bold text-xl">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-light">{selectedCustomer.name}</h3>
                    <p className="text-sm text-slate-400">{selectedCustomer.phone} • {selectedCustomer.email}</p>
                  </div>
                </div>
                
                <h4 className="font-semibold text-slate-300 mb-3">Joined Schemes</h4>
                {selectedCustomer.customerSchemes && selectedCustomer.customerSchemes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.customerSchemes.map((cs: any) => (
                      <div 
                        key={cs.id}
                        onClick={() => setSelectedScheme(cs)}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <div className="font-semibold text-text-light">{cs.scheme?.name || 'Gold Scheme'}</div>
                          <div className="text-xs text-slate-400 mt-1">Scheme Number: {cs.schemeNumber}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${cs.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {cs.status}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">Paid: {formatCurrency(cs.totalPaidAmount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-400">No schemes found for this customer.</div>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedScheme(null)}
                  className="flex items-center text-sm text-primary hover:underline mb-4"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to Schemes
                </button>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
                  <h4 className="font-semibold text-text-light">{selectedScheme.scheme?.name || 'Scheme Details'}</h4>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="text-success font-bold">{formatCurrency(selectedScheme.totalPaidAmount)}</span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span className="text-slate-400">Pending Amount:</span>
                    <span className="text-danger font-bold">{formatCurrency(selectedScheme.pendingAmount)}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-300 mb-3">Installment History</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {selectedScheme.installments?.sort((a: any, b: any) => a.installmentNumber - b.installmentNumber).map((inst: any) => (
                    <div key={inst.id} className="flex items-center justify-between p-3 bg-background border border-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-slate-300">
                          #{inst.installmentNumber}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-light">{formatCurrency(inst.amount)}</div>
                          <div className="text-[10px] text-slate-400">Due: {formatDate(inst.dueDate)}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {inst.status === 'PAID' ? (
                          <span className="flex items-center text-success text-xs font-bold">
                            <CheckCircle size={14} className="mr-1" /> PAID
                          </span>
                        ) : inst.status === 'PENDING' ? (
                          <span className="flex items-center text-warning text-xs font-bold">
                            <Clock size={14} className="mr-1" /> PENDING
                          </span>
                        ) : (
                          <span className="flex items-center text-danger text-xs font-bold">
                            <XCircle size={14} className="mr-1" /> DEFAULTED
                          </span>
                        )}
                        {inst.paidDate && (
                          <span className="text-[10px] text-slate-400 mt-1">Paid on: {formatDate(inst.paidDate)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {!selectedScheme.installments?.length && (
                    <div className="text-center py-4 text-slate-400 text-sm">No installments generated yet.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
