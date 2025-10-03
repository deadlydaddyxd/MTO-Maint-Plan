import { vehicleService, driverService, maintenanceService, taskOrderService } from './api';

export const analyticsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const [vehiclesRes, driversRes, maintenanceRes, taskOrdersRes] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        maintenanceService.getAll(),
        taskOrderService.getAll()
      ]);

      const vehicles = vehiclesRes.success ? (vehiclesRes.equipment || vehiclesRes.vehicles || []) : [];
      const drivers = driversRes.success ? (driversRes.drivers || []) : [];
      const maintenance = maintenanceRes.success ? (maintenanceRes.maintenance || []) : [];
      const taskOrders = taskOrdersRes.success ? (taskOrdersRes.taskOrders || []) : [];

      // Combine all tasks
      const allTasks = [...maintenance, ...taskOrders];

      // Calculate stats
      const stats = {
        vehicles: {
          total: vehicles.length,
          byCategory: this.groupByProperty(vehicles, 'category'),
          byLocation: this.groupByProperty(vehicles, 'location'),
          byStatus: this.groupByProperty(vehicles, 'status'),
          averageAge: this.calculateAverageAge(vehicles)
        },
        drivers: {
          total: drivers.length,
          byStatus: this.groupByProperty(drivers, 'status.currentStatus'),
          byRank: this.groupByProperty(drivers, 'serviceInfo.rank')
        },
        maintenance: {
          total: allTasks.length,
          completed: allTasks.filter(task => task.isCompleted || task.status === 'completed').length,
          overdue: this.getOverdueTasks(allTasks).length,
          dueThisWeek: this.getTasksDueThisWeek(allTasks).length,
          byPriority: this.groupByProperty(allTasks, 'priority'),
          byFrequency: this.groupByProperty(allTasks, 'frequency')
        }
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return { success: false, error: error.message };
    }
  },

  // Get equipment statistics by location
  getEquipmentByLocationStats: async () => {
    try {
      const response = await vehicleService.getAll();
      if (!response.success) return { success: false, error: 'Failed to fetch vehicles' };
      
      const vehicles = response.equipment || response.vehicles || [];
      const locationStats = {};

      vehicles.forEach(vehicle => {
        const location = vehicle.location || 'Unknown';
        if (!locationStats[location]) {
          locationStats[location] = {
            total: 0,
            categories: {},
            statuses: {}
          };
        }
        
        locationStats[location].total++;
        
        const category = vehicle.category || 'Unknown';
        locationStats[location].categories[category] = (locationStats[location].categories[category] || 0) + 1;
        
        const status = vehicle.status || 'Unknown';
        locationStats[location].statuses[status] = (locationStats[location].statuses[status] || 0) + 1;
      });

      return { success: true, data: locationStats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get driver statistics
  getDriverStats: async () => {
    try {
      const response = await driverService.getAll();
      if (!response.success) return { success: false, error: 'Failed to fetch drivers' };
      
      const drivers = response.drivers || [];
      const stats = {
        total: drivers.length,
        byStatus: this.groupByProperty(drivers, 'status.currentStatus'),
        byRank: this.groupByProperty(drivers, 'serviceInfo.rank'),
        byUnit: this.groupByProperty(drivers, 'serviceInfo.unit')
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get maintenance trends
  getMaintenanceTrends: async () => {
    try {
      const [maintenanceRes, taskOrdersRes] = await Promise.all([
        maintenanceService.getAll(),
        taskOrderService.getAll()
      ]);

      const maintenance = maintenanceRes.success ? (maintenanceRes.maintenance || []) : [];
      const taskOrders = taskOrdersRes.success ? (taskOrdersRes.taskOrders || []) : [];
      const allTasks = [...maintenance, ...taskOrders];

      const trends = {
        monthly: this.getMonthlyTrends(allTasks),
        byPriority: this.groupByProperty(allTasks, 'priority'),
        completionRate: this.calculateCompletionRate(allTasks),
        overdueTasks: this.getOverdueTasks(allTasks).length
      };

      return { success: true, data: trends };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Helper functions
  groupByProperty: (array, property) => {
    return array.reduce((acc, item) => {
      const value = this.getNestedProperty(item, property) || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  },

  getNestedProperty: (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },

  calculateAverageAge: (vehicles) => {
    const currentYear = new Date().getFullYear();
    const ages = vehicles
      .filter(v => v.year && !isNaN(v.year))
      .map(v => currentYear - parseInt(v.year));
    
    return ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
  },

  getOverdueTasks: (tasks) => {
    const today = new Date();
    return tasks.filter(task => {
      if (task.isCompleted || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    });
  },

  getTasksDueThisWeek: (tasks) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (task.isCompleted || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    });
  },

  calculateCompletionRate: (tasks) => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted || task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  },

  getMonthlyTrends: (tasks) => {
    const months = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = { total: 0, completed: 0 };
    }
    
    tasks.forEach(task => {
      const taskDate = new Date(task.createdAt || task.dueDate);
      const monthKey = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (months[monthKey]) {
        months[monthKey].total++;
        if (task.isCompleted || task.status === 'completed') {
          months[monthKey].completed++;
        }
      }
    });
    
    return months;
  }
};

export default analyticsService;