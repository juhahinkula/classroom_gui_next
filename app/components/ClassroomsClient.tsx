'use client';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useRouter } from 'next/navigation';

type Classroom = {
  id: number;
  name: string;
  archived: boolean;
  url: string;
}

type ClassroomsClientProps = {
  classrooms: Classroom[];
  error: string | null;
}

export default function ClassroomsClient({ classrooms, error }: ClassroomsClientProps) {
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 100 },
    { field: 'name', headerName: 'Name', width: 350 },
    { field: 'archived', headerName: 'Archived', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<OpenInNewIcon />}
          href={params.row.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      )
    },
    {
      field: 'assignments',
      headerName: 'Assignments',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => router.push(`/assignments/${params.row.id}`)}
        >
          Assignments
        </Button>
      )
    }
  ];

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classrooms-container">
      <h1>GitHub Classrooms</h1>
      
      {classrooms.length === 0 ? (
        <p>No classrooms found.</p>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={classrooms}
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
