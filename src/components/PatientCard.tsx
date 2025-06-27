
import React from 'react';
import { Clock, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Patient {
  id: string;
  name: string;
  totalHours: number;
  usedHours: number;
  phone: string;
  email: string;
}

interface PatientCardProps {
  patient: Patient;
  onScheduleAppointment: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onScheduleAppointment }) => {
  const remainingHours = patient.totalHours - patient.usedHours;
  const progressPercentage = (patient.usedHours / patient.totalHours) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-blue-600" />
          {patient.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{patient.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium text-xs">{patient.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Hours Remaining
            </span>
            <span className="font-bold text-lg text-blue-600">
              {remainingHours}h
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Used: {patient.usedHours}h</span>
            <span>Total: {patient.totalHours}h</span>
          </div>
        </div>

        <Button 
          onClick={() => onScheduleAppointment(patient.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={remainingHours <= 0}
        >
          <Calendar className="h-4 w-4 mr-2" />
          {remainingHours > 0 ? 'Schedule Appointment' : 'No Hours Remaining'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
