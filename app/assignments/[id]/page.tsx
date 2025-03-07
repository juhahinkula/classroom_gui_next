import AssignmentsClient from "@/app/components/AssignmentsClient";
import { Suspense } from "react";

export default async function AssignmentsPage({ params }: { params: { id: string } }) {
  const classroomId = params.id;
  const token = process.env.GITHUB_TOKEN; // Server-side environment variable (no NEXT_PUBLIC prefix)
  
  let assignments = [];
  let error = null;
  
  try {
    const response = await fetch(`https://api.github.com/classrooms/${classroomId}/assignments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.classroom-preview+json'
      },
      next: { revalidate: 60 } // Cache data for 60 seconds
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
    <Suspense fallback={<p>Loading...</p>}>
      <AssignmentsClient 
        assignments={assignments} 
        classroomId={classroomId} 
        error={error}
      />
    </Suspense>
  );
}