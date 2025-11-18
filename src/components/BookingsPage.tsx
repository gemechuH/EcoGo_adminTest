"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, MapPin, DollarSign, Clock, XCircle, CheckCircle } from 'lucide-react';
import { mockBookings } from '@/lib/mockData';
import { Booking } from '@/types';
import ComingSoon from './ComingSoon';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropoffLocation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Booking['status']) => {
    const colors = {
      pending: { bg: '#FEF3C7', text: '#92400E' },
      confirmed: { bg: '#DBEAFE', text: '#1E3A8A' },
      'in-progress': { bg: '#D0F5DC', text: '#1B6635' },
      completed: { bg: '#2DB85B', text: 'white' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B' },
    };
    return colors[status];
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      )
    );
    setSelectedBooking(null);
  };

  const handleConfirmBooking = (id: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'confirmed' } : booking
      )
    );
    setSelectedBooking(null);
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: '#2DB85B' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: '#92400E' },
    { label: 'In Progress', value: bookings.filter((b) => b.status === 'in-progress').length, color: '#1B6635' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: '#2DB85B' },
  ];

  return (
    // <div className="p-6 space-y-6">
    //   <div>
    //     <h1 style={{ color: '#2F3A3F' }}>Bookings & Dispatch</h1>
    //     <p style={{ color: '#2D2D2D' }}>Manage all bookings and dispatches</p>
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
    //             placeholder="Search by booking ID, user, or location..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10"
    //           />
    //         </div>
    //         <div className="flex gap-2">
    //           {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
    //             <Button
    //               key={status}
    //               variant={filterStatus === status ? 'default' : 'outline'}
    //               onClick={() => setFilterStatus(status)}
    //               style={
    //                 filterStatus === status
    //                   ? { backgroundColor: '#2DB85B', color: 'white' }
    //                   : {}
    //               }
    //             >
    //               {status.charAt(0).toUpperCase() + status.slice(1)}
    //             </Button>
    //           ))}
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <div className="grid grid-cols-1 gap-4">
    //     {filteredBookings.map((booking) => {
    //       const statusColor = getStatusColor(booking.status);
    //       return (
    //         <Card key={booking.id} className="hover:shadow-md transition-shadow">
    //           <CardContent className="pt-6">
    //             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
    //               <div className="flex-1">
    //                 <div className="flex items-center gap-3 mb-3">
    //                   <h4>{booking.id}</h4>
    //                   <Badge style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
    //                     {booking.status}
    //                   </Badge>
    //                 </div>
    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                   <div>
    //                     <p className="text-sm mb-1" style={{ color: '#2D2D2D' }}>User</p>
    //                     <p>{booking.userName}</p>
    //                   </div>
    //                   <div>
    //                     <p className="text-sm mb-1" style={{ color: '#2D2D2D' }}>Vehicle</p>
    //                     <p>{booking.vehicleType}</p>
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="flex-1">
    //                 <div className="flex items-start gap-3">
    //                   <MapPin className="w-5 h-5 mt-1" style={{ color: '#2DB85B' }} />
    //                   <div className="flex-1">
    //                     <p className="mb-2">{booking.pickupLocation}</p>
    //                     <div className="h-8 w-px mx-2" style={{ backgroundColor: '#E6E6E6' }}></div>
    //                     <p className="mt-2">{booking.dropoffLocation}</p>
    //                   </div>
    //                 </div>
    //               </div>

    //               <div className="flex flex-col items-end gap-3">
    //                 <div className="text-right">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <DollarSign className="w-4 h-4" style={{ color: '#2DB85B' }} />
    //                     <h4>${booking.fare.toFixed(2)}</h4>
    //                   </div>
    //                   <div className="flex items-center gap-2 text-sm" style={{ color: '#2D2D2D' }}>
    //                     <Clock className="w-4 h-4" />
    //                     {new Date(booking.createdAt).toLocaleString()}
    //                   </div>
    //                   <p className="text-sm mt-1" style={{ color: '#2D2D2D' }}>
    //                     {booking.distance} km
    //                   </p>
    //                 </div>
    //                 <div className="flex gap-2">
    //                   <Button
    //                     size="sm"
    //                     variant="outline"
    //                     onClick={() => setSelectedBooking(booking)}
    //                   >
    //                     View Details
    //                   </Button>
    //                   {booking.status === 'pending' && (
    //                     <Button
    //                       size="sm"
    //                       style={{ backgroundColor: '#2DB85B', color: 'white' }}
    //                       onClick={() => handleConfirmBooking(booking.id)}
    //                     >
    //                       <CheckCircle className="w-4 h-4 mr-1" />
    //                       Confirm
    //                     </Button>
    //                   )}
    //                   {(booking.status === 'pending' || booking.status === 'confirmed') && (
    //                     <Button
    //                       size="sm"
    //                       variant="destructive"
    //                       onClick={() => handleCancelBooking(booking.id)}
    //                     >
    //                       <XCircle className="w-4 h-4 mr-1" />
    //                       Cancel
    //                     </Button>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       );
    //     })}
    //   </div>

    //   <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
    //     <DialogContent>
    //       <DialogHeader>
    //         <DialogTitle>Booking Details</DialogTitle>
    //         <DialogDescription>
    //           Complete information for booking {selectedBooking?.id}
    //         </DialogDescription>
    //       </DialogHeader>
    //       {selectedBooking && (
    //         <div className="space-y-4">
    //           <div className="grid grid-cols-2 gap-4">
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Booking ID</p>
    //               <p>{selectedBooking.id}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Status</p>
    //               <Badge style={{
    //                 backgroundColor: getStatusColor(selectedBooking.status).bg,
    //                 color: getStatusColor(selectedBooking.status).text
    //               }}>
    //                 {selectedBooking.status}
    //               </Badge>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>User Name</p>
    //               <p>{selectedBooking.userName}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>User ID</p>
    //               <p>{selectedBooking.userId}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Vehicle Type</p>
    //               <p>{selectedBooking.vehicleType}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Distance</p>
    //               <p>{selectedBooking.distance} km</p>
    //             </div>
    //             <div className="col-span-2">
    //               <p className="text-sm mb-1" style={{ color: '#2D2D2D' }}>Pickup Location</p>
    //               <p>{selectedBooking.pickupLocation}</p>
    //             </div>
    //             <div className="col-span-2">
    //               <p className="text-sm mb-1" style={{ color: '#2D2D2D' }}>Dropoff Location</p>
    //               <p>{selectedBooking.dropoffLocation}</p>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Fare</p>
    //               <h4 style={{ color: '#2DB85B' }}>${selectedBooking.fare.toFixed(2)}</h4>
    //             </div>
    //             <div>
    //               <p className="text-sm" style={{ color: '#2D2D2D' }}>Created At</p>
    //               <p>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>
    // </div>
    <div>
           <ComingSoon/> 
        </div>
  );
}

