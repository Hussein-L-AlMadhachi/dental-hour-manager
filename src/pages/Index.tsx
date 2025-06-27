
import React, { useState } from 'react';
import { Plus, Calendar, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientCard from '@/components/PatientCard';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentList from '@/components/AppointmentList';
import PatientForm from '@/components/PatientForm';
import { toast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  totalHours: number;
  usedHours: number;
  phone: string;
  email: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  treatment: string;
}

const Index = () => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      totalHours: 15,
      usedHours: 3,
      phone: '(555) 123-4567',
      email: 'alice.j@email.com'
    },
    {
      id: '2',
      name: 'Bob Smith',
      totalHours: 10,
      usedHours: 7,
      phone: '(555) 987-6543',
      email: 'bob.smith@email.com'
    },
    {
      id: '3',
      name: 'Carol Davis',
      totalHours: 20,
      usedHours: 5,
      phone: '(555) 456-7890',
      email: 'carol.davis@email.com'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const handleScheduleAppointment = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowAppointmentForm(true);
  };

  const handleAddAppointment = (appointmentData: {
    patientId: string;
    date: string;
    time: string;
    duration: number;
    treatment: string;
  }) => {
    const patient = patients.find(p => p.id === appointmentData.patientId);
    if (!patient) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientName: patient.name,
      ...appointmentData
    };

    setAppointments([...appointments, newAppointment]);
    
    setPatients(patients.map(p => 
      p.id === appointmentData.patientId 
        ? { ...p, usedHours: p.usedHours + appointmentData.duration }
        : p
    ));

    setShowAppointmentForm(false);
    setSelectedPatientId('');
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment for ${patient.name} has been scheduled successfully.`,
    });
  };

  const handleDeleteAppointment = (id: string, duration: number, patientId: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    
    setPatients(patients.map(p => 
      p.id === patientId 
        ? { ...p, usedHours: Math.max(0, p.usedHours - duration) }
        : p
    ));

    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled and hours have been refunded.",
    });
  };

  const handleAddPatient = (patientData: {
    name: string;
    totalHours: number;
    phone: string;
    email: string;
  }) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      usedHours: 0,
      ...patientData
    };

    setPatients([...patients, newPatient]);
    setShowPatientForm(false);
    
    toast({
      title: "Patient Added",
      description: `${patientData.name} has been added successfully with ${patientData.totalHours} hours.`,
    });
  };

  const totalHours = patients.reduce((sum, patient) => sum + patient.totalHours, 0);
  const usedHours = patients.reduce((sum, patient) => sum + patient.usedHours, 0);
  const remainingHours = totalHours - usedHours;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dentist Appointment Manager
          </h1>
          <p className="text-gray-600 text-lg">
            Manage patients and track their allocated treatment hours
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
                <p className="text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{remainingHours}</p>
                <p className="text-gray-600">Hours Remaining</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
                <p className="text-gray-600">Appointments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {showAppointmentForm ? (
          <div className="flex justify-center">
            <AppointmentForm
              patients={patients}
              onScheduleAppointment={handleAddAppointment}
              onCancel={() => {
                setShowAppointmentForm(false);
                setSelectedPatientId('');
              }}
              selectedPatientId={selectedPatientId}
            />
          </div>
        ) : showPatientForm ? (
          <div className="flex justify-center">
            <PatientForm
              onAddPatient={handleAddPatient}
              onCancel={() => setShowPatientForm(false)}
            />
          </div>
        ) : (
          <Tabs defaultValue="patients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patients">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Patient Management</h2>
                <Button
                  onClick={() => setShowPatientForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onScheduleAppointment={handleScheduleAppointment}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Appointments</h2>
                <Button
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
              
              <AppointmentList
                appointments={appointments}
                onDeleteAppointment={handleDeleteAppointment}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
