'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface UserPreference {
  _id: string;
  name: string;
  email: string;
  preferences: {
    userTypes: string[];
    onboardingCompleted: boolean;
    [role: string]: any;
  };
  createdAt: string;
}

interface PDFDownloaderProps {
  users: UserPreference[];
}

const USER_TYPES = [
  { id: 'realtor', label: 'Realtors', color: 'bg-blue-100 text-blue-800' },
  { id: 'landlord', label: 'Landlords', color: 'bg-green-100 text-green-800' },
  { id: 'renter', label: 'Renters', color: 'bg-purple-100 text-purple-800' },
  { id: 'buyer', label: 'Buyers', color: 'bg-orange-100 text-orange-800' }
];

export default function PDFDownloader({ users }: PDFDownloaderProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['realtor', 'landlord', 'renter', 'buyer']);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const filteredUsers = users.filter(user => {
    if (selectedRoles.length === 0) return false;
    return user.preferences?.userTypes?.some(type => selectedRoles.includes(type));
  });

  const generatePDF = async () => {
    if (filteredUsers.length === 0) {
      alert('No users found with selected roles');
      return;
    }

    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Square One Rentals - Survey Responses', 20, 20);
      
      // Subtitle with selected roles
      doc.setFontSize(12);
      const roleLabels = selectedRoles.map(role => 
        USER_TYPES.find(t => t.id === role)?.label || role
      ).join(', ');
      doc.text(`Filtered by: ${roleLabels}`, 20, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 37);
      
      let yPosition = 50;
      
      filteredUsers.forEach((user, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // User header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${user.name}`, 20, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Email: ${user.email}`, 20, yPosition);
        
        yPosition += 6;
        doc.text(`Sign Up Date: ${new Date(user.createdAt).toLocaleDateString()}`, 20, yPosition);
        
        yPosition += 6;
        doc.text(`User Types: ${user.preferences?.userTypes?.join(', ') || 'None'}`, 20, yPosition);
        
        yPosition += 10;
        
        // User preferences details
        if (user.preferences?.userTypes) {
          user.preferences.userTypes.forEach(role => {
            if (selectedRoles.includes(role)) {
              const roleData = user.preferences[role];
              if (roleData && typeof roleData === 'object') {
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(`${role.charAt(0).toUpperCase() + role.slice(1)} Information:`, 20, yPosition);
                
                yPosition += 6;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                
                Object.entries(roleData).forEach(([key, value]) => {
                  if (value !== null && value !== undefined && value !== '') {
                    const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
                    
                    // Check if we need a new page
                    if (yPosition > 250) {
                      doc.addPage();
                      yPosition = 20;
                    }
                    
                    doc.text(`${displayKey}: ${displayValue}`, 25, yPosition);
                    yPosition += 5;
                  }
                });
                
                yPosition += 5;
              }
            }
          });
        }
        
        yPosition += 10;
        
        // Add separator line
        if (index < filteredUsers.length - 1) {
          doc.setDrawColor(200, 200, 200);
          doc.line(20, yPosition, 190, yPosition);
          yPosition += 5;
        }
      });
      
      // Save the PDF
      const fileName = `survey-responses-${selectedRoles.join('-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Download Survey Responses as PDF
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Role Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Select Roles to Include:</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {USER_TYPES.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={role.id}
                  checked={selectedRoles.includes(role.id)}
                  onCheckedChange={() => handleRoleToggle(role.id)}
                />
                <Label htmlFor={role.id} className="text-sm">
                  <Badge className={role.color}>
                    {role.label}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            <span className="font-medium">Summary:</span>
          </div>
          <div className="text-sm text-gray-600">
            {selectedRoles.length === 0 ? (
              <span className="text-red-600">No roles selected</span>
            ) : (
              <>
                <span>Selected roles: {selectedRoles.map(role => 
                  USER_TYPES.find(t => t.id === role)?.label || role
                ).join(', ')}</span>
                <br />
                <span>Users found: {filteredUsers.length}</span>
              </>
            )}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={generatePDF}
          disabled={isGenerating || selectedRoles.length === 0 || filteredUsers.length === 0}
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </CardContent>
    </Card>
  );
} 