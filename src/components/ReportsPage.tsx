"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Download, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { mockAuditLogs } from '@/lib/mockData';
import { AuditLog, UserRole } from '@/types';
import ComingSoon from './ComingSoon';

interface ReportsPageProps {
  userRole: UserRole;
}

export function ReportsPage({ userRole }: ReportsPageProps) {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterSeverity === 'all' || log.severity === filterSeverity;
    
    return matchesSearch && matchesFilter;
  });

  const getSeverityIcon = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: AuditLog['severity']) => {
    const colors = {
      critical: { bg: '#FEE2E2', text: '#991B1B' },
      warning: { bg: '#FEF3C7', text: '#92400E' },
      info: { bg: '#DBEAFE', text: '#1E40AF' },
    };
    return colors[severity];
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'User', 'Action', 'Timestamp', 'Details', 'Severity'],
      ...filteredLogs.map((log) => [
        log.id,
        log.user,
        log.action,
        log.timestamp,
        log.details,
        log.severity,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const stats = [
    { label: 'Total Logs', value: logs.length, color: '#2DB85B' },
    { label: 'Critical', value: logs.filter((l) => l.severity === 'critical').length, color: '#991B1B' },
    { label: 'Warnings', value: logs.filter((l) => l.severity === 'warning').length, color: '#92400E' },
    { label: 'Info', value: logs.filter((l) => l.severity === 'info').length, color: '#1E40AF' },
  ];

  const isAdmin = userRole === 'admin';

  return (
    // <div className="p-6 space-y-6">
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 style={{ color: '#2F3A3F' }}>
    //         {isAdmin ? 'Audit Logs' : 'Reports'}
    //       </h1>
    //       <p style={{ color: '#2D2D2D' }}>
    //         {isAdmin
    //           ? 'View and export system audit logs'
    //           : 'View limited operational reports'}
    //       </p>
    //     </div>
    //     {isAdmin && (
    //       <Button
    //         onClick={handleExport}
    //         style={{ backgroundColor: '#2DB85B', color: 'white' }}
    //       >
    //         <Download className="w-4 h-4 mr-2" />
    //         Export CSV
    //       </Button>
    //     )}
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    //     {stats.map((stat) => (
    //       <Card key={stat.label}>
    //         <CardContent className="pt-6">
    //           <h3 style={{ color: stat.color }}>{stat.value}</h3>
    //           <p style={{ color: '#2D2D2D' }}>{stat.label}</p>
    //         </CardContent>
    //       </Card>
    //     ))}
    //   </div>

    //   <Card>
    //     <CardContent className="pt-6">
    //       <div className="flex flex-col md:flex-row gap-4">
    //         <div className="flex-1 relative">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#2D2D2D' }} />
    //           <Input
    //             placeholder="Search logs by user, action, or details..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10"
    //           />
    //         </div>
    //         <div className="flex gap-2">
    //           {['all', 'critical', 'warning', 'info'].map((severity) => (
    //             <Button
    //               key={severity}
    //               variant={filterSeverity === severity ? 'default' : 'outline'}
    //               onClick={() => setFilterSeverity(severity)}
    //               style={
    //                 filterSeverity === severity
    //                   ? { backgroundColor: '#2DB85B', color: 'white' }
    //                   : {}
    //               }
    //             >
    //               {severity.charAt(0).toUpperCase() + severity.slice(1)}
    //             </Button>
    //           ))}
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {!isAdmin && (
    //     <Card style={{ backgroundColor: '#FEF3C7', borderColor: '#92400E' }}>
    //       <CardContent className="pt-6">
    //         <div className="flex items-start gap-3">
    //           <AlertCircle className="w-5 h-5 mt-1" style={{ color: '#92400E' }} />
    //           <div>
    //             <h4 style={{ color: '#92400E' }}>Limited Access</h4>
    //             <p style={{ color: '#92400E' }}>
    //               As an Operator, you have limited access to audit logs. Only recent operational logs are visible. Contact an Admin for full audit log access.
    //             </p>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   )}

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Recent Activity</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="space-y-3">
    //         {filteredLogs.map((log) => {
    //           const severityColor = getSeverityColor(log.severity);
    //           return (
    //             <div
    //               key={log.id}
    //               className="p-4 rounded-lg border"
    //               style={{ borderColor: '#E6E6E6' }}
    //             >
    //               <div className="flex items-start gap-4">
    //                 <div
    //                   className="p-2 rounded-lg"
    //                   style={{ backgroundColor: severityColor.bg, color: severityColor.text }}
    //                 >
    //                   {getSeverityIcon(log.severity)}
    //                 </div>

    //                 <div className="flex-1">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <h4>{log.action}</h4>
    //                     <Badge style={{ backgroundColor: severityColor.bg, color: severityColor.text }}>
    //                       {log.severity}
    //                     </Badge>
    //                   </div>
    //                   <p className="mb-2" style={{ color: '#2D2D2D' }}>{log.details}</p>
    //                   <div className="flex items-center gap-4 text-sm" style={{ color: '#2D2D2D' }}>
    //                     <span>User: {log.user}</span>
    //                     <span>•</span>
    //                     <span>{new Date(log.timestamp).toLocaleString()}</span>
    //                     <span>•</span>
    //                     <span>ID: {log.id}</span>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>

    //       {filteredLogs.length === 0 && (
    //         <div className="text-center py-12">
    //           <Info className="w-12 h-12 mx-auto mb-4" style={{ color: '#E6E6E6' }} />
    //           <h4 style={{ color: '#2D2D2D' }}>No logs found</h4>
    //           <p style={{ color: '#2D2D2D' }}>Try adjusting your search or filters</p>
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>
    // </div>
    <div>
               <ComingSoon/> 
            </div>
  );
}

