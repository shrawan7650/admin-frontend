export interface ExportData {
  [key: string]: string | number | boolean;
}

export function exportToCSV(data: ExportData[], filename: string = 'export') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function formatAnalyticsData(timeRange: string) {
  // Mock data based on time range
  const baseData = {
    '7days': [
      { date: '2024-01-14', posts: 2, views: 450, likes: 32, users: 15 },
      { date: '2024-01-15', posts: 1, views: 380, likes: 28, users: 12 },
      { date: '2024-01-16', posts: 3, views: 620, likes: 45, users: 22 },
      { date: '2024-01-17', posts: 0, views: 290, likes: 18, users: 8 },
      { date: '2024-01-18', posts: 2, views: 510, likes: 38, users: 18 },
      { date: '2024-01-19', posts: 1, views: 340, likes: 25, users: 14 },
      { date: '2024-01-20', posts: 2, views: 480, likes: 35, users: 19 }
    ],
    '30days': [
      { date: '2024-01-01', posts: 12, views: 4500, likes: 240, users: 120 },
      { date: '2024-01-02', posts: 8, views: 3200, likes: 180, users: 95 },
      { date: '2024-01-03', posts: 15, views: 5800, likes: 320, users: 145 },
      { date: '2024-01-04', posts: 6, views: 2400, likes: 140, users: 78 },
      { date: '2024-01-05', posts: 10, views: 4100, likes: 220, users: 110 }
    ],
    '3months': [
      { date: '2023-11-01', posts: 45, views: 18500, likes: 980, users: 450 },
      { date: '2023-12-01', posts: 52, views: 21200, likes: 1150, users: 520 },
      { date: '2024-01-01', posts: 48, views: 19800, likes: 1080, users: 485 }
    ],
    '6months': [
      { date: '2023-08-01', posts: 38, views: 15200, likes: 820, users: 380 },
      { date: '2023-09-01', posts: 42, views: 16800, likes: 910, users: 420 },
      { date: '2023-10-01', posts: 45, views: 18500, likes: 980, users: 450 },
      { date: '2023-11-01', posts: 52, views: 21200, likes: 1150, users: 520 },
      { date: '2023-12-01', posts: 48, views: 19800, likes: 1080, users: 485 },
      { date: '2024-01-01', posts: 55, views: 22500, likes: 1250, users: 580 }
    ],
    '1year': [
      { date: '2023-02-01', posts: 28, views: 11200, likes: 580, users: 280 },
      { date: '2023-03-01', posts: 32, views: 12800, likes: 680, users: 320 },
      { date: '2023-04-01', posts: 35, views: 14200, likes: 750, users: 350 },
      { date: '2023-05-01', posts: 38, views: 15200, likes: 820, users: 380 },
      { date: '2023-06-01', posts: 42, views: 16800, likes: 910, users: 420 },
      { date: '2023-07-01', posts: 45, views: 18500, likes: 980, users: 450 },
      { date: '2023-08-01', posts: 52, views: 21200, likes: 1150, users: 520 },
      { date: '2023-09-01', posts: 48, views: 19800, likes: 1080, users: 485 },
      { date: '2023-10-01', posts: 55, views: 22500, likes: 1250, users: 580 },
      { date: '2023-11-01', posts: 58, views: 24200, likes: 1350, users: 620 },
      { date: '2023-12-01', posts: 62, views: 26800, likes: 1480, users: 680 },
      { date: '2024-01-01', posts: 65, views: 28500, likes: 1580, users: 720 }
    ]
  };

  return baseData[timeRange as keyof typeof baseData] || baseData['30days'];
}