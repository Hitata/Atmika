import React from 'react';
import TaskTable from '../TaskTable';

const DashboardHome = () => {
  return (
    <div>
      <h3>Dashboard Overview</h3>
      <p>Here you can monitor all recent activity.</p>
      <TaskTable />
    </div>
  );
};

export default DashboardHome;
