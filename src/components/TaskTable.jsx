import React from 'react';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};

const mockTasks = [
  { id: 1, user: 'Alice', task: 'Complete project proposal', status: 'In Progress', dueDate: '2025-08-15' },
  { id: 2, user: 'Bob', task: 'Develop new feature', status: 'Completed', dueDate: '2025-08-10' },
  { id: 3, user: 'Charlie', task: 'Fix login bug', status: 'Pending', dueDate: '2025-08-20' },
  { id: 4, user: 'Alice', task: 'Update documentation', status: 'In Progress', dueDate: '2025-08-22' },
  { id: 5, user: 'David', task: 'Deploy to staging', status: 'Pending', dueDate: '2025-08-18' },
];

const TaskTable = () => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <h4>All User Tasks</h4>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Task ID</th>
            <th style={thStyle}>Assigned User</th>
            <th style={thStyle}>Task Description</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {mockTasks.map(task => (
            <tr key={task.id}>
              <td style={tdStyle}>{task.id}</td>
              <td style={tdStyle}>{task.user}</td>
              <td style={tdStyle}>{task.task}</td>
              <td style={tdStyle}>{task.status}</td>
              <td style={tdStyle}>{task.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
