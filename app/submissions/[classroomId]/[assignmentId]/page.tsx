'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams, useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeEditor from './CodeEditor';
import { TextField } from '@mui/material';
import LoadingIndicator from '@/app/components/LoadingIndicator';

type Submission = {
  id: string;
  assignment_id: string;
  submitted_at: string;
  commit_sha: string;
  repository_url: string;
  grade: number | null;
  status: string;
}

function Submissions() {
  const params = useParams();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studentCode, setStudentCode] = useState("");
  const [path, setPath] = useState(process.env.NEXT_PUBLIC_FILE_PATH)
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  const classroomId = params.classroomId;
  const assignmentId = params.assignmentId;
   
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100 
    },
    { 
      field: 'studentName', 
      headerName: 'Student', 
      width: 200,
    },
    { 
      field: 'studentLogin', 
      headerName: 'Student login', 
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<OpenInNewIcon />}
          href={params.row.repository}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      )
    },
    {
      field: 'actions2',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => {
            fetchFileContent(params.row.repo_name)
              .then(() => setShowCodeEditor(true));
          }}
        >
          Code
        </Button>
      )
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/assignments/${assignmentId}/accepted_assignments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    })
    .then(response => {
      if (!response.ok) 
        throw new Error('Failed to fetch submissions');
        
      return response.json();
    })
    .then(data => {
      const flattenedData = data.map(submission => {
        return {
          ...submission,
          repository: submission.repository.html_url,
          repo_name: submission.repository.name,
          studentName: submission.students && submission.students.length > 0 ? 
                       submission.students[0].name : null,
          studentLogin: submission.students && submission.students.length > 0 ? 
                        submission.students[0].login : null
 
        };
      });
    
      setSubmissions(flattenedData);
      setError(null);
    })
    .catch(err => {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [classroomId, assignmentId, token]);

  function fetchFileContent(repo_name: string) {  
    const owner = process.env.NEXT_PUBLIC_OWNER_ORGANIZATION;
    const branch = 'main';
    
    const url = `https://api.github.com/repos/${owner}/${repo_name}/contents/${path}?ref=${branch}`;
    
    return fetch(url, 
      { 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Github API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const content = atob(data.content);
        setStudentCode(content);
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
        throw error;
      });
  }  

  const closeCodeEditor = () => {
    setShowCodeEditor(false);
  }

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="submissions-container">
      <Button onClick={() => router.push(`/assignments/${classroomId}`)}>Back</Button>
      <h1>Assignment Submissions</h1>
      <h3 style={{marginBottom: '20px'}}>Classroom ID: {classroomId} | Assignment ID: {assignmentId}</h3>
      
      {submissions.length === 0 ? (
        <p>No submissions found for this assignment.</p>
      ) : (
        <>
          <TextField 
            label="File path"
            value={path}
            onChange={event => setPath(event.target.value)}
          />
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={submissions}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              disableRowSelectionOnClick
            />
            <CodeEditor open={showCodeEditor} onClose={closeCodeEditor} code={studentCode} />
          </div>
        </>
      )}
    </div>
  );
}

export default Submissions;