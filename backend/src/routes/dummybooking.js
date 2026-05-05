// Valid activity types: 'update' | 'action'

export const getActivityStyles = (activityType) => {
    if (activityType === 'action') {
      return {
        icon: '⚠️',              // replace with real icon
        bgClass: 'bg-red-50',
        textClass: 'text-red-600',
        label: 'Action required',
      };
    }
  
    return {
      icon: 'ℹ️',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
      label: 'Update',
    };
  };
  