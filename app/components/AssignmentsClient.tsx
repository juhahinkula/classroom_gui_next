'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

type AssignmentsClientProps = {
  assignments: Assignment[];
  classroomId: string;
  error: string | null;
}

export default function AssignmentsClient({ assignments, classroomId, error }: AssignmentsClientProps) {
  const router = useRouter();
  
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Id', 
      width: 100 
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => router.push(`/submissions/${classroomId}/${params.row.id}`)}
        >
          Submissions
        </Button>
      )
    }
  ];

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classrooms-container">
      <Button onClick={() => router.push('/')}>Classrooms</Button>
      <h1>GitHub Assignments: {classroomId}</h1>
      
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div style={{ height: 400, width: '90%' }}>
          <DataGrid
            rows={assignments}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>
      )}
    </div>
  );
}