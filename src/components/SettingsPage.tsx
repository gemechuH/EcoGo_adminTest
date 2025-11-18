"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building, MapPin, DollarSign, Mail, Clock, Save, AlertCircle } from 'lucide-react';
import { mockSettings } from '@/lib/mockData';
import { Settings } from '@/types';
import { toast } from 'sonner';
import ComingSoon from './ComingSoon';

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof Settings, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setHasChanges(false);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setSettings(mockSettings);
    setHasChanges(false);
    toast.info('Settings reset to defaults');
  };

  return (
    // <div className="p-6 space-y-6">
    //   <div className="flex items-center justify-between">
    //     <div>
    //       <h1 style={{ color: '#2F3A3F' }}>System Settings</h1>
    //       <p style={{ color: '#2D2D2D' }}>Configure system-wide settings and preferences</p>
    //     </div>
    //     {hasChanges && (
    //       <div className="flex gap-2">
    //         <Button variant="outline" onClick={handleReset}>
    //           Reset
    //         </Button>
    //         <Button
    //           onClick={handleSave}
    //           style={{ backgroundColor: '#2DB85B', color: 'white' }}
    //         >
    //           <Save className="w-4 h-4 mr-2" />
    //           Save Changes
    //         </Button>
    //       </div>
    //     )}
    //   </div>

    //   {hasChanges && (
    //     <Card style={{ backgroundColor: '#FEF3C7', borderColor: '#92400E' }}>
    //       <CardContent className="pt-6">
    //         <div className="flex items-center gap-3">
    //           <AlertCircle className="w-5 h-5" style={{ color: '#92400E' }} />
    //           <p style={{ color: '#92400E' }}>
    //             You have unsaved changes. Don't forget to save your settings before leaving this page.
    //           </p>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   )}

    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="flex items-center gap-2">
    //         <Building className="w-5 h-5" style={{ color: '#2DB85B' }} />
    //         Company Information
    //       </CardTitle>
    //       <CardDescription>
    //         Basic company details and contact information
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="companyName">Company Name</Label>
    //           <Input
    //             id="companyName"
    //             value={settings.companyName}
    //             onChange={(e) => handleChange('companyName', e.target.value)}
    //           />
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="supportEmail">Support Email</Label>
    //           <div className="relative">
    //             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#2D2D2D' }} />
    //             <Input
    //               id="supportEmail"
    //               type="email"
    //               value={settings.supportEmail}
    //               onChange={(e) => handleChange('supportEmail', e.target.value)}
    //               className="pl-10"
    //             />
    //           </div>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="flex items-center gap-2">
    //         <MapPin className="w-5 h-5" style={{ color: '#2DB85B' }} />
    //         Booking Settings
    //       </CardTitle>
    //       <CardDescription>
    //         Configure booking rules and limitations
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="maxBookingDistance">Max Booking Distance (km)</Label>
    //           <Input
    //             id="maxBookingDistance"
    //             type="number"
    //             value={settings.maxBookingDistance}
    //             onChange={(e) => handleChange('maxBookingDistance', parseInt(e.target.value))}
    //           />
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Maximum distance allowed for a single booking
    //           </p>
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="cancellationWindow">Cancellation Window (minutes)</Label>
    //           <div className="relative">
    //             <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#2D2D2D' }} />
    //             <Input
    //               id="cancellationWindow"
    //               type="number"
    //               value={settings.cancellationWindow}
    //               onChange={(e) => handleChange('cancellationWindow', parseInt(e.target.value))}
    //               className="pl-10"
    //             />
    //           </div>
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Time window for free cancellation
    //           </p>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle className="flex items-center gap-2">
    //         <DollarSign className="w-5 h-5" style={{ color: '#2DB85B' }} />
    //         Pricing Settings
    //       </CardTitle>
    //       <CardDescription>
    //         Configure base rates and per-kilometer charges
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="baseRate">Base Rate ($)</Label>
    //           <Input
    //             id="baseRate"
    //             type="number"
    //             step="0.01"
    //             value={settings.baseRate}
    //             onChange={(e) => handleChange('baseRate', parseFloat(e.target.value))}
    //           />
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Base fare for every booking
    //           </p>
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="perKmRate">Per Kilometer Rate ($)</Label>
    //           <Input
    //             id="perKmRate"
    //             type="number"
    //             step="0.01"
    //             value={settings.perKmRate}
    //             onChange={(e) => handleChange('perKmRate', parseFloat(e.target.value))}
    //           />
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Charge per kilometer traveled
    //           </p>
    //         </div>
    //       </div>

    //       <div className="p-4 rounded-lg" style={{ backgroundColor: '#D0F5DC' }}>
    //         <h4 className="mb-2" style={{ color: '#1B6635' }}>Example Calculation</h4>
    //         <p style={{ color: '#2D2D2D' }}>
    //           A 25km trip would cost: ${settings.baseRate.toFixed(2)} (base) + ${(settings.perKmRate * 25).toFixed(2)} (distance) = ${(settings.baseRate + settings.perKmRate * 25).toFixed(2)}
    //         </p>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>System Settings</CardTitle>
    //       <CardDescription>
    //         Control system-wide features and access
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-6">
    //       <div className="flex items-center justify-between">
    //         <div className="space-y-1">
    //           <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Enable this to temporarily disable the system for maintenance
    //           </p>
    //         </div>
    //         <Switch
    //           id="maintenanceMode"
    //           checked={settings.maintenanceMode}
    //           onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
    //         />
    //       </div>

    //       <Separator />

    //       <div className="flex items-center justify-between">
    //         <div className="space-y-1">
    //           <Label htmlFor="allowNewRegistrations">Allow New Registrations</Label>
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Allow new users to register for the service
    //           </p>
    //         </div>
    //         <Switch
    //           id="allowNewRegistrations"
    //           checked={settings.allowNewRegistrations}
    //           onCheckedChange={(checked) => handleChange('allowNewRegistrations', checked)}
    //         />
    //       </div>
    //     </CardContent>
    //   </Card>

    //   <Card style={{ borderColor: '#FEE2E2' }}>
    //     <CardHeader>
    //       <CardTitle style={{ color: '#991B1B' }}>Danger Zone</CardTitle>
    //       <CardDescription>
    //         Critical system operations - use with caution
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h4>Reset All Settings</h4>
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Reset all system settings to default values
    //           </p>
    //         </div>
    //         <Button
    //           variant="outline"
    //           onClick={handleReset}
    //           style={{ borderColor: '#991B1B', color: '#991B1B' }}
    //         >
    //           Reset to Defaults
    //         </Button>
    //       </div>

    //       <Separator />

    //       <div className="flex items-center justify-between">
    //         <div>
    //           <h4>Export Configuration</h4>
    //           <p className="text-sm" style={{ color: '#2D2D2D' }}>
    //             Download current settings as JSON file
    //           </p>
    //         </div>
    //         <Button
    //           variant="outline"
    //           onClick={() => {
    //             const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    //             const url = window.URL.createObjectURL(blob);
    //             const a = document.createElement('a');
    //             a.href = url;
    //             a.download = `ecogo-settings-${new Date().toISOString()}.json`;
    //             a.click();
    //             toast.success('Settings exported');
    //           }}
    //         >
    //           Export
    //         </Button>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
    <div>
       <ComingSoon/> 
    </div>
  );
}

