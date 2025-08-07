import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

Chart.register(...registerables);

export default function EventCharts({ eventos, userData }) {
  // Preparar dados para os gráficos
  const prepareChartData = () => {
    const meusEventos = eventos.filter(evento => evento.autor_id === userData.id);
    const outrosEventos = eventos.filter(evento => evento.autor_id !== userData.id);
    
    // Dados para gráfico de status
    const statusCounts = {
      pendente: meusEventos.filter(e => e.status === 'pendente').length,
      em_andamento: meusEventos.filter(e => e.status === 'em_andamento').length,
      concluido: meusEventos.filter(e => e.status === 'concluido').length,
    };
    
    // Dados para gráfico por ano
    const anos = [...new Set(eventos.map(e => e.ano))].sort();
    const eventosPorAno = anos.map(ano => ({
      ano,
      meus: meusEventos.filter(e => e.ano === ano).length,
      outros: outrosEventos.filter(e => e.ano === ano).length,
    }));
    
    return { statusCounts, eventosPorAno };
  };
  
  const { statusCounts, eventosPorAno } = prepareChartData();
  
  // Configuração do gráfico de status (Doughnut)
  const statusData = {
    labels: ['Pendentes', 'Em Andamento', 'Concluídos'],
    datasets: [{
      data: [statusCounts.pendente, statusCounts.em_andamento, statusCounts.concluido],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  };
  
  // Configuração do gráfico por ano (Bar)
  const anoData = {
    labels: eventosPorAno.map(item => item.ano),
    datasets: [
      {
        label: 'Meus Eventos',
        data: eventosPorAno.map(item => item.meus),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Outros Eventos',
        data: eventosPorAno.map(item => item.outros),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label || context.label}: ${context.raw}`;
          },
        },
      },
    },
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Status dos Meus Eventos</h3>
        <div className="h-64">
          <Doughnut data={statusData} options={options} />
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Eventos por Ano</h3>
        <div className="h-64">
          <Bar data={anoData} options={options} />
        </div>
      </div>
    </div>
  );
}