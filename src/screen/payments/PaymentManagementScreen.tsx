import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, Download, RotateCcw } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency, formatDateTime } from '../../helpers';
import { usePayments } from '../../hooks/usePayments';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from '../../utils/toast';

export const PaymentManagementScreen: React.FC = () => {
  const { payments, isLoading } = usePayments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [schemeFilter, setSchemeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Dynamic counts based on actual database data
  const successfulCount = useMemo(() => {
    return payments.filter((p: any) => 
      (p.status || p.paymentStatus || '').toLowerCase() === 'success'
    ).length;
  }, [payments]);

  const failedCount = useMemo(() => {
    return payments.filter((p: any) => 
      (p.status || p.paymentStatus || '').toLowerCase() === 'failed'
    ).length;
  }, [payments]);

  const pendingCount = useMemo(() => {
    return payments.filter((p: any) => 
      (p.status || p.paymentStatus || '').toLowerCase() === 'pending'
    ).length;
  }, [payments]);

  // Dynamically extract unique schemes from payments for filter dropdown
  const uniqueSchemes = useMemo(() => {
    const schemes = payments.map((p: any) => p.schemeName).filter(Boolean);
    return Array.from(new Set(schemes)) as string[];
  }, [payments]);

  // Combined client-side filtering and sorting logic
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
        (p.customerName && p.customerName.toLowerCase().includes(q)) ||
        (p.customer?.email && p.customer.email.toLowerCase().includes(q)) ||
        (p.schemeName && p.schemeName.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(p => {
        const displayStatus = (p.status || p.paymentStatus || '').toLowerCase();
        return displayStatus === statusFilter;
      });
    }

    // 3. Scheme Filter
    if (schemeFilter !== 'all') {
      result = result.filter(p => p.schemeName === schemeFilter);
    }

    // 4. Sort Order
    result.sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.date || 0).getTime();
      const dateB = new Date(b.paymentDate || b.date || 0).getTime();
      
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'highest') return b.amount - a.amount;
      if (sortBy === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [payments, searchQuery, statusFilter, schemeFilter, sortBy]);

  // Reset all filters back to default
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSchemeFilter('all');
    setSortBy('newest');
  };

  // Full CSV exporter
  const handleExportCSV = () => {
    if (filteredPayments.length === 0) return;
    
    // Define headers
    const headers = ['Transaction ID', 'Customer Name', 'Email', 'Scheme Name', 'Amount', 'Date & Time', 'Status'];
    
    // Map rows
    const rows = filteredPayments.map(p => [
      p.transactionId || `PAY-${p.id}`,
      p.customerName || 'N/A',
      p.customer?.email || '',
      p.schemeName || 'N/A',
      p.amount,
      p.paymentDate || p.date || '',
      p.status || p.paymentStatus || 'success'
    ]);
    
    // Build CSV string
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GoldSave_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Full PDF exporter that downloads directly
  const handleExportPDF = () => {
    if (filteredPayments.length === 0) return;

    try {
      // Resilient dynamic loader for jsPDF supporting both ESM named/default and CJS configurations
      let jsPDFClass = jsPDF;
      if (!jsPDFClass || typeof jsPDFClass !== 'function') {
        jsPDFClass = (jsPDF as any).default || (jsPDF as any).jsPDF;
      }
      
      // In some environments, it may be imported as a default object that contains the class
      if (typeof jsPDFClass !== 'function' && (jsPDFClass as any).jsPDF) {
        jsPDFClass = (jsPDFClass as any).jsPDF;
      }

      if (typeof jsPDFClass !== 'function') {
        throw new Error('jsPDF library class could not be resolved from package imports.');
      }

      const doc = new (jsPDFClass as any)();

      // 1. Header Branded Title
      doc.setFillColor(212, 175, 55); // Gold color #D4AF37
      doc.rect(15, 15, 180, 2, 'F'); // Branded line

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(15, 23, 42); // Charcoal slate-900
      doc.text('GoldSave', 15, 27);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text('Payment History Report', 15, 33);

      // 2. Report Metadata
      const generatedOn = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      doc.setFontSize(9);
      doc.text(`Generated: ${generatedOn}`, 195, 27, { align: 'right' });
      doc.text(`Total Transactions: ${filteredPayments.length}`, 195, 33, { align: 'right' });

      // 3. Stats Summary Bar
      const successTotal = filteredPayments.filter((p: any) => (p.status || p.paymentStatus || '').toLowerCase() === 'success').length;
      const pendingTotal = filteredPayments.filter((p: any) => (p.status || p.paymentStatus || '').toLowerCase() === 'pending').length;
      const failedTotal = filteredPayments.filter((p: any) => (p.status || p.paymentStatus || '').toLowerCase() === 'failed').length;

      // Draw Stats Summary box
      doc.setFillColor(248, 250, 252); // F8FAFC light grey
      doc.setDrawColor(226, 232, 240); // E2E8F0 border
      doc.roundedRect(15, 42, 180, 18, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(34, 197, 94); // success green
      doc.text(`Successful: ${successTotal}`, 25, 53);

      doc.setTextColor(245, 158, 11); // pending amber/accent
      doc.text(`Pending: ${pendingTotal}`, 85, 53);

      doc.setTextColor(239, 68, 68); // danger red
      doc.text(`Failed: ${failedTotal}`, 145, 53);

      // 4. Data Table
      const headers = [['Transaction ID', 'Customer', 'Scheme Name', 'Amount', 'Date & Time', 'Status']];
      const data = filteredPayments.map(p => [
        p.transactionId || `PAY-${p.id}`,
        `${p.customerName || 'N/A'}\n(${p.customer?.email || ''})`,
        p.schemeName || 'N/A',
        formatCurrency(p.amount).replace('₹', 'Rs. '),
        formatDateTime(p.paymentDate || p.date),
        (p.status || p.paymentStatus || 'success').toUpperCase()
      ]);

      // Resilient loader for autoTable extending the prototype or standalone execution
      let autoTableFunc = autoTable;
      if (!autoTableFunc || typeof autoTableFunc !== 'function') {
        autoTableFunc = (autoTable as any).default || (doc as any).autoTable;
      }

      if (typeof autoTableFunc !== 'function') {
        throw new Error('autoTable plugin function could not be resolved from package imports.');
      }

      (autoTableFunc as any)(doc, {
        head: headers,
        body: data,
        startY: 68,
        theme: 'striped',
        headStyles: {
          fillColor: [30, 41, 59], // Slate-800
          textColor: [248, 250, 252], // F8FAFC
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'left'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [51, 65, 85] // slate-700
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [184, 134, 11] }, // Gold accent for ID
          3: { fontStyle: 'bold', textColor: [15, 23, 42] } // Bold amount
        },
        styles: {
          cellPadding: 4,
          overflow: 'linebreak'
        },
        didDrawCell: (data) => {
          if (data.column.index === 5 && data.cell.section === 'body') {
            const status = data.cell.text[0];
            if (status === 'SUCCESS') {
              doc.setTextColor(34, 197, 94); // Green
            } else if (status === 'FAILED') {
              doc.setTextColor(239, 68, 68); // Red
            } else {
              doc.setTextColor(245, 158, 11); // Amber
            }
          }
        }
      });

      // 5. Filename structure requested: [month]-[date]-history.pdf
      const now = new Date();
      const monthName = now.toLocaleString('en-US', { month: 'long' }).toLowerCase();
      const dateNum = now.getDate();
      const fileName = `${monthName}-${dateNum}-history.pdf`;

      // Download PDF directly
      doc.save(fileName);
    } catch (error: any) {
      console.error('PDF Export Error:', error);
      toast.error(`Failed to export PDF: ${error?.message || error}`);
    }
  };

  if (isLoading) {
    return <PremiumPageLoader isLoading={true} text="Synchronizing Transactions" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Payment History</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor and track all financial transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button 
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} 
              disabled={filteredPayments.length === 0}
              className="flex items-center space-x-2"
            >
              <Download size={18} />
              <span>Export</span>
            </Button>
            
            {isExportDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsExportDropdownOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden py-1 animate-fadeIn">
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-light hover:bg-menu-hover hover:text-primary transition-colors flex items-center space-x-2.5 cursor-pointer font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      handleExportPDF();
                      setIsExportDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-text-light hover:bg-menu-hover hover:text-primary transition-colors flex items-center space-x-2.5 cursor-pointer font-medium border-t border-white/5"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span>Export as PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Permanent Filters Panel */}
      <Card className="p-4 bg-card/60 backdrop-blur-md border border-white/5 rounded-2xl space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search</label>
              <input 
                type="text"
                placeholder="Search name, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm text-text-light placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm text-text-light focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Scheme Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheme</label>
              <select 
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm text-text-light focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="all">All Schemes</option>
                {uniqueSchemes.map(scheme => (
                  <option key={scheme} value={scheme}>{scheme}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-sm text-text-light focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Amount: High to Low</option>
                <option value="lowest">Amount: Low to High</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end pt-1">
            <button 
              onClick={handleResetFilters}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-text-light cursor-pointer transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          </div>
        </Card>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-success/10 text-success rounded-2xl">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Successful</p>
            <h4 className="text-2xl font-bold text-text-light">{successfulCount}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-danger/10 text-danger rounded-2xl">
            <XCircle size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Failed</p>
            <h4 className="text-2xl font-bold text-text-light">{failedCount}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-accent/10 text-accent rounded-2xl">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Pending</p>
            <h4 className="text-2xl font-bold text-text-light">{pendingCount}</h4>
          </div>
        </Card>
      </div>

      {/* Payments Table Card */}
      <Card>
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <p className="text-lg font-semibold text-slate-350">No transactions found</p>
              <p className="text-sm text-slate-500 mt-1">Try resetting or modifying your search and filters.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Transaction ID</th>
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Customer</th>
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Scheme</th>
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Amount</th>
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Date & Time</th>
                  <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.map((payment: any) => {
                  const displayStatus = (payment.status || payment.paymentStatus || 'success').toLowerCase();
                  return (
                    <tr key={payment.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-primary">
                        {payment.transactionId || `PAY-${payment.id}`}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-text-light">{payment.customerName || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500">{payment.customer?.email || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{payment.schemeName || 'N/A'}</td>
                      <td className="py-4 px-4 font-bold text-text-light">{formatCurrency(payment.amount)}</td>
                      <td className="py-4 px-4 text-slate-500 text-sm">
                        {formatDateTime(payment.paymentDate || payment.date)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-fit space-x-1 ${
                          displayStatus === 'success' ? 'bg-success/10 text-success' : 
                          displayStatus === 'failed' ? 'bg-danger/10 text-danger' : 
                          'bg-accent/10 text-accent'
                        }`}>
                          {displayStatus === 'success' ? <CheckCircle2 size={12} /> : 
                           displayStatus === 'failed' ? <XCircle size={12} /> : 
                           <Clock size={12} />}
                          <span>{displayStatus}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
