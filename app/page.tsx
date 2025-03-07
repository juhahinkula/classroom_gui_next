import { Suspense } from 'react';
import ClassroomsClient from './components/ClassroomsClient';

async function ClassroomsPage() {
  const token = process.env.GITHUB_TOKEN;
  let classrooms = [];
  let error = null;
  
  try {
    const response = await fetch('https://api.github.com/classrooms', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.classroom-preview+json'
      },
      next: { revalidate: 60 } 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    classrooms = await response.json();
  } catch (err) {
    error = "Failed to fetch classrooms";
    console.error(err);
  }

  return (
    <Suspense fallback={<>Loading...</>}>
      <ClassroomsClient 
        classrooms={classrooms} 
        error={error} 
      />
    </Suspense>
  );
}

export default ClassroomsPage;