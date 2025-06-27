
import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface PatientCardProps {
  patient: Patient;
  onScheduleAppointment: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onScheduleAppointment }) => {
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

        <Button 
          onClick={() => onScheduleAppointment(patient.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
