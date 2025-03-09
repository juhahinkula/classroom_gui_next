import AssignmentsClient from "@/app/components/AssignmentsClient";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Suspense } from "react";

export default async function AssignmentsPage({ params }: { params: { id: string } }) {
  const { id }  = await params;
  const token = process.env.GITHUB_TOKEN;

  let assignments = [];
  let error = null;
  
  try {
    const response = await fetch(`https://api.github.com/classrooms/${id}/assignments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      },
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }
    
    assignments = await response.json();
  } catch (err) {
    error = 'Failed to load assignments';
    console.error('Error fetching assignments:', err);
  }

  return(
    <Suspense fallback={<LoadingIndicator />}>
      <AssignmentsClient 
        assignments={assignments} 
        classroomId={id} 
        error={error}
      />
    </Suspense>
  );
}