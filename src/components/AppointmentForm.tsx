
import React, { useState } from 'react';
import { Calendar, Clock, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Patient {
  id: string;
  name: string;
  totalHours: number;
  usedHours: number;
}

interface AppointmentFormProps {
  patients: Patient[];
  onScheduleAppointment: (appointment: {
    patientId: string;
    date: string;
    time: string;
    duration: number;
    treatment: string;
  }) => void;
  onCancel: () => void;
  selectedPatientId?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patients,
  onScheduleAppointment,
  onCancel,
  selectedPatientId
}) => {
  const [formData, setFormData] = useState({
    patientId: selectedPatientId || '',
    date: '',
    time: '',
    duration: 1,
    treatment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleAppointment(formData);
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const remainingHours = selectedPatient ? selectedPatient.totalHours - selectedPatient.usedHours : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Schedule Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select 
              value={formData.patientId} 
              onValueChange={(value) => setFormData({...formData, patientId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {patient.name} ({patient.totalHours - patient.usedHours}h remaining)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Select 
              value={formData.duration.toString()} 
              onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0.5, 1, 1.5, 2, 2.5, 3].map(hour => (
                  <SelectItem key={hour} value={hour.toString()}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {hour} {hour === 1 ? 'hour' : 'hours'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment</Label>
            <Input
              id="treatment"
              placeholder="e.g., Cleaning, Root Canal, Filling"
              value={formData.treatment}
              onChange={(e) => setFormData({...formData, treatment: e.target.value})}
              required
            />
          </div>

          {selectedPatient && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Remaining Hours:</span>
                <span className="font-bold text-blue-600">{remainingHours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>After Appointment:</span>
                <span className={`font-bold ${remainingHours - formData.duration >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingHours - formData.duration}h
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!formData.patientId || !formData.date || !formData.time || !formData.treatment || (selectedPatient && remainingHours - formData.duration < 0)}
            >
              <Save className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
