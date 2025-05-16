
import React, { useState, useEffect } from 'react';
import { TeacherLayout } from '@/components/layout/teacher-layout';
import { getStudentActivities } from '@/lib/data';
import { Activity } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StudentActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    // Fetch all student activities without any arguments
    const fetchedActivities = getStudentActivities();
    setActivities(fetchedActivities);
  }, []);
  
  // Function to get appropriate badge color based on activity type
  const getBadgeVariant = (activityType: string) => {
    switch(activityType) {
      case 'login':
        return 'default';
      case 'logout':
        return 'outline';
      case 'chat_ai':
        return 'secondary';
      case 'chat_teacher':
        return 'destructive';
      default:
        return 'default';
    }
  };
  
  // Format activity type to be more readable
  const formatActivityType = (activityType: string) => {
    switch(activityType) {
      case 'chat_ai':
        return 'AI Chat';
      case 'chat_teacher':
        return 'Teacher Chat';
      default:
        return activityType.charAt(0).toUpperCase() + activityType.slice(1);
    }
  };
  
  return (
    <TeacherLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Student Activities</h1>
        
        <div className="grid gap-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getBadgeVariant(activity.activityType)}>
                          {formatActivityType(activity.activityType)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(activity.timestamp), 'PPP p')}
                        </span>
                      </div>
                      <p className="font-medium">Student ID: {activity.studentId}</p>
                      {activity.details && (
                        <p className="mt-2 text-muted-foreground">{activity.details}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-12">
              <p className="text-muted-foreground">No activities recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default StudentActivities;
