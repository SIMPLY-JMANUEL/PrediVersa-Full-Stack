import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Principal</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Estudiantes</h3>
            <p className="text-gray-600">Gestión de estudiantes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Cursos</h3>
            <p className="text-gray-600">Administrar cursos</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Reportes</h3>
            <p className="text-gray-600">Ver estadísticas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
